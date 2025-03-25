import React, { useContext, useState } from 'react'
import axios from '../helpers/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginForm = () => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [error, setError] = useState(null);
  let {getUser} = useContext(AuthContext);
  let navigate = useNavigate();

  let login = async(e) => {
    e.preventDefault(); //prevent page refresh
    try{
      let data = {
        email,
        password,
      }
      let res = await axios.post("/login", data);
      // login user
      let token = res.data.accessToken;
      localStorage.setItem("accessToken", token);
      await getUser(token);
      if(res.status == 200) {
        navigate("/");
      }
    }catch(e) {
      setError(e.response.data.message);
    }
  } 
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-lg bg-white md:p-10 lg:p-10 p-5 rounded-md shadow-md">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="my-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form onSubmit={login} className="space-y-6">
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium">
                Email address
              </label>
              <div className="mt-2">
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base border-grey border-2 text-gray outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              {!!error && <p className='text-pink text-xs italic'>{error}</p>}
            </div>
            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray border-grey border-2 outline-1 -outline-offset-1 outline-gray placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {/* Login */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register
            </a>
          </p>
        </div>
    </div>
  )
}

export default LoginForm