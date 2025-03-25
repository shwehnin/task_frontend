import React from 'react'
import { FiEdit } from "react-icons/fi";
import { BsFillTrash3Fill } from "react-icons/bs";
import axios from '../helpers/axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import { useDrag } from 'react-dnd';
import { GrView } from "react-icons/gr";

const TaskCard = ({task, index, status, onDeleted, moveCard}) => {

  let deleteTask = async() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if(result.isConfirmed) {
        let res = await axios.delete(`/tasks/${task._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if(res.status == 200) {
          onDeleted(task._id);
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        }
      }
    });
  }

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { _id: task._id, index, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    // <Link to={`/tasks/${task._id}`} className='block'>
      <div ref={drag} className={`bg-white border-l-4 
      ${task.status == 'Done' ? 'border-l-green' : task.status == 'In Progress' ? 'border-l-blue' : 'border-l-pink'}  
      relative p-5 rounded-lg cursor-pointer ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <span className='absolute top-0 right-0 bg-blue text-white py-1 px-3 text-sm'>
        {task.priority}
      </span>
      <h3 className='text-xl font-bold text-blue pt-3 md:pt-0'>{task.title}</h3>
        <p className='py-3'>{task.description}</p>
        <div className='flex justify-between items-center'>
          <div className='space-x-3'>
            <span>Status:</span> 
            <span className={`py-1 px-2 ${task.status == 'Done' ? 'text-green': task.status == 'In Progress' ? 'text-blue' : 'text-pink'} font-bold text-sm rounded-md cursor-pointer`}>{task.status}</span>
          </div>
        </div>
        <div className='py-3 md:flex lg:flex sm:block sm:space-y-1 justify-between items-center'>
          <p className='text-black50'>Start Date: {formatDate(task.startDate)}</p>
          <p className='text-black50'>End Date: {formatDate(task.endDate)}</p>
        </div>
        <div className='flex flex-col sm:flex-row justify-end items-center gap-2'>
            <button onClick={deleteTask} className='py-1 px-2 border-pink border-2 rounded-lg text-pink '><BsFillTrash3Fill /></button>
            <Link to={`tasks/edit/${task._id}`} className='py-1 px-2 border-blue border-2 rounded-lg text-blue '><FiEdit/></Link>
            <Link to={`/tasks/${task._id}`} className='py-1 px-2 border-navyBlue border-2 rounded-lg text-navyBlue'><GrView /></Link>
        </div>
      </div>
  )
}

export default TaskCard