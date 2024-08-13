import { SiWhatsapp } from "react-icons/si";
import { MdOutlineGroupAdd } from "react-icons/md";
import UserDrop from "./UserDrop";

export default function UserNav(props) {
  return (
    <div className="*:transition-all w-full h-[10vh] flex flex-row gap-4 justify-between bg-[#FFD93D] text-[#4F200D] px-4 py-2 items-center shadow-xl ">
      <SiWhatsapp
        className="text-3xl cursor-pointer"
        onClick={() => {
          // alert();
          props.onRight();
        }}
      />
      <p className="text-xl uppercase font-semibold w-[70%] text-center">
        {props.uname}
      </p>
      <MdOutlineGroupAdd
        className="text-3xl cursor-pointer"
        onClick={() => {
          props.addFriend();
        }}
      />
      <UserDrop
        onChange={() => {
          props.onChange();
        }}
      />
    </div>
  );
}
