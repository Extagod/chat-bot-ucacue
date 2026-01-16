import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8080", // tu FastAPI
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
})
