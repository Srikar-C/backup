import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";

export default function ChatNav(props) {
  return (
    <div className="flex flex-row bg-[#FFD93D] w-full h-[10vh] items-center px-3 shadow-lg">
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: "#4F200D", fontSize: "16px" }}
            aria-label="recipe"
          >
            {props.fname.substring(0, 2).toUpperCase()}
          </Avatar>
        }
        title={
          props.fname.substring(0, 1).toUpperCase() +
          props.fname.substring(1).toLowerCase()
        }
        subheader={props.fphone}
      />
    </div>
  );
}
