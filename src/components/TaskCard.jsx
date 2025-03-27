import React from "react";
import { FiEdit } from "react-icons/fi";
import { BsFillTrash3Fill } from "react-icons/bs";
import axios from "../helpers/axios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { useDrag } from "react-dnd";
import { GrView } from "react-icons/gr";
import { FiClock } from "react-icons/fi";

const TaskCard = ({ task, index, status, onDeleted, moveCard }) => {
  let deleteTask = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d23980",
      cancelButtonColor: "#4D5D99",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await axios.delete(`/tasks/${task._id}`);
        if (res.status == 200) {
          onDeleted(task._id);
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        }
      }
    });
  };

  // Format date to "MMM dd" (e.g., "Mar 29")
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";

    const options = { month: "short", day: "numeric" }; // "Mar 29"
    const start = new Date(startDate).toLocaleDateString("en-US", options);
    const end = new Date(endDate).toLocaleDateString("en-US", options);

    return `${start} - ${end}`;
  };

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { _id: task._id, index, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white border-l-4 
      ${
        task.status == "Done"
          ? "border-l-green"
          : task.status == "In Progress"
          ? "border-l-blue"
          : "border-l-pink"
      }  
      relative px-5 pt-3 pb-2 rounded-lg cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <span
        className={`absolute top-0 right-0 ${
          task.priority == "High" ? "bg-pink" : "bg-blue"
        } rounded-tr-md rounded-bl-md text-white py-1 px-3 text-sm`}
      >
        {task.priority}
      </span>
      <h3 className="font-bold text-blue pt-3 md:pt-0">{task.title}</h3>
      <p className="py-3">{task.description}</p>
      <div className="flex justify-between items-center">
        <div className="space-x-3">
          <span>Status:</span>
          <span
            className={`py-1 px-2 ${
              task.status == "Done"
                ? "text-green"
                : task.status == "In Progress"
                ? "text-blue"
                : "text-pink"
            } font-bold text-sm rounded-md cursor-pointer`}
          >
            {task.status}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-grey shadow-lg border-grey300 border p-2 my-3 rounded-md w-fit">
          <FiClock className="mr-1" />
          <span className="text-xs">
            {formatDateRange(task.startDate, task.endDate)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
          <button
            onClick={deleteTask}
            className="py-1 px-2 border-pink border-2 rounded-lg text-pink shadow-lg"
          >
            <BsFillTrash3Fill />
          </button>
          <Link
            to={`tasks/edit/${task._id}`}
            className="py-1 px-2 border-blue border-2 rounded-lg text-blue shadow-lg"
          >
            <FiEdit />
          </Link>
          <Link
            to={`/tasks/${task._id}`}
            className="py-1 px-2 border-navyBlue border-2 rounded-lg text-navyBlue shadow-lg"
          >
            <GrView />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
