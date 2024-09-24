import { GrEmoji } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import EmojiPicker from "emoji-picker-react";
import url from "../../../url";
import UploadDocs from "./UploadDocs";

export default function ChatType(props) {
  const [msg, setMsg] = useState("");
  const [cross, setCross] = useState(false);
  const [edit, setEdit] = useState(props.det.message);
  const [cross2, setCross2] = useState(false);
  const date = new Date();

  useEffect(() => {
    setEdit(props.det.message);
  }, [props.det.message]);

  useEffect(() => {
    if (msg !== "") {
      setCross(true);
    } else {
      setCross(false);
    }
  });

  const onEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  function handleMsg() {
    if (msg !== "") {
      const hrs =
        date.getHours() !== 12 ? date.getHours() % 12 : date.getHours();
      const min = date.getMinutes();
      const sec = date.getSeconds();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      fetch(`${url}/checkdaily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromphone: props.uphone,
          tophone: props.fphone,
          day: day,
          month: month,
          year: year,
          hours: hrs,
          minutes: min,
          seconds: sec,
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
          fetch(`${url}/sendmsg`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: props.uid,
              fid: props.fid,
              fromphone: props.uphone,
              tophone: props.fphone,
              message: msg,
              hours: hrs,
              minutes: min,
              seconds: sec,
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
              setMsg("");
              props.onChecked();
            })
            .catch((err) => {
              alert(err);
              console.log("ChatType.jsx->Error in sending message: " + err);
            });
        })
        .catch((err) => {
          alert(err);
          console.log("ChatType.jsx->Error in checking daily: " + err);
        });
    } else {
      alert("Enter a message to send");
    }
  }

  function handleEditMsg() {
    fetch(`${url}/editmsg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.det.id,
        fromphone: props.det.from,
        tophone: props.det.to,
        message: edit,
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
        props.onChecked();
      })
      .catch((err) => {
        alert(err);
        console.log("ChatType.jsx->Error in editing message: " + err);
      });
  }

  return (
    <footer className="h-[10vh] flex items-center justify-between px-3 gap-3 rounded-tl-xl rounded-tr-xl bg-[#FFD93D] relative">
      <GrEmoji
        className="text-4xl font-light cursor-pointer"
        title="Add Emojies"
        onClick={() => props.setEmoji(!props.emoji)}
      />
      {props.emoji && (
        <div ref={props.emojiRef} className="absolute bottom-[10vh] left-3">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <UploadDocs />
      {!props.edit ? (
        props.status === "2" ? (
          <div className="input flex justify-between w-[80%] h-[70%] items-center bg-[#fff] p-2 rounded-xl">
            <input
              type="text"
              className="w-full bg-transparent outline-none px-5"
              placeholder="Enter message to send"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
            />
            {cross ? (
              <RxCrossCircled
                className="cursor-pointer text-3xl"
                title="erase"
                onClick={() => {
                  setMsg("");
                  setCross(!cross);
                }}
              />
            ) : (
              ""
            )}
          </div>
        ) : props.status === "0" ? (
          <div className="flex items-center justify-center w-[80%] h-[70%] tracking-wider">
            {props.fname.toUpperCase()} Rejected your Friend Request
          </div>
        ) : props.status === "3" ? (
          <div className="flex items-center justify-center w-[80%] h-[70%] tracking-wider">
            {props.fname.toUpperCase()} don't want to communicate with you
            further
          </div>
        ) : (
          <div className="flex items-center justify-center w-[80%] h-[70%] tracking-wider">
            {props.fname.toUpperCase()} didn't noticed your Friend Request
          </div>
        )
      ) : (
        <div className="input flex justify-between w-[80%] h-[70%] gap-3 items-center bg-[#fff] p-2 rounded-xl">
          <input
            type="text"
            className="w-full bg-transparent outline-none px-5"
            placeholder="Edit message"
            onChange={(e) => setEdit(e.target.value)}
            value={edit}
          />
          {cross2 ? (
            <RxCrossCircled
              className="cursor-pointer text-3xl"
              title="erase"
              onClick={() => {
                setEdit("");
                setCross2(!cross2);
              }}
            />
          ) : (
            ""
          )}
        </div>
      )}
      {!props.edit ? (
        <IoSend
          className="text-4xl font-light cursor-pointer text-[#000000]"
          title="send"
          onClick={handleMsg}
        />
      ) : (
        <IoSend
          className="text-4xl font-light cursor-pointer text-[#000000]"
          title="send"
          onClick={handleEditMsg}
        />
      )}
    </footer>
  );
}
