import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../App.css";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Left from "./../Left/Left";
import Right from "./../Right/Right";
import Chat from "./../Right/ChatRoom/Chat";
import url from "../../url.jsx";
import Account from "./../Right/ChatRoom/AccountDetails/Account";
import { handleChat } from "./utils";

export default function Dashboard() {
  const location = useLocation();
  const { id, name, email, phone, password } = location.state || {};
  const [uid, setUId] = useState(id);
  const [uname, setUName] = useState(name);
  const [uemail, setUEmail] = useState(email);
  const [uphone, setUPhone] = useState(phone);
  const [upassword, setUPassword] = useState(password);
  const [right, setRight] = useState(<Right />);
  const navigate = useNavigate();

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
        navigate(`/${data.username}`, {
          state: {
            id: data.userid,
            name: data.username,
            email: data.useremail,
            phone: data.userphone,
            password: data.userpassword,
          },
        });
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

  function handleAccount(id, name, email, phone, password) {}

  return (
    <div className="flex flex-row w-screen overflow-hidden">
      <ToastContainer
        hideProgressBar="false"
        position="top-center"
        transition={Slide}
        autoClose={5000}
      />
      <div className="w-[30%]" data-aos="fade-right">
        <Left
          uid={uid}
          uname={uname}
          uemail={uemail}
          uphone={uphone}
          upassword={upassword}
          chatRoom={(fid, uid, uname, uphone, fname, fphone, status) => {
            handleChat(uphone, fphone);
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
                  toast.success(data);
                }}
              />
            );
          }}
          onChange={() => setRight(<Right />)}
          displayUserDetails={(uid, uname, uemail, uphone, upassword) => {
            setRight(
              <Account
                userid={uid}
                username={uname}
                useremail={uemail}
                userphone={uphone}
                userpassword={upassword}
                onChange={() => getUser()}
              />
            );
          }}
          onRight={() => setRight(<Right />)}
          popUp={(data) => {
            toast.success(data);
          }}
        />
      </div>
      <div className="right w-[70%]" data-aos="fade-left">
        {right}
      </div>
    </div>
  );
}
