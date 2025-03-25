import axios from "axios";

axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_URL}`;
// axios.defaults.withCredentials = true;

export default axios;