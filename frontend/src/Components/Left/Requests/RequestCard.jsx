import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import url from "../../../url";

export default function RequestCard(props) {
  function acceptRequest() {
    fetch(`${url}/acceptreq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: props.uid,
        username: props.toname,
        userphone: props.tophone,
        friendname: props.fromname,
        friendphone: props.fromphone,
        status: 2,
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
        console.log("RequestCard.jsx->Request Accepted");
      })
      .catch((err) => {
        alert(err);
        console.log("RequestCard.jsx->Error in accepting request: " + err);
      });
  }

  function removeRequest() {
    fetch(`${url}/removereq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rid: props.id,
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
        console.log("RequestCard.jsx->Request Deleted");
      })
      .catch((err) => {
        alert(err);
        console.log("RequestCard.jsx->Error in deleting request: " + err);
      });
  }

  function updateRequest() {
    fetch(`${url}/updatereq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userphone: props.fromphone,
        friendphone: props.tophone,
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
        console.log("RequestCard.jsx->Request Updated");
      })
      .catch((err) => {
        alert(err);
        console.log("RequestCard.jsx->Error in updating request: " + err);
      });
  }

  function changeRequest() {
    fetch(`${url}/changereq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userphone: props.fromphone,
        friendphone: props.tophone,
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
        console.log("RequestCard.jsx->Request Changed");
      })
      .catch((err) => {
        alert(err);
        console.log("RequestCard.jsx->Error in changing request: " + err);
      });
  }

  return (
    <div className="bg-white w-[90%] self-center rounded-lg flex flex-col items-center shadow-sm shadow-black">
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: "#4F200D", fontSize: "16px" }}
            aria-label="recipe"
          >
            {props.fromname.substring(0, 2).toUpperCase()}
          </Avatar>
        }
        title={
          props.fromname.substring(0, 1).toUpperCase() +
          props.fromname.substring(1).toLowerCase()
        }
        subheader={props.fromphone}
      />
      <div className="btm flex flex-row justify-around items-center w-[80%] pb-3">
        <div
          onClick={() => {
            acceptRequest();
            removeRequest();
            updateRequest();
            props.onChecked();
          }}
          className="cursor-pointer flex flex-row gap-0 items-center *:text-[#4F6F52] shadow-sm shadow-black p-2 rounded-md *:hover:text-white hover:bg-[#4F6F52]"
        >
          <TiTick className="text-2xl" />
          <p>Accept</p>
        </div>
        <div
          onClick={() => {
            removeRequest();
            changeRequest();
            props.onChecked();
          }}
          className="cursor-pointer flex flex-row gap-1 items-center *:text-[#b92c2c] shadow-sm shadow-black p-2 rounded-md *:hover:text-white hover:bg-[#b92c2c]"
        >
          <ImCross className="text-sm" />
          <p>Reject</p>
        </div>
      </div>
    </div>
  );
}
