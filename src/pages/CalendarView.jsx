import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "../helpers/axios";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let response = await axios("/tasks");
        if (response.status === 200) {
          setTasks(response.data["data"]["tasks"]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const goToToday = () => setCurrentDate(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.startOf("week");
  const endDay = endOfMonth.endOf("week");
  const calendarDays = [];
  let day = startDay;

  while (day.isBefore(endDay, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  const getTaskColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green";
      case "In Progress":
        return "bg-blue";
      case "To Do":
        return "bg-pink";
      default:
        return "bg-grey";
    }
  };

  const handleDateClick = (date) => {
    const tasksForDate = tasks.filter((task) => {
      const taskStart = dayjs(task.startDate);
      const taskEnd = dayjs(task.endDate);
      return date.isBetween(taskStart, taskEnd, "day", "[]");
    });
    setSelectedTasks(tasksForDate);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Calendar Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToToday}
          className="bg-blue text-white px-4 py-2 rounded"
        >
          Today
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <div>
          <button
            onClick={goToPrevMonth}
            className="bg-blue text-white px-4 py-2 mx-1 rounded"
          >
            ‹
          </button>
          <button
            onClick={goToNextMonth}
            className="bg-blue text-white px-4 py-2 rounded"
          >
            ›
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 border-t border-blue pb-6 relative">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
          <div key={day} className="text-center font-bold p-2">
            {day}
          </div>
        ))}

        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.month() === currentDate.month();
          const isToday = date.isSame(dayjs(), "day");

          // Find tasks that start on this date
          const tasksOnDate = tasks.filter((task) =>
            date.isBetween(
              dayjs(task.startDate),
              dayjs(task.endDate),
              "day",
              "[]"
            )
          );

          return (
            <div
              key={index}
              className={`p-2 overflow-scroll rounded-md border border-blue h-28 flex flex-col items-center relative cursor-pointer ${
                isCurrentMonth ? "bg-white" : "bg-gray"
              } ${isToday ? "border-2 border-navyBlue" : ""}`}
              onClick={() => handleDateClick(date)}
            >
              <span
                className={`text-sm ${
                  isCurrentMonth ? "font-bold" : "text-gray"
                }`}
              >
                {date.date()}
              </span>
              {tasksOnDate.map((task, i) => (
                <div className="space-y-3">
                  <div
                    key={i}
                    className={`w-full mb-1 text-sm mx-auto text-center rounded ${getTaskColor(
                      task.status
                    )}`}
                  >
                    <span className="text-xs text-center text-white px-2">
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Task Details Section */}
      {selectedTasks.length > 0 && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md shadow-lg bg-white">
          <h3 className="text-lg font-bold mb-2">
            Tasks on{" "}
            {selectedTasks[0] &&
              dayjs(selectedTasks[0].startDate).format("MMMM D")}
          </h3>
          {selectedTasks.map((task, i) => (
            <div
              key={i}
              className={`p-2 rounded ${getTaskColor(
                task.status
              )} text-white mb-2`}
            >
              <p className="text-sm font-semibold">{task.title}</p>
              <p className="text-xs">
                Start: {dayjs(task.startDate).format("MMM D")} | End:{" "}
                {dayjs(task.endDate).format("MMM D")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
