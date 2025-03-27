import axios from "axios";

// Set the base URL for your API
axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_URL
  }`;

// Get access and refresh tokens from localStorage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Set up an Axios request interceptor to attach the access token to requests
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up an Axios response interceptor to handle expired tokens and refresh them
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if the error status is 401 (Unauthorized) and if it's due to an expired token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Attempt to refresh the access token using the refresh token
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const res = await axios.post("/refresh-token", { refreshToken }); // Assuming you have an endpoint to refresh the token

          // On success, store the new access token and retry the original request
          if (res.status === 200 && res.data.accessToken) {
            localStorage.setItem("accessToken", res.data.accessToken); // Save the new access token
            axios.defaults.headers[
              "Authorization"
            ] = `Bearer ${res.data.accessToken}`;

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${res.data.accessToken}`; // Retry the original request with the new token
            return axios(originalRequest); // Retry the request
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
          // If the refresh token is invalid or expired, log the user out
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // Redirect to login or perform other logout actions
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
