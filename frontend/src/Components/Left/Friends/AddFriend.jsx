import { useState } from "react";
import { FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function AddFriend(props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  function addFriend() {
    fetch("https://whatsapp-web-b9gr.onrender.com/addfriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: props.uid,
        uname: props.uname,
        uphone: props.uphone,
        fname: name,
        fphone: phone,
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
        alert("Friend added successfully");
      })
      .catch((err) => {
        alert(err);
        console.log("Error on adding friend: " + err);
      });
  }

  function requestFriend() {
    fetch("https://whatsapp-web-b9gr.onrender.com/requestfriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromname: props.uname,
        fromphone: props.uphone,
        toname: name,
        tophone: phone,
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
        alert("Request sent successfully");
      })
      .catch((err) => {
        alert(err);
        console.log("Error on request friend: " + err);
      });
  }

  function checkAndAdd() {
    if (name && phone) {
      if (phone.length === 10) {
        fetch("https://whatsapp-web-b9gr.onrender.com/checkfriend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userphone: phone,
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
            addFriend();
            requestFriend();
            setName("");
            setPhone("");
            props.onChange();
          })
          .catch((err) => {
            alert(err);
            console.log("Error on checking friend: " + err);
          });
      } else {
        alert("Please enter correct Phone Number");
      }
    } else {
      alert("Please fill both details completely");
    }
  }

  return (
    <div
      className="flex flex-col gap-3 items-center justify-center p-4 *:w-[80%] shadow-lg w-full mx-auto my-2"
      data-aos="zoom-in"
    >
      <div className="name relative flex items-center bg-transparent rounded-full shadow-inner shadow-black gap-3 px-3 py-2">
        <FaUserAlt className="text-[#4F200D] w-[25px] text-xl" />
        <input
          type="text"
          className="border-none outline-none bg-transparent text-[#4F200D] font-semibold"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="phone relative flex items-center bg-transparent rounded-full shadow-inner shadow-black gap-3 px-3 py-2">
        <FaPhoneAlt className="text-[#4F200D] w-[25px] text-xl" />
        <input
          type="text"
          className="border-none outline-none bg-transparent text-[#4F200D] font-semibold"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <button
        onClick={checkAndAdd}
        className="cursor-pointer hover:border-2 hover:border-[#4F200D] text-[#4F200D] px-3 py-1 justify-center mx-auto flex rounded-full bg-[#FFD93D] font-semibold"
      >
        Submit
      </button>
    </div>
  );
}
