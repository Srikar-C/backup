import { useLocation } from "react-router-dom";
import Left from "./Left/Left";
import { useEffect, useState } from "react";
import Right from "./Right/Right";
import Chat from "./Right/ChatRoom/Chat";
import Account from "./Right/Account";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Dashboard() {
  const location = useLocation();
  const { id, name, email, phone, password } = location.state || {};
  const [uid, setUId] = useState(id);
  const [uname, setUName] = useState(name);
  const [uemail, setUEmail] = useState(email);
  const [uphone, setUPhone] = useState(phone);
  const [upassword, setUPassword] = useState(password);
  const [right, setRight] = useState(<Right />);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    getUser();
  }, [uid]);

  function getUser() {
    fetch("http://localhost:3000/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        return response.json().then((data) => {
          console.log(data);
        });
      })
      .then((data) => {
        setUId(data.userid);
        setUName(data.username);
        setUEmail(data.useremail);
        setUPhone(data.userphone);
        setUPassword(data.userpassword);
        handleAccount(
          data.userid,
          data.username,
          data.useremail,
          data.userphone,
          data.userpassword
        );
        setRight(<Right />);
      })
      .catch((err) => {
        alert(err);
        console.log("Error: " + err);
      });
  }

  function handleChat(fid, uid, uname, uphone, fname, fphone, status) {
    setRight(
      <Chat
        fid={fid}
        uid={uid}
        uname={uname}
        uphone={uphone}
        fname={fname}
        fphone={fphone}
        status={status}
      />
    );
  }

  function handleAccount(id, name, email, phone, password) {
    setRight(
      <Account
        id={id}
        name={name}
        email={email}
        phone={phone}
        password={password}
        onChange={() => {
          getUser();
        }}
      />
    );
  }

  return (
    <div className="flex flex-row w-screen overflow-hidden">
      <div className="w-[30%]" data-aos="fade-right">
        <Left
          uid={uid}
          uname={uname}
          uemail={uemail}
          uphone={uphone}
          upassword={upassword}
          chatRoom={handleChat}
          onChange={() => {
            setRight(<Right />);
          }}
          account={handleAccount}
          onRight={() => {
            setRight(<Right />);
          }}
        />
      </div>
      <div className="right w-[70%]" data-aos="fade-left">
        {right}
      </div>
    </div>
  );
}
