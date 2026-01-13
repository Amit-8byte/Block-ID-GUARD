import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ THIS IS THE KEY
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
