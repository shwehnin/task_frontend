import React, { useEffect, useState } from 'react'
import axios from '../helpers/axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate, useParams} from 'react-router-dom';

const TaskForm = () => {
  let {id} = useParams();
  console.log(`Task id is ${id}`);

  let navigate = useNavigate();

  let [title, setTitle] = useState('');
  let [description, setDescription] = useState('');
  let [status, setStatus] = useState('');
  let [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  let [errors, setErrors] = useState([]);

  useEffect(() => {
    let fetchTask = async() => {
      if(id) {
        let res = await axios.get(`/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        if(res.status == 200) {
          setTitle(res.data.data.title);
          setDescription(res.data.data.description);
          setStartDate(res.data.data.startDate);
          setEndDate(res.data.data.endDate);
          setStatus(res.data.data.status);
          setPriority(res.data.data.priority);
          console.log(res.data);
        }
      }
    }

    fetchTask();
  }, [id]);

  let submitTask = async(e) => {
    try{
      e.preventDefault();
      let task = {
        title, 
        description,
        status,
        priority,
        startDate: new Date(startDate).toISOString(), // Convert to UTC
        endDate: new Date(endDate).toISOString(),
      }

      // server request
      let res;
      if(id) {
        res = await axios.put(`/tasks/${id}`, task, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }else {
        res = await axios.post("/tasks", task, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
      }
      if(res.status == 201 || res.status == 200) {
        navigate("/");
      }
      
      console.log(res);
    }catch(e) {
      setErrors(e.response.data.errors);
    }
  }
  return (
    <div className='mx-auto max-w-md border-2 border-white p-4'>
      <h1 className='mb-6 text-2xl font-body font-bold text-blue text-center'>{id ? "Edit" : "Create"} Task</h1>
      <form action="" className='space-y-5' onSubmit={submitTask}>
        <ul className='list-disc pl-3'>
          {!! errors.length && errors.map((error, i) => (
            <li className='text-pink text-sm' key={i}>{error.message}</li>
          ))}
        </ul>
        <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder='Task Title' className='rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 w-full'/>
        <textarea value={description} onChange={e => setDescription(e.target.value)} name="description" id="description" cols="30" rows="5" className='rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 w-full' placeholder='Task Description'></textarea>
        <select value={status} onChange={(e) => setStatus(e.target.value)} id="status" className="rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 w-full">
          <option selected className='text-base'>Choose a Status</option>
          <option value="To Do">High</option>
          <option value="In Progress">Medium</option>
          <option value="Done">Low</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} id="priority" className="rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 w-full">
          <option selected className='text-base'>Choose a Priority</option>
          <option value="High">To Do</option>
          <option value="Low">In Progress</option>
          <option value="Medium">Done</option>
        </select>
        <div className='flex items-center justify-between px-3'>
          <p>Start Date</p>
          <p>Start Date</p>
        </div>
        <div className='flex justify-between items-center'>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className='rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 w-full'/>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className='rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 w-full'/>
        </div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-blue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{id ? "Update" : "Create"} Task</button>
      </form>
    </div>
  )
}

export default TaskForm