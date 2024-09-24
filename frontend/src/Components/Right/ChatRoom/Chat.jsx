import { useEffect, useState, useRef } from "react";
import ChatNav from "./ChatNav";
import ChatType from "./ChatType";
import DisplayChats from "./DisplayChats";
import AOS from "aos";
import "aos/dist/aos.css";
import url from "../../../url";

export default function Chat(props) {
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [edit, setEdit] = useState(false);
  const [det, setDet] = useState({});
  const [emoji, setEmoji] = useState(false);
  const emojiRef = useRef();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    getChats();
  }, [props.uid, props.fid]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function getChats() {
    fetch(`${url}/getchats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone1: props.uphone, phone2: props.fphone }),
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
        setChat(data);
        setEdit(false);
      })
      .catch((err) => {
        alert(err);
        console.log("Chat.jsx->Error on geting chats : " + err);
      });
  }

  function handleDelete(id, fromphone, tophone) {
    fetch(`${url}/deletechat`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, fromphone: fromphone, tophone: tophone }),
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
        props.popUp("Chat Deleted Successfully");
        getChats();
      })
      .catch((err) => {
        alert(err);
        console.log("Chat.jsx->Error on deleting chat: " + err);
      });
  }

  function handleEdit(id, from, to, message) {
    setEdit(true);
    setDet({ id: id, from: from, to: to, message: message });
  }

  return (
    <div className="h-[100vh] bg-[#F6F1E9] " data-aos="fade-left">
      <ChatNav
        uid={props.uid}
        uname={props.uname}
        uphone={props.uphone}
        fname={props.fname}
        fphone={props.fphone}
      />
      <DisplayChats
        chats={chat}
        uid={props.uid}
        fid={props.fid}
        uphone={props.uphone}
        fphone={props.fphone}
        onChecked={handleDelete}
        onChange={handleEdit}
      />
      <ChatType
        status={props.status}
        fid={props.fid}
        uid={props.uid}
        uphone={props.uphone}
        fphone={props.fphone}
        fname={props.fname}
        msg={msg}
        det={det}
        edit={edit}
        onChecked={getChats}
        emoji={emoji}
        setEmoji={setEmoji}
        emojiRef={emojiRef}
      />
    </div>
  );
}
