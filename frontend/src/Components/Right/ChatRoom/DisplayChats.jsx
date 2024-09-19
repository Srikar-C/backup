import { useEffect, useRef, useState } from "react";
import ChatDrop from "./ChatDrop";
import AOS from "aos";
import "aos/dist/aos.css";
import url from "../../../url";

export default function DisplayChats(props) {
  const chatContainerRef = useRef(null);
  const [head, setHead] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [props.chats]);

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[month];
  const year = date.getFullYear();

  useEffect(() => {
    fetch(`${url}/getdaily`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: props.uid, fid: props.fid }),
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
        setHead(data.chatted);
      })
      .catch((err) => {
        alert(err);
        console.log("Error in getting daily head: " + err);
      });
  }, [1000]);

  return (
    <div ref={chatContainerRef} className="h-[80vh] overflow-y-auto pt-1">
      {head && (
        <div className="flex items-center">
          <p>{day}</p>
          <p>{monthName}</p>
          <p>{year}</p>
        </div>
      )}
      {props.chats?.map((item) => {
        if (item.fromphone === props.uphone) {
          return (
            <div
              key={item.id}
              className="flex w-[100%] p-2 mb-2 justify-end text-white"
            >
              <div className="justify-end w-[50%] text-wrap bg-transparent flex text-start items-center gap-1">
                <ChatDrop
                  id={item.id}
                  fromphone={item.fromphone}
                  tophone={item.tophone}
                  message={item.message}
                  minutes={item.minutes}
                  hours={item.hours}
                  onDelete={(id, fromphone, tophone) => {
                    props.onChecked(id, fromphone, tophone);
                  }}
                  onEdit={(id, fromphone, tophone, msg) => {
                    props.onChange(id, fromphone, tophone, msg);
                  }}
                />
                <div className="flex relative w-fit break-all max-w-[500px] text-wrap bg-[#000] pr-14 px-3 py-1 rounded-tl-lg rounded-bl-lg">
                  <p>
                    {item.message}{" "}
                    <sub className="absolute bottom-3 right-1 ">
                      {item.hours}:{item.minutes}
                    </sub>{" "}
                  </p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={item.id}
              className="flex w-[100%] p-2 mb-2 justify-start text-black"
            >
              <div className="justify-start w-[50%] bg-transparent flex text-start items-center gap-1">
                <div className="flex relative w-fit break-all max-w-[500px] text-wrap bg-[#fff] pr-14 px-3 py-1 rounded-tr-lg rounded-br-lg">
                  <p>
                    {item.message}{" "}
                    <sub className="absolute bottom-3 right-1 ">
                      {item.hours}:{item.minutes}
                    </sub>{" "}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
