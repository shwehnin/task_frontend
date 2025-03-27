import React, { useEffect, useState } from "react";
import axios from "../helpers/axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "../components/TaskColumn";
import CustomDropdown from "../components/CustomDropdown";
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [links, setLinks] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPriority, setSelectedPriority] = useState("All Priority");

  let navigate = useNavigate();

  let location = useLocation();
  let searchQuery = new URLSearchParams(location.search);
  let page = searchQuery.get("page");
  page = parseInt(page);

  useEffect(() => {
    const fetchTasks = async () => {
      let response = await axios(`/tasks?page=${page}`);
      if (response.status == 200) {
        let data = await response.data;

        setTasks(data["data"]["tasks"]);
        // scroll to top
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
      }
    };

    fetchTasks();
  }, [page]);

  // filtered tasks based on status and priority
  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedStatus == "All" ||
        selectedStatus === "All Status" ||
        task.status === selectedStatus) &&
      (selectedPriority == "All" ||
        selectedPriority === "All Priority" ||
        task.priority === selectedPriority)
    );
  });

  const taskColumns = {
    "To Do": [],
    "In Progress": [],
    Done: [],
  };

  filteredTasks.forEach((task) => {
    if (taskColumns[task.status]) {
      taskColumns[task.status].push(task);
    }
  });

  let onDeleted = (_id) => {
    if (tasks.length == 1 && page > 1) {
      navigate("/?page=" + (page - 1));
    } else {
      setTasks((prev) => prev.filter((item) => item._id !== _id));
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const moveCard = (dragIndex, hoverIndex, dragStatus, hoverStatus) => {
    // find the dragged task
    const draggedTask = taskColumns[dragStatus][dragIndex];

    // if moving within the same column
    if (dragStatus === hoverStatus) {
      const newTasks = [...taskColumns[dragStatus]];
      const [removed] = newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, removed);

      setTasks((prevTasks) => {
        const otherTasks = prevTasks.filter(
          (task) => task.status !== dragStatus
        );
        return [...otherTasks, ...newTasks];
      });
    }
    // if moving to a different column
    else {
      // update the task's status
      const updatedTask = { ...draggedTask, status: hoverStatus };

      // update the backend
      handleStatusChange(draggedTask._id, hoverStatus);

      // optimistically update the UI
      setTasks((prevTasks) => {
        const filtered = prevTasks.filter(
          (task) => task._id !== draggedTask._id
        );
        return [...filtered, updatedTask];
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* filter Section */}
      <div className="flex space-x-3">
        <CustomDropdown
          options={["All", "To Do", "In Progress", "Done"]}
          selected={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="All Status"
        />
        <CustomDropdown
          options={["All", "Low", "Medium", "High"]}
          selected={selectedPriority}
          onChange={setSelectedPriority}
          placeholder="All Priorities"
        />
      </div>

      {/* task List */}
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-3">
          {/* existing filter section */}

          {/* task List */}
          {filteredTasks.length !== 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 pt-3">
              {Object.entries(taskColumns).map(([status, tasks]) => (
                <TaskColumn
                  key={status}
                  status={status}
                  tasks={tasks}
                  onDeleted={onDeleted}
                  moveCard={moveCard}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 pt-24">
              <p className="text-blue text-lg font-semibold">No more tasks</p>
            </div>
          )}
        </div>
      </DndProvider>
    </div>
  );
};

export default Home;
