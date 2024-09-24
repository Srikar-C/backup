import { useEffect, useState } from "react";
import UserNav from "./Navigation/UserNav";
import AddFriend from "./Friends/AddFriend";
import DisplayFriends from "./Friends/DisplayFriends";
import DisplayRequests from "./Requests/DisplayRequests";
import url from "../../url";
import Search from "./Search";

export default function Left(props) {
  const [isadd, setAdd] = useState(false);
  const [search, setSearch] = useState(false);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [request, setRequest] = useState(false);
  const [reqFriends, setReqFriends] = useState([]);
  const [display, setDisplay] = useState(false);

  function sortFriends(val) {
    if (val === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.friendname.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }

  function getFriends() {
    fetch(`${url}/getfriends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: props.uid }),
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
        setFriends(data);
        setFilteredFriends(data);
      })
      .catch((err) => {
        alert(err);
        console.log("Left.jsx->Error on getting Friends: " + err);
      });
  }

  function checkRequest() {
    fetch(`${url}/checkrequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: props.uphone }),
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
        setRequest(true);
        setReqFriends(data);
      })
      .catch((err) => {
        if (err !== "No Friend Request found") {
          alert(err);
          console.log("Left.jsx->Error: " + err);
        }
      });
  }

  function handleRename(prop_uid, prop_fid, prop_value) {
    fetch(`${url}/rename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: prop_uid, fid: prop_fid, value: prop_value }),
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
        props.popUp("Renamed Successfully");
        getFriends();
        props.chatRoom(
          data.id,
          data.userid,
          data.username,
          data.userphone,
          data.friendname,
          data.friendphone,
          data.status
        );
      })
      .catch((err) => {
        alert(err);
        console.log("Left.jsx->Error: " + err);
      });
  }

  useEffect(() => {
    getFriends();
    checkRequest();
  }, [props.uid]);

  return (
    <div className="flex flex-col h-screen bg-[#F6F1E9] text-white border-r-2 border-black ">
      <UserNav
        uname={props.uname}
        uid={props.uid}
        addFriend={() => {
          setAdd(!isadd);
        }}
        onChange={() => {
          props.account(
            props.uid,
            props.uname,
            props.uemail,
            props.uphone,
            props.upassword
          );
        }}
        onRight={() => {
          props.onRight();
        }}
        handleSearch={() => {
          setSearch(!search);
        }}
      />
      {search && <Search map={sortFriends} />}
      {request ? (
        <div
          onClick={() => {
            setRequest(false);
            setDisplay(true);
          }}
          className="text-center cursor-pointer bg-[#fffb00] text-[#4F200D] w-full h-[5vh] flex items-center justify-center"
        >
          Friend Requests
        </div>
      ) : (
        ""
      )}
      {isadd ? (
        <AddFriend
          uid={props.uid}
          uname={props.uname}
          uphone={props.uphone}
          onChange={() => {
            setAdd(!isadd);
            getFriends();
          }}
        />
      ) : (
        ""
      )}
      {display ? (
        <DisplayRequests
          requests={reqFriends}
          uid={props.uid}
          onChange={() => {
            getFriends();
            checkRequest();
            setDisplay(false);
          }}
        />
      ) : (
        <DisplayFriends
          friends={filteredFriends}
          onChange={() => {
            getFriends();
            props.onChange();
          }}
          onChat={(fid, uid, uname, uphone, fname, fphone, status) => {
            props.chatRoom(fid, uid, uname, uphone, fname, fphone, status);
            setSearch(false);
          }}
          onChecked={handleRename}
        />
      )}
    </div>
  );
}
