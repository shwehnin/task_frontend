import App from '../App.jsx'
import Home from '../pages/Home';
import CreateTask from '../pages/TaskForm.jsx';
import CalendarView from '../pages/CalendarView';
import SignupForm from '../pages/SignupForm';
import LoginForm from '../pages/LoginForm';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import TaskDetails from '../pages/TaskDetails.jsx';

const Index = () => {
    let { user } = useContext(AuthContext);
    console.log(`User data ${user}`);

    const router = createBrowserRouter([
        {
          path: "/",
          element: <App/>,
          children: [
            {
              path: "/",
              element: user ? <Home/> : <Navigate to={'/login'}/>
            },
            {
              path: "/tasks/create",
              element: user ? <CreateTask/> : <Navigate to={'/login'}/>
            },
            {
              path: "/tasks/edit/:id",
              element: user ? <CreateTask/> : <Navigate to={'/login'}/>
            },
            {
              path: "/tasks/:id",
              element: user ? <TaskDetails/> : <Navigate to={'/login'}/>
            },
            {
              path: "/tasks/calendar-view",
              element: user ? <CalendarView/> : <Navigate to={'/login'}/>
            },
            {
              path: "/register",
              element: !user ? <SignupForm/> : <Navigate to={'/'}/>
            },
            {
              path: "/login",
              element: !user ? <LoginForm/> : <Navigate to={'/'}/>
            },
          ]
        },
    ]);
  return (
    <RouterProvider router={router} />
  )
}

export default Index