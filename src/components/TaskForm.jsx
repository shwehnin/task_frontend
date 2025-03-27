import React, { useEffect, useState } from "react";
import axios from "../helpers/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";

const TaskForm = () => {
  let { id } = useParams();

  let navigate = useNavigate();

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [status, setStatus] = useState("");
  let [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  let [errors, setErrors] = useState({});

  useEffect(() => {
    let fetchTask = async () => {
      if (id) {
        let res = await axios.get(`/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (res.status == 200) {
          setTitle(res.data.data.title);
          setDescription(res.data.data.description);
          setStartDate(res.data.data.startDate);
          setEndDate(res.data.data.endDate);
          setStatus(res.data.data.status);
          setPriority(res.data.data.priority);
        }
      }
    };

    fetchTask();
  }, [id]);

  let submitTask = async (e) => {
    try {
      e.preventDefault();
      let task = {
        title,
        description,
        status,
        priority,
        startDate: new Date(startDate).toISOString(), // Convert to UTC
        endDate: new Date(endDate).toISOString(),
      };

      // server request
      let res;
      if (id) {
        res = await axios.put(`/tasks/${id}`, task);
      } else {
        res = await axios.post("/tasks", task);
      }
      if (res.status == 201 || res.status == 200) {
        navigate("/");
      }
    } catch (e) {
      if (e.response && e.response.data.errors) {
        const formattedErrors = {};
        e.response.data.errors.forEach((err) => {
          formattedErrors[err.field] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-lg bg-white md:p-10 lg:p-10 p-5 rounded-2xl">
      <h1 className="mb-6 text-2xl font-body font-bold text-blue text-center">
        {id ? "Edit" : "Create"} Task
      </h1>
      <form onSubmit={submitTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Task Title"
          className="block w-full mb-2 rounded-md bg-white px-3 py-1.5 text-base border-grey300 border outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-blue sm:text-sm/6"
        />
        {errors.title && (
          <p className="text-pink text-xs italic">{errors.title}</p>
        )}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          cols="30"
          rows="5"
          className="rounded-md bg-white px-3 py-1.5 my-3 text-base border-grey300 border text-gray outline-1 -outline-offset-1 outline-grey focus:outline-1 focus:-outline-offset-1 focus:outline-blue sm:text-sm/6 w-full"
          placeholder="Task Description"
        ></textarea>
        <CustomDropdown
          options={["To Do", "In Progress", "Done"]}
          selected={status}
          onChange={setStatus}
          placeholder={`Choose a Status`}
        />
        <div className="mt-3"></div>
        <CustomDropdown
          options={["High", "Medium", "Low"]}
          selected={priority}
          onChange={setPriority}
          placeholder={`Choose a Priority`}
        />
        {errors.priority && (
          <p className="text-pink text-xs italic mt-2">{errors.priority}</p>
        )}
        <div className="flex items-center justify-between px-3 sm:text-sm/6 my-3">
          <p>Start Date</p>
          <p>Due Date</p>
        </div>
        <div className="flex justify-between items-center mb-3">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="rounded-md bg-white px-3 py-1.5 text-base border-grey300 border outline-1 -outline-offset-1 outline-grey focus:outline-2 focus:-outline-offset-2 focus:outline-blue sm:text-sm/6 w-full"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="rounded-md bg-white px-3 py-1.5 text-base border-grey300 border outline-1 -outline-offset-1 outline-grey focus:outline-2 focus:-outline-offset-2 focus:outline-blue sm:text-sm/6 w-full"
          />
        </div>
        {errors.startDate && (
          <p className="text-pink text-xs italic mb-3">{errors.startDate}</p>
        )}
        {errors.endDate && (
          <p className="text-pink text-xs italic mb-3">{errors.endDate}</p>
        )}
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          {id ? "Update" : "Create"} Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
