import Navigation from "./Navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef } from "react";
import "../Users/usercss.css";
import Video from "./Video";
import Chats from "./Chats";

export default function Landing() {
  const chatContainerRef = useRef(null);
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      className="gradient-bg flex flex-col bg-[#F6F1E9] h-[135vh] overflow-x-hidden"
      data-aos="zoom-in"
    >
      <Navigation />
      <Video />
      <Chats />
    </div>
  );
}
