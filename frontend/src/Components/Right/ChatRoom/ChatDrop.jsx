import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { LuArrowDownLeft } from "react-icons/lu";

export default function ChatDrop(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const date = new Date();
  const min = date.getMinutes();
  const hrs = date.getHours() != 12 ? date.getHours() % 12 : date.getHours();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <LuArrowDownLeft className="text-xl text-black font-normal" />
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {Math.abs(min - props.minutes) <= 5 &&
          Math.abs(hrs - props.hours) == 0 && (
            <MenuItem
              onClick={() => {
                props.onEdit(
                  props.id,
                  props.fromphone,
                  props.tophone,
                  props.message
                );
                handleClose();
              }}
            >
              Edit
            </MenuItem>
          )}
        <MenuItem
          onClick={() => {
            props.onDelete(props.id, props.fromphone, props.tophone);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
