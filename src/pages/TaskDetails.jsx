import axios from "../helpers/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/tasks/${id}`);

        setTask(res.data.data);
      } catch (e) {
        console.error("Error fetching task:", e);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) return <p className="text-center">Loading...</p>;
  return (
    <div
      className={`mx-auto p-6 ${
        task.status == "Done"
          ? "border-l-green"
          : task.status == "In Progress"
          ? "border-l-blue"
          : "border-l-pink"
      } border-l-2 bg-white shadow-lg rounded-lg md:flex lg:flex block justify-between items-center`}
    >
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-blue">{task.title}</h2>
        <p className="text-gray-600">{task.description}</p>
        <div className="mt-4">
          <span className="bg-blue text-white py-1 px-2 text-sm rounded-md">
            {task.priority}
          </span>
        </div>
        <p>
          <span className="text-black50">Status:</span>{" "}
          <span
            className={`${
              task.status == "Done"
                ? "text-green"
                : task.status == "In Progress"
                ? "text-blue"
                : "text-pink"
            } font-bold text-sm`}
          >
            {task.status}
          </span>
        </p>
      </div>
      <div className="space-y-3">
        <p className="mt-2">
          <span className="text-black50">Start Date:</span>{" "}
          {task.startDate.split("T")[0]}
        </p>
        <p className="mt-2">
          <span className="text-black50">End Date:</span>{" "}
          {task.endDate.split("T")[0]}
        </p>
      </div>
    </div>
  );
};

export default TaskDetails;
