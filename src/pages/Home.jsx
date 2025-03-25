import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import axios from '../helpers/axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskColumn from '../components/TaskColumn';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      let response = await axios('/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      console.log(response);
      if (response.status == 200) {
        let data = await response.data;
        setTasks(data["data"]);
      }
    };

    fetchTasks();
  }, []);

  // Filtered tasks based on status and priority
  const filteredTasks = tasks.filter(task => {
    return (
      (selectedStatus ? task.status === selectedStatus : true) &&
      (selectedPriority ? task.priority === selectedPriority : true)
    );
  });

  const taskColumns = {
    "To Do": [],
    "In Progress": [],
    "Done": []
  };

  filteredTasks.forEach(task => {
    if (taskColumns[task.status]) {
      taskColumns[task.status].push(task);
    }
  });

  let onDeleted = (_id) => {
    setTasks(prev => prev.filter(item => item._id !==_id))
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      if (response.status === 200) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const moveCard = (dragIndex, hoverIndex, dragStatus, hoverStatus) => {
    // Find the dragged task
    const draggedTask = taskColumns[dragStatus][dragIndex];
    
    // If moving within the same column
    if (dragStatus === hoverStatus) {
      const newTasks = [...taskColumns[dragStatus]];
      const [removed] = newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, removed);
      
      setTasks(prevTasks => {
        const otherTasks = prevTasks.filter(task => task.status !== dragStatus);
        return [...otherTasks, ...newTasks];
      });
    } 
    // If moving to a different column
    else {
      // Update the task's status
      const updatedTask = { ...draggedTask, status: hoverStatus };
      
      // Update the backend
      handleStatusChange(draggedTask._id, hoverStatus);
      
      // Optimistically update the UI
      setTasks(prevTasks => {
        const filtered = prevTasks.filter(task => task._id !== draggedTask._id);
        return [...filtered, updatedTask];
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Filter Section */}
      <div className="flex space-x-3">
        <select 
          className="p-2 border-2 border-blue rounded-lg" 
          onChange={(e) => setSelectedStatus(e.target.value)}
          value={selectedStatus}
        >
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select 
          className="p-2 border-2 border-blue rounded-lg" 
          onChange={(e) => setSelectedPriority(e.target.value)}
          value={selectedPriority}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task List */}
      <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
        {/* ... existing filter section ... */}
        
        {/* Task List */}
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
      {/* {filteredTasks.length != 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 pt-3">
        {Object.entries(taskColumns).map(([status, tasks]) => (
            tasks.length > 0 && (  // Hide column if no tasks
              <div key={status} className="">
                <h2 className="text-lg font-bold mb-3">{status} ({tasks.length})</h2>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <TaskCard key={task._id} task={task} onDeleted={onDeleted} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 pt-24">
          <p className="text-blue text-lg font-semibold">No more tasks</p>
        </div>
      )} */}
    </div>
  );
};

export default Home;
