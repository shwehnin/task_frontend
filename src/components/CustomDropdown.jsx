import React, { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const CustomDropdown = ({ options, selected, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div
      className={`relative ${
        placeholder == "Choose a Status" || placeholder == "Choose a Priority"
          ? "w-full"
          : "w-32"
      }`}
      ref={dropdownRef}
    >
      <button
        className="w-full p-2 border border-grey300 rounded-lg flex justify-between items-center sm:text-sm/6 "
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
      >
        {selected || placeholder} <FaCaretDown className="text-blue" />
      </button>
      {open && (
        <ul className="absolute w-full bg-white border-2 border-blue shadow-md rounded-md mt-1 z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-navHover hover:text-white cursor-pointer sm:text-sm/6 "
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
