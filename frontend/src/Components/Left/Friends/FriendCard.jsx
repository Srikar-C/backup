import FriendDrop from "./FriendDrop";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { BsFillPinAngleFill } from "react-icons/bs";
import { useState } from "react";
import { TiTick } from "react-icons/ti";

export default function FriendCard(props) {
  const [pin, setPin] = useState(props.pin);
  const [edit, setEdit] = useState(true);
  const [value, setValue] = useState(props.fname);

  function handlePin() {
    fetch("https://whatsapp-web-b9gr.onrender.com/changepin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fid: props.fid, uid: props.uid }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        return response.json().then((data) => {
          return Promise.reject(data.message);
        });
      })
      .then((data) => {
        console.log("Pin Changed" + data.pin);
        if (data.pin === true) {
          setPin(true);
        } else {
          setPin(false);
        }
        props.onChecked();
      })
      .catch((err) => {
        alert(err);
        console.log("Error is: " + err);
      });
  }

  function handleDelete(fid, uid, uphone, fphone, status) {
    fetch("https://whatsapp-web-b9gr.onrender.com/deletefriend_chat", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone1: uphone,
        phone2: fphone,
        uid: uid,
        fid: fid,
        status: status,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        return response.json().then((data) => {
          return Promise.reject(data.message);
        });
      })
      .then((data) => {
        console.log("Friend deleted");
        props.onChecked();
      })
      .catch((err) => {
        alert(err);
        console.log("Error is: " + err);
      });
  }

  return (
    <Card className="w-[100%] self-center flex flex-row justify-between items-center">
      {edit ? (
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: "#4F200D", fontSize: "16px" }}
              aria-label="recipe"
            >
              {props.fname.substring(0, 2).toUpperCase()}
            </Avatar>
          }
          title={
            props.fname.substring(0, 1).toUpperCase() +
            props.fname.substring(1).toLowerCase()
          }
          subheader={props.fphone}
        />
      ) : (
        <div className="flex p-4 gap-2">
          <Avatar sx={{ bgcolor: "#4F200D" }} aria-label="recipe">
            {props.fname.substring(0, 2).toUpperCase()}
          </Avatar>
          <div className="input flex w-fit justify-evenly items-center border-2 border-gray-400 rounded-md">
            <input
              type="text"
              className="border-none outline-none w-[60%]"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <TiTick
              onClick={() => {
                props.rename(props.uid, props.fid, value);
                setEdit(!edit);
              }}
              className="text-[#4F6F52] text-2xl cursor-pointer"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 items-center">
        {pin ? <BsFillPinAngleFill className="text-sm " /> : ""}
        <FriendDrop
          fid={props.fid}
          uid={props.uid}
          uname={props.uname}
          uphone={props.uphone}
          fname={props.fname}
          fphone={props.fphone}
          pin={pin}
          status={props.status}
          onChecked={handlePin}
          onDelete={handleDelete}
          rename={() => {
            setEdit(!edit);
          }}
        />
      </div>
    </Card>
  );
}
