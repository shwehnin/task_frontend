import React, { useContext, useState } from "react";
import axios from "../helpers/axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [errors, setErrors] = useState({});
  let { getUser } = useContext(AuthContext);
  let navigate = useNavigate();

  let login = async (e) => {
    e.preventDefault(); //prevent page refresh
    try {
      let data = {
        email,
        password,
      };
      let res = await axios.post("/login", data);

      // login user
      let token = res.data.data.accessToken;
      localStorage.setItem("accessToken", token);
      await getUser(token);
      if (res.status == 200) {
        navigate("/");
      }
    } catch (e) {
      const formattedErrors = {};
      if (e.response && e.response.data.message) {
        formattedErrors.general = e.response.data.message;
      }

      if (e.response && e.response.data.errors) {
        e.response.data.errors.forEach((err) => {
          formattedErrors[err.field] = err.message;
        });
      }

      setErrors(formattedErrors);
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center md:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-lg bg-white lg:p-10 p-5 rounded-2xl shadow-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/react.svg"
            className="mx-auto h-24 w-auto text-blue"
          />
          <h2 className="my-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form onSubmit={login} className="space-y-6">
          {errors.general && (
            <p className="text-pink text-xs italic">{errors.general}</p>
          )}

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium">
              Email address
            </label>
            <div className="mt-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-inputBg px-3 py-1.5 text-base border-grey300 border text-gray outline-1 -outline-offset-1 outline-grey focus:outline-1 focus:-outline-offset-1 focus:outline-blue sm:text-sm/6"
              />
              {errors.email && (
                <p className="text-pink text-xs italic mt-2">{errors.email}</p>
              )}
            </div>
          </div>
          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
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
          Don't have an account?{" "}
          <Link
            to={`/register`}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
