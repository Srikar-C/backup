import { SiWhatsapp } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { FaUserAlt, FaPhoneAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import "./usercss.css";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [passEye, setPassEye] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  function handleRegistration() {
    console.log("Registration Started");
    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        useremail: email,
        userphone: phone,
        userpassword: pass,
        username: name,
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
        console.log("Data is: " + data);
        setName("");
        setEmail("");
        setPhone("");
        setPass("");
        alert("User registered successfully");
        navigate("/login");
      })
      .catch((err) => {
        alert(err);
        console.log("Error is: " + err);
      });
  }

  return (
    <div
      className="gradient-bg h-screen *:transition-all overflow-hidden"
      data-aos="flip-right"
    >
      <Link to="/">
        <span className="absolute top-10 left-20 text-6xl">
          <IoMdArrowRoundBack />
        </span>
      </Link>
      <div className="box w-[25%] h-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4 gap-6 bg-[#F6F1E9] rounded-lg shadow-2xl">
        <div className="flex flex-col border-2 border-[#F6F1E9] p-2 rounded-[50%] shadow-inner shadow-[#000]">
          <SiWhatsapp className="text-6xl p-2 bg-[#FFD93D] text-[#4F200D] shadow-inner shadow-[#EBF4F6] rounded-[50%] justify-center" />
        </div>
        <div className="inputs flex flex-col gap-4 items-center space-y-1 *:w-[100%]">
          <h1 className="heading font-semibold text-[#4F200D] text-center uppercase tracking-wider">
            Register
          </h1>
          <div className="name relative flex items-center bg-transparent rounded-full shadow-inner shadow-black gap-3 px-3 py-2">
            <FaUserAlt className="text-[#4F200D] w-[25px] text-xl" />
            <input
              type="text"
              className="border-none outline-none bg-transparent text-[#4F200D] font-medium"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="email relative flex items-center bg-transparent rounded-full shadow-inner shadow-black gap-3 px-3 py-2">
            <MdEmail className="text-[#4F200D] w-[25px] text-2xl" />
            <input
              type="text"
              className="border-none outline-none bg-transparent text-[#4F200D] font-medium"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="phone relative flex items-center bg-transparent rounded-full shadow-inner shadow-black gap-3 px-3 py-2">
            <FaPhoneAlt className="text-[#4F200D] w-[25px] text-xl" />
            <input
              type="text"
              className="border-none outline-none bg-transparent text-[#4F200D] font-medium"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="password relative flex items-center bg-transparent rounded-full shadow-inner shadow-black gap-3 px-3 py-2">
            <RiLockPasswordFill className="text-[#4F200D] w-[25px] text-xl" />
            <input
              type={passEye ? "text" : "password"}
              className="border-none outline-none bg-transparent text-[#4F200D] font-medium"
              placeholder="Enter Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <span
              onClick={() => setPassEye(!passEye)}
              className="cursor-pointer text-[#4F200D]"
            >
              {passEye ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button
            onClick={handleRegistration}
            className="cursor-pointer hover:border-2 hover:border-[#4F200D] text-[#4F200D] px-3 py-1 justify-center mx-auto flex rounded-full bg-[#FFD93D] font-semibold"
          >
            Submit
          </button>
          <div className="font-medium text-center hover:font-bold text-[#4F200D] hover:text-[#4F200D] w-fit">
            <Link to="/login" className="hover:font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
