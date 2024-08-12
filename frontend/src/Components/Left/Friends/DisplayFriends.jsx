import FriendCard from "./FriendCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function DisplayFriends(props) {
  const { friends } = props;

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  function handleRename(uid, fid, value) {
    props.onChecked(uid, fid, value);
  }

  return (
    <div className="flex overflow-y-auto flex-col gap-3 text-[#4F200D] mt-4">
      {friends?.map((item) => {
        return (
          <div
            key={item.fid}
            onClick={() => {
              props.onChat(
                item.fid,
                item.userid,
                item.username,
                item.userphone,
                item.friendname,
                item.friendphone,
                item.status
              );
            }}
            className="w-[80%] mx-auto cursor-pointer"
            data-aos="fade-right"
          >
            <FriendCard
              fid={item.fid}
              uid={item.userid}
              uname={item.username}
              uphone={item.userphone}
              fname={item.friendname}
              fphone={item.friendphone}
              pin={item.pin}
              status={item.status}
              onChecked={props.onChange}
              rename={handleRename}
            />
          </div>
        );
      })}
    </div>
  );
}
