import axios from "axios";

console.log("Base URL:", process.env.REACT_APP_API_URL); 

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default api;