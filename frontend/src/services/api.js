import axios from "axios";

export const BACKEND_URL =
  "https://ai-powered-career-intelligence-system.onrender.com";

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;