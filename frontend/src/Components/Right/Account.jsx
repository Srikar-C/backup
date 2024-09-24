import { MdEmail } from "react-icons/md";
import { FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import url from "../../url";

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
  const [passEye, setPassEye] = useState(false);
  const [spin, setSpin] = useState(false);

  function sendOtp() {
    setSpin(true);
    const num = Math.floor(100000 + Math.random() * 900000);
    setOtpVal(num);
    setTimeout(() => {
      fetch(`${url}/send-email`, {
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
          setSpin(false);
          alert("OTP sent, Check and Enter");
        })
        .catch((err) => {
          alert(err);
          console.log("Account.jsx->Error on sending OTP: " + err);
        });
    }, 5000);
  }

  function handleName() {
    fetch(`${url}/nameupdate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.id, name: nameval }),
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
        setName(!name);
      })
      .catch((err) => {
        alert(err);
        console.log("Account.jsx->Error in updating name: " + err);
      });
  }

  function handleEmail() {
    fetch(`${url}/emailupdate`, {
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
        console.log("Account.jsx->Error in updating email: " + err);
      });
  }

  function handlePass() {
    fetch(`${url}/passupdate`, {
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
        console.log("Account.jsx->Error in updating pass: " + err);
      });
  }

  return (
    <div className="flex mx-auto w-full items-center h-full justify-center bg-[#FAEC0C] p-4 ">
      {spin && (
        <div className="spinner absolute top-0 left-0 h-full w-full bg-[#000] opacity-80 z-10">
          <div
            role="status"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              aria-hidden="true"
              class="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFD93D]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
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
            <div className="flex justify-between gap-2 items-center">
              <input
                className="w-[200px] text-start bg-transparent"
                value={props.password}
                type={passEye ? "text" : "password"}
                readOnly
              />
              <span
                onClick={() => setPassEye(!passEye)}
                className="cursor-pointer text-[#000]"
              >
                {passEye ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
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
          <div className="otp flex flex-row gap-5 items-center">
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
