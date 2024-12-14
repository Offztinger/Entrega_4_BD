import axios from "axios";

const api = axios.create({
  baseURL: "https://ec0c-186-121-29-147.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const fetchAnimes = async () => {
  try {
    const response = await api.get("/animes/all");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};
