import { MdEmail } from "react-icons/md";
import { FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import { TiTick } from "react-icons/ti";

export default function Account(props) {
  const [name, setName] = useState(true);
  const [email, setEmail] = useState(true);
  const [pass, setPass] = useState(true);
  const [nameval, setNameVal] = useState("");
  const [emailval, setEmailVal] = useState("");
  const [passval, setPassVal] = useState("");
  const [otp, setOtp] = useState(false);
  const [otpval, setOtpVal] = useState("");
  const [text, setText] = useState("");

  async function sendOtp() {
    const num = Math.floor(100000 + Math.random() * 900000);
    setOtpVal(num);
    await fetch("http://localhost:3000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: props.email,
        subject: "OTP for Verification",
        text: num,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("OTP sent, Check and Enter");
      })
      .catch((err) => {
        alert(err);
        console.log("Error: " + err);
      });
  }

  function handleName() {
    fetch("http://localhost:3000/nameupdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.id, name: nameval }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 500) {
          return Promise.reject("Error");
        }
      })
      .then((data) => {
        setName(!name);
      })
      .catch((err) => {
        alert(err);
        console.log("Error in updating name: " + err);
      });
  }

  function handleEmail() {
    fetch("http://localhost:3000/emailupdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.id, email: emailval }),
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
        setEmail(!email);
      })
      .catch((err) => {
        alert(err);
        console.log("Error in updating email: " + err);
      });
  }

  function handlePass() {
    fetch("http://localhost:3000/passupdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.id, pass: passval }),
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
        setPass(!pass);
      })
      .catch((err) => {
        alert(err);
        console.log("Error in updating pass: " + err);
      });
  }

  return (
    <div className="flex mx-auto w-full items-center h-full justify-center bg-[#FAEC0C] p-4 ">
      <div className=" bg-[#F3FEB8] justify-center flex flex-col text-center gap-4 p-5 rounded-md">
        <div className="name flex flex-row gap-5 items-center">
          <div className="flex gap-2 items-center w-[150px] ">
            <FaUserAlt className="text-xl" />
            <h1 className="text-lg">Name</h1>
          </div>
          <p>:</p>
          {name ? (
            <h4 className="w-[220px] text-start">{props.name}</h4>
          ) : (
            <div className="flex bg-white shadow-inner shadow-gray-300 items-center px-2 py-1">
              <input
                type="text"
                value={nameval}
                onChange={(e) => setNameVal(e.target.value)}
                placeholder="Change your Username"
                className="bg-transparent outline-none border-none"
              />
              <TiTick
                className="text-xl cursor-pointer"
                onClick={() => {
                  handleName();
                  props.onChange();
                }}
              />
            </div>
          )}
          <button
            type="submit"
            onClick={() => setName(!name)}
            className="px-2 py-1 bg-black hover:bg-white text-white hover:text-black border-2 border-white hover:border-black rounded-sm "
          >
            Edit
          </button>
        </div>
        <div className="email flex flex-row gap-5 items-center">
          <div className="flex gap-2 items-center w-[150px] ">
            <MdEmail className="text-xl" />
            <h1 className="text-xl">Email</h1>
          </div>
          <p>:</p>
          {email ? (
            <h4 className="w-[220px] text-start">{props.email}</h4>
          ) : (
            <div className="flex bg-white shadow-inner shadow-gray-300 items-center px-2 py-1">
              <input
                type="text"
                value={emailval}
                onChange={(e) => setEmailVal(e.target.value)}
                placeholder="Change your Email ID"
                className="bg-transparent outline-none border-none"
              />
              <TiTick
                className="text-xl cursor-pointer"
                onClick={() => {
                  handleEmail();
                  props.onChange();
                }}
              />
            </div>
          )}
          <button
            type="submit"
            onClick={() => setEmail(!email)}
            className="px-2 py-1 bg-black hover:bg-white text-white hover:text-black border-2 border-white hover:border-black rounded-sm "
          >
            Edit
          </button>
        </div>
        <div className="phone flex flex-row gap-5 items-center">
          <div className="flex gap-2 items-center w-[150px] ">
            <FaPhoneAlt className="text-xl" />
            <h1 className="text-lg">Phone</h1>
          </div>
          <p>:</p>
          <h4 className="w-[220px] text-start">{props.phone}</h4>
        </div>
        <div className="password flex flex-row gap-5 items-center">
          <div className="flex gap-2 items-center w-[150px] ">
            <RiLockPasswordFill className="text-xl" />
            <h1 className="text-xl">Password</h1>
          </div>
          <p>:</p>
          {pass ? (
            <h4 className="w-[220px] text-start">{props.password}</h4>
          ) : (
            <div className="flex bg-white shadow-inner shadow-gray-300 items-center px-2 py-1">
              <input
                type="text"
                value={passval}
                onChange={(e) => setPassVal(e.target.value)}
                className="bg-transparent outline-none border-none"
                placeholder="Change your Password"
              />
              <TiTick
                className="text-xl cursor-pointer"
                onClick={() => {
                  handlePass();
                  props.onChange();
                  alert("Password Changed");
                }}
              />
            </div>
          )}
          {!otp ? (
            <button
              type="submit"
              onClick={() => {
                sendOtp();
                setOtp(!otp);
              }}
              className="px-2 py-1 bg-black hover:bg-white text-white hover:text-black border-2 border-white hover:border-black rounded-sm "
            >
              Edit
            </button>
          ) : (
            ""
          )}
        </div>
        {otp ? (
          <div className="password flex flex-row gap-5 items-center">
            <div className="flex gap-2 items-center w-[150px] ">
              <RiLockPasswordFill className="text-xl invisible" />
              <h1 className="text-[12px]">Enter the otp sent to your email</h1>
            </div>
            <p className="">:</p>
            <div className="flex bg-white shadow-inner shadow-gray-300 items-center px-2 py-1">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the OTP"
                className="bg-transparent outline-none border-none"
              />
            </div>
            <button
              type="submit"
              onClick={() => {
                console.log(text + " " + otpval);

                if (parseInt(text) === parseInt(otpval)) {
                  setOtp(!otp);
                  setPass(!pass);
                } else {
                  alert("Incorrect OTP");
                }
              }}
              className="px-2 py-1 bg-black hover:bg-white text-white hover:text-black border-2 border-white hover:border-black rounded-sm "
            >
              Verify
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
