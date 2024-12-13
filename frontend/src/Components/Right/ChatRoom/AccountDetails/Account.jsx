import { useEffect, useState } from "react";
import Name from "./Fields/Name";
import Email from "./Fields/Email";
import Phone from "./Fields/Phone";
import Password from "./Fields/Password";
import OTP from "./Fields/OTP";
import Spinner from "./../../../../Spinner";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Account({
  userid,
  username,
  useremail,
  userphone,
  userpassword,
  onChange,
}) {
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

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      className="flex mx-auto w-full items-center h-full justify-center bg-[#FAEC0C] p-4 "
      data-aos="fade-left"
    >
      {spin && <Spinner />}
      <div className=" bg-[#F3FEB8] justify-center flex flex-col text-center gap-4 p-5 rounded-md">
        <Name
          userid={userid}
          name={name}
          username={username}
          nameval={nameval}
          setNameVal={setNameVal}
          onChange={() => onChange()}
          setName={setName}
        />
        <Email
          email={email}
          useremail={useremail}
          emailval={emailval}
          setEmailVal={setEmailVal}
          userid={userid}
          setEmail={setEmail}
          onChange={() => onChange()}
        />
        <Phone userphone={userphone} />
        <Password
          pass={pass}
          userpassword={userpassword}
          passEye={passEye}
          setPassEye={setPassEye}
          passval={passval}
          setPassVal={setPassVal}
          onChange={() => onChange()}
          setOtp={setOtp}
          otp={otp}
          setSpin={setSpin}
          setOtpVal={setOtpVal}
          useremail={useremail}
          userid={userid}
          setPass={setPass}
        />
        {otp && (
          <OTP
            text={text}
            setText={setText}
            otpval={otpval}
            setOtp={setOtp}
            otp={otp}
            setPass={setPass}
            pass={pass}
          />
        )}
      </div>
    </div>
  );
}
