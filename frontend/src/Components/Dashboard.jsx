import { useLocation } from "react-router-dom";
import Left from "./Left/Left";
import { useEffect, useState } from "react";
import Right from "./Right/Right";
import Chat from "./Right/ChatRoom/Chat";
import Account from "./Right/Account";
import AOS from "aos";
import "aos/dist/aos.css";
import url from "../url.jsx";
import "../App.css";

export default function Dashboard() {
  const location = useLocation();
  const { id, name, email, phone, password } = location.state || {};
  const [uid, setUId] = useState(id);
  const [uname, setUName] = useState(name);
  const [uemail, setUEmail] = useState(email);
  const [uphone, setUPhone] = useState(phone);
  const [upassword, setUPassword] = useState(password);
  const [right, setRight] = useState(<Right />);
  const [pop, setPop] = useState("");
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    getUser();
  }, [uid]);

  function getUser() {
    fetch(`${url}/getUser`, {
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
          return Promise.reject(data.message);
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
        console.log("Dashboard.jsx->Error on Getting User Details: " + err);
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
        popUp={(data) => {
          setPop(data);
          setDialog(true);
        }}
      />
    );
    fetch(`${url}/setdaily`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uphone: uphone,
        fphone: fphone,
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
        console.log("Dashboard.jsx->daily entered");
      })
      .catch((err) => {
        if (err != "Data already inserted") {
          alert(err);
          console.log("Dashboard.jsx->Error on setting daily: " + err);
        }
      });
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
      {dialog && (
        <div className="">
          <div
            className="absolute w-full h-full bg-white opacity-90 z-[50]"
            onClick={() => setDialog(false)}
          ></div>
          <div
            className={`shadow absolute flex flex-col top-1/2 left-1/2 transform z-[60] -translate-x-1/2 -translate-y-1/2 h-[100px] justify-center w-[30%] bg-white rounded-xl gap-4 border-2 border-black `}
          >
            <p className="text-center">{pop}</p>
            <button
              className="bg-[#FFD93D] w-fit justify-center mx-auto text-black px-4 py-1 rounded-md"
              onClick={() => setDialog(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
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
          popUp={(data) => {
            setPop(data);
            setDialog(true);
          }}
        />
      </div>
      <div className="right w-[70%]" data-aos="fade-left">
        {right}
      </div>
    </div>
  );
}
