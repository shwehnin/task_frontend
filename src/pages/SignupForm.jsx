import React, { useState } from "react";
import axios from "../helpers/axios";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [errors, setErrors] = useState({});
  let navigate = useNavigate();

  let register = async (e) => {
    try {
      e.preventDefault();
      setErrors([]);
      let data = {
        name,
        email,
        password,
      };

      let res = await axios.post("/register", data);
      if (res.status == 201) {
        navigate("/login");
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
    <div className="flex flex-1 flex-col justify-center md:px-6 lg:px-8">
      <div className="bg-white sm:mx-auto sm:w-full sm:max-w-sm md:max-w-lg md:p-10 lg:p-10 p-5 rounded-2xl shadow-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/react.svg"
            className="mx-auto h-24 w-auto"
          />
          <h2 className="my-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>
        <form onSubmit={register} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm/6 font-medium">
              Name
            </label>
            <div className="mt-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="name"
                className="block w-full px-3 rounded-md bg-inputBg py-1.5 text-base border-grey300 border text-gray outline-1 -outline-offset-1 outline-gray focus:outline-1 focus:-outline-offset-1 focus:outline-blue sm:text-sm/6"
              />
              {errors.name && (
                <p className="text-pink text-xs italic mt-2">{errors.name}</p>
              )}
            </div>
          </div>
          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium">
              Email address
            </label>
            <div className="mt-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-inputBg px-3 py-1.5 text-base border-grey300 border outline-1 -outline-offset-1 outline-grey focus:outline-1 focus:-outline-offset-1 focus:outline-blue sm:text-sm/6"
              />
              {errors.email && (
                <p className="text-pink text-xs italic mt-2">{errors.email}</p>
              )}
            </div>
          </div>
          {/* Password */}
          <div>
            <div className="flex items-center">
              <label htmlFor="password" className="block text-sm/6 font-medium">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-inputBg px-3 py-1.5 text-base border-grey300 border outline-1 -outline-offset-1 outline-grey focus:outline-1 focus:-outline-offset-1 focus:outline-blue sm:text-sm/6"
              />
              {errors.password && (
                <p className="text-pink text-xs italic mt-2">
                  {errors.password}
                </p>
              )}
            </div>
          </div>
          {/* Register */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <Link
            to={`/login`}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
