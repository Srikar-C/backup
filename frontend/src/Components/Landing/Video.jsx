import video from "../../assets/video.mp4";

export default function Video() {
  return (
    <div className="video1 flex gap-10 justify-evenly items-center">
      <div
        className="text-3xl w-[30%] flex flex-col gap-4"
        data-aos="fade-right"
      >
        <h1>Find your Friends Requests</h1>
        <p className="text-lg text-gray-400">
          Friends who want to connect with you may sent their request. Check and
          give response
        </p>
      </div>
      <video
        width="700"
        height="650"
        muted
        autoPlay
        loop
        // controls
        className="mt-[10vh] rounded-lg"
        data-aos="fade-left"
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
}
