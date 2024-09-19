import { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";

export default function Search(props) {
  const [sort, setSort] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search !== "") {
      setSort(true);
    } else {
      setSort(false);
    }
  });

  function handleSort(e) {
    const value = e.target.value;
    setSearch(value); // Update the state
    console.log("Search: " + value);
    props.map(value); // Use the current value directly
  }

  return (
    <div className="flex h-[10vh] items-center w-full bg-[#FFD93D] justify-around shadow-xl p-3">
      <div className="bg-white text-black w-full p-2 rounded-xl flex items-center">
        <IoSearch className="text-2xl" />
        <input
          type="text"
          value={search}
          placeholder="Search your friends"
          className="border-none outline-none bg-transparent w-[90%] px-4 text-black"
          onChange={(e) => {
            handleSort(e);
          }}
        />
        {sort && (
          <RxCrossCircled
            className="cursor-pointer text-2xl text-black"
            title="erase"
            onClick={() => {
              setSearch("");
              setSort(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
