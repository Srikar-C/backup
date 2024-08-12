import pg from "pg";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app = express();
const port = 3000;

const db = new pg.Client({
  port: 5432,
  host: "localhost",
  user: "postgres",
  database: "whatsappnew",
  password: "tiger",
});

db.connect();

//Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, (req, res) => {
  console.log(`Listening in http://localhost:${port}`);
});

//Table Names
const userTable = "users";
const friendTable = "friends";
const requestTable = "requests";
const chatTable = "chats";

//Create Tables
app.get("/", (req, res) => {
  const userQuery = `CREATE TABLE ${userTable}(userid serial primary key,username varchar(50),useremail varchar(100) unique,userphone char(10) unique,userpassword varchar(50));`;
  db.query(userQuery, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("User Table Created Successfully");
    }
  });

  const frendQuery = `CREATE TABLE ${friendTable}(fid serial primary key,userid integer,username varchar(50),userphone varchar(10),friendname varchar(50),friendphone varchar(10),status varchar(1) DEFAULT 1,pin boolean DEFAULT false);`;
  db.query(frendQuery, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Friend Table Created Successfully");
    }
  });

  const requestQuery = `CREATE TABLE ${requestTable}(rid serial primary key,fromname varchar(50),fromphone varchar(10),toname varchar(50),tophone varchar(10));`;
  db.query(requestQuery, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Request Table Created Successfully");
    }
  });

  const chatQuery = `CREATE TABLE ${chatTable}(id serial primary key,fromphone varchar(10),tophone varchar(10),message text,hours varchar(2),minutes varchar(2),seconds varchar(2));`;
  db.query(chatQuery, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Send Chat Table Created Successfully");
    }
  });
});

//Register User
app.post("/register", (req, res) => {
  const { useremail, userphone, userpassword, username } = req.body;
  console.log(
    `Registering User Details are:\nUseremail->${useremail}\nUserphone->${userphone}\nUserpassword->${userpassword}\nUsername->${username}`
  );
  const checkReg = `SELECT * FROM ${userTable} where useremail = $1 or userphone = $2;`;
  db.query(checkReg, [useremail, userphone], (err, response) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Checking User in Database" });
    } else if (response.rows.length > 0) {
      console.log(
        `${useremail} or ${userphone} is already Registered, Please Login`
      );
      res.status(303).send({
        message: `${useremail} or ${userphone} is already Registered, Please Login`,
      });
    } else if (response.rows.length === 0) {
      if (userphone.length !== 10) {
        console.log("Invalid Phone Number");
        res.status(400).send({ message: "Invalid Phone Number" });
      }
      const regQuery = `INSERT INTO ${userTable} (username,useremail,userphone,userpassword) VALUES ($4,$1,$2,$3) RETURNING *;`;
      db.query(
        regQuery,
        [useremail, userphone, userpassword, username],
        (error, result) => {
          if (error) {
            console.log(error.message);
            res
              .status(500)
              .send({ message: `Error in Registering the User in Database` });
          } else {
            console.log("User Registered successfully");
            res.status(201).send(result.rows[0]);
          }
        }
      );
    }
  });
});

//Login User
app.post("/login", (req, res) => {
  const { userphone, userpassword } = req.body;
  console.log(
    `Logging User Details:\nUserphone->${userphone}\nUserpassword->${userpassword}`
  );

  const checkLog = `SELECT * FROM ${userTable} where userphone = $1;`;
  db.query(checkLog, [userphone], (err, response) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Checking User in Database" });
    } else if (userphone.length !== 10) {
      console.log("Invalid Phone Number");
      res.status(400).send({ message: "Invalid Phone Number" });
    } else if (response.rows.length === 0) {
      console.log(`${userphone} is not an Existing User, Please register`);
      res.status(404).send({
        message: `${userphone} is not an Existing User, Please register`,
      });
    } else if (response.rows.length > 0) {
      const { userpassword: hashedPassword } = response.rows[0];
      if (userpassword === hashedPassword) {
        console.log("User Logged In successfully");
        res.status(201).send(response.rows[0]);
      } else {
        console.log("Incorrect Password");
        res.status(401).send({ message: "Incorrect Password" });
      }
    }
  });
});

//Sending OTP to email
app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  const query = `SELECT * FROM ${userTable} WHERE useremail=$1;`;
  db.query(query, [to], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Checking User in Database" });
    } else if (result.rows.length > 0) {
      console.log(`Sending OTP to registered email ${to}`);
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "csrikar2003@gmail.com",
          pass: "wdmo gctv fcec qjhe",
        },
      });
      const mailOptions = {
        from: "csrikar2003@gmail.com",
        to: to,
        subject: subject,
        text:
          "Follow These steps to change your password\n" +
          "1) Enter this OTP: " +
          text +
          "\n" +
          "2) Click on Verify OTP\n" +
          "3) And Change your Password",
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: Unable to send email");
        } else {
          console.log("Email sent: " + info.response);
          res.status(201).send({ message: "Email sent successfully" });
        }
      });
    } else {
      console.log("No User with this email ID");
      res.status(404).send({ message: "No User with this email ID" });
    }
  });
});

//Changing Passwords
app.post("/changepassword", (req, res) => {
  const { useremail, password } = req.body;
  console.log("Changing Password");
  const changeQuery = `UPDATE ${userTable} SET userpassword=$2 where useremail=$1 RETURNING *;`;
  db.query(changeQuery, [useremail, password], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Changing Password" });
    } else {
      console.log("Password Changed successfully");
      res.status(201).send(result.rows[0]);
    }
  });
});

//Check Friend
app.post("/checkfriend", (req, res) => {
  const { userphone } = req.body;
  console.log("Checking Friend");
  const checkFriendQuery = `SELECT * FROM ${userTable} where userphone=$1;`;
  db.query(checkFriendQuery, [userphone], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Checking Friend" });
    } else if (result.rows.length === 0) {
      console.log("User not found");
      res
        .status(404)
        .send({ message: "User don't have account to communicate with you." });
    } else {
      console.log("Friend found");
      res.status(201).send(result.rows[0]);
    }
  });
});

//Add Friend
app.post("/addfriend", (req, res) => {
  const { uid, uname, uphone, fname, fphone } = req.body;
  console.log("Adding New Friend->" + uname);
  const addQuery = `INSERT INTO ${friendTable} (userid,username,userphone,friendname,friendphone) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;
  db.query(addQuery, [uid, uname, uphone, fname, fphone], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Adding Friend" });
    } else {
      console.log("Friend Added successfully");
      res.status(201).send(result.rows[0]);
    }
  });
});

//Request Friend
app.post("/requestfriend", (req, res) => {
  const { fromname, fromphone, toname, tophone } = req.body;
  console.log("Request Send to->" + toname + " From->" + fromname);
  const requestQuery = `INSERT INTO ${requestTable} (fromname,fromphone,toname,tophone) VALUES ($1,$2,$3,$4) RETURNING *;`;
  db.query(
    requestQuery,
    [fromname, fromphone, toname, tophone],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error in Requesting Friend" });
      } else {
        console.log("Friend Request sent successfully");
        res.status(201).send(result.rows[0]);
      }
    }
  );
});

//Check Request
app.post("/checkrequest", (req, res) => {
  const { phone } = req.body;
  console.log("Checking Friend Request");
  const checkRequestQuery = `SELECT * FROM ${requestTable} WHERE tophone=$1;`;
  db.query(checkRequestQuery, [phone], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Checking Request" });
    } else if (result.rows.length === 0) {
      console.log("No Friend Request found");
      res.status(404).send({ message: "No Friend Request found" });
    } else {
      console.log("Friend Request found" + result.rows);
      res.status(201).send(result.rows);
    }
  });
});

//Accept Friend Request
app.post("/acceptreq", (req, res) => {
  const { uid, username, userphone, friendname, friendphone, status } =
    req.body;
  console.log("Accepting Friend Requests");

  const acceptreq = `INSERT INTO ${friendTable} (userid, username, userphone,friendname, friendphone, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;`;
  db.query(
    acceptreq,
    [uid, username, userphone, friendname, friendphone, status],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error in Accepting Friend Request" });
      } else {
        console.log("Friend Request Accepted successfully");
        res.status(201).send(result.rows[0]);
      }
    }
  );
});

//Remove Request
app.post("/removereq", (req, res) => {
  const { rid } = req.body;
  console.log("Removing Friend Request");
  const removeQuery = `DELETE from ${requestTable} WHERE rid=$1;`;
  db.query(removeQuery, [rid], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Deleting Request" });
    } else {
      console.log("Request deleted successfully");
      res.status(201).send({ message: "Request deleted successfully" });
    }
  });
});

//Update Request
app.post("/updatereq", (req, res) => {
  const { userphone, friendphone } = req.body;
  console.log("Updating Status of Accept" + userphone, friendphone);
  console.log(userphone, friendphone);
  const updateQuery = `UPDATE ${friendTable} SET status='2' WHERE userphone=$1 AND friendphone=$2 RETURNING *;`;
  db.query(updateQuery, [userphone, friendphone], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Updating Request" });
    } else {
      console.log("Request updated successfully");
      res.status(201).send({ message: "Request updated successfully" });
    }
  });
});

//Change Request
app.post("/changereq", (req, res) => {
  const { userphone, friendphone } = req.body;
  console.log("Changing Status to Reject->", userphone, friendphone);
  const updateQuery = `UPDATE ${friendTable} SET status='0' WHERE userphone=$1 AND friendphone=$2 RETURNING *;`;
  db.query(updateQuery, [userphone, friendphone], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Changing Request" });
    } else {
      console.log("Request updated successfully");
      res.status(201).send({ message: "Request changed successfully" });
    }
  });
});

//Get Friends of respective user
app.post("/getfriends", (req, res) => {
  const { uid } = req.body;
  console.log("Getting Friends of user " + uid);
  const getFriendsQuery = `SELECT * FROM ${friendTable} WHERE userid=$1 order by pin desc;`;
  db.query(getFriendsQuery, [uid], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Getting Friends" });
    } else {
      console.log("Friends fetched successfully");
      res.status(201).send(result.rows);
    }
  });
});

//Change Pin
app.post("/changepin", (req, res) => {
  const { fid, uid } = req.body;
  console.log("Changing pin of friend ", fid, " of user ", uid);
  const pinQuery = `UPDATE ${friendTable} SET pin=NOT pin WHERE fid=$1 and userid=$2 RETURNING *;`;
  db.query(pinQuery, [fid, uid], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in Changing Pin" });
    } else {
      console.log("Pin changed successfully");
      res.status(201).send(result.rows[0]);
    }
  });
});

//Delete Friend
app.delete("/deletefriend_chat", (req, res) => {
  const { phone1, phone2, uid, fid, status } = req.body;
  console.log("Deleting Friend and their Chats", phone1, phone2);
  if (status !== "2") {
    const deleteQuery = `DELETE FROM ${friendTable} WHERE fid=$1 and userid=$2 RETURNING *;`;
    db.query(deleteQuery, [fid, uid], (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error in Deleting Friend" });
      } else {
        console.log("Friend deleted successfully");
        res.status(201).send({ message: "DELETION DONE" });
      }
    });
  } else if (status === "2") {
    const deletechatQuery = `DELETE FROM ${chatTable} WHERE (fromphone=$1 and tophone=$2) or (fromphone=$2 and tophone=$1);`;
    db.query(deletechatQuery, [phone1, phone2], (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error in Deleting Chat" });
      } else {
        console.log("Chat deleted successfully");
        const check = `SELECT * FROM ${friendTable} where fid=$1 and userid=$2;`;
        db.query(check, [fid, uid], (err, response) => {
          if (err) {
            console.log(err.message);
            res.status(500).send({ message: "Error in Checking Friend" });
          } else if (response.rows === 0) {
            console.log("Friend not found");
            res.status(201).send({ message: "NO DATA" });
          }
        });
        const deleteQuery = `DELETE FROM ${friendTable} WHERE fid=$1 and userid=$2 RETURNING *;`;
        db.query(deleteQuery, [fid, uid], (err, review) => {
          if (err) {
            console.log(err.message);
            res.status(500).send({ message: "Error in Deleting Friend" });
          } else {
            console.log("Friend deleted successfully");
            const updateQuery = `UPDATE ${friendTable} SET status='3' WHERE userphone=$2 AND friendphone=$1 RETURNING *;`;
            db.query(updateQuery, [phone1, phone2], (err, resp) => {
              if (err) {
                console.log(err.message);
                res.status(500).send({ message: "Error in Changing Request" });
              } else {
                console.log("Request updated successfully");
                res.status(201).send({ message: "DELETION DONE" });
              }
            });
          }
        });
      }
    });
  }
});

//Send Messages
app.post("/sendmsg", (req, res) => {
  const { fromphone, tophone, message, hours, minutes, seconds } = req.body;
  console.log("Sending Messages to ", tophone, " from ", fromphone);
  const sendMsgQuery = `INSERT INTO ${chatTable} (fromphone, tophone, message,hours,minutes,seconds) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`;
  db.query(
    sendMsgQuery,
    [fromphone, tophone, message, hours, minutes, seconds],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send({ message: "Error in sending message" });
      } else {
        console.log("Message sent successfully");
        res.status(201).send(result.rows[0]);
      }
    }
  );
});

//Get Messages
app.post("/getchats", (req, res) => {
  const { phone1, phone2 } = req.body;
  console.log("Getting chats of ", phone1 + " " + phone2);
  const recMsgQuery = `SELECT * FROM ${chatTable} WHERE (fromphone=$1 and tophone=$2) or (fromphone=$2 and tophone=$1) order by id;`;
  db.query(recMsgQuery, [phone1, phone2], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in getting message" });
    } else {
      console.log("Got Message successfully" + result.rows);
      res.status(201).send(result.rows);
    }
  });
});

//Rename User
app.post("/rename", (req, res) => {
  const { uid, fid, value } = req.body;
  console.log("Renaming friend name");
  const renameQuery = `UPDATE ${friendTable} SET friendname=$3 where userid=$1 and fid=$2 RETURNING *;`;
  db.query(renameQuery, [uid, fid, value], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    } else {
      // console.log("Friend renamed successfully");
      return res.status(201).json(result.rows[0]);
    }
  });
});

//Delete Chat
app.delete("/deletechat", (req, res) => {
  const { id, fromphone, tophone } = req.body;
  console.log("Deleting particular chat");
  const deleteQuery = `DELETE FROM ${chatTable} where id=$1 and fromphone=$2 and tophone=$3;`;
  db.query(deleteQuery, [id, fromphone, tophone], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    } else {
      // console.log("Chat deleted successfully");
      res.status(201).send({ message: "Friend Deleted" });
    }
  });
});

//Edit Chat
app.post("/editmsg", (req, res) => {
  const { id, fromphone, tophone, message } = req.body;
  console.log("Update Particular Chat");
  const updatechatQuery = `UPDATE ${chatTable} SET message=$4 where id=$1 and fromphone=$2 and tophone=$3;`;
  db.query(
    updatechatQuery,
    [id, fromphone, tophone, message],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
      } else {
        // console.log("Update chat successful");
        res.status(201).json({ message: "Updated chat" });
      }
    }
  );
});

//Update user name
app.post("/nameupdate", (req, res) => {
  const { id, name } = req.body;
  console.log("Updataing User Name");
  const nameQuery = `UPDATE ${userTable} SET username=$2 where userid=$1;`;
  db.query(nameQuery, [id, name], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    } else {
      console.log("User name updated successfully");
      res.status(201).json({ message: "Updated chat" });
    }
  });
});

//Update user wmail
app.post("/emailupdate", (req, res) => {
  const { id, email } = req.body;
  console.log("Updating User Email");
  const emailQuery = `UPDATE ${userTable} SET useremail=$2 where userid=$1;`;
  db.query(emailQuery, [id, email], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    } else {
      console.log("User email updated successfully");
      res.status(201).json({ message: "Updated chat" });
    }
  });
});
//Update user password
app.post("/passupdate", (req, res) => {
  const { id, pass } = req.body;
  console.log("Updating user password");
  const passQuery = `UPDATE ${userTable} SET userpassword=$2 where userid=$1;`;
  db.query(passQuery, [id, pass], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    } else {
      console.log("User password updated successfully");
      res.status(201).json({ message: "Updated chat" });
    }
  });
});

//Get user
app.post("/getuser", (req, res) => {
  const { uid } = req.body;
  console.log("Getting User Details");
  const getQuery = `SELECT * FROM ${userTable} where userid=$1;`;
  db.query(getQuery, [uid], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: err.message });
    } else {
      console.log("User retrieved successfully" + result.rows[0]);
      res.status(201).send(result.rows[0]);
    }
  });
});
