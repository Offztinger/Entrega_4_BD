import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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

export const fetchAnimesByID = async (id) => {
  try {
    const response = await api.get(`/animes/id?id=${id}`);
    return response.data[0];
  } catch (error) {
    console.error(error.message);
  }
};

export const PostAnime = async (data) => {
  try {
    await api.post("/animes", data);
    return await fetchAnimes();
  } catch (error) {
    console.error(error.message);
  }
};

export const PutAnime = async (data) => {
  try {
    await api.put("/animes", data);
    return await fetchAnimes();
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteAnime = async (id) => {
  if (!id) {
    console.error("El ID del anime es inválido.");
    return;
  }

  try {
    await api.delete(`/animes?id=${id}`);
    return await fetchAnimes();
  } catch (error) {
    console.error("Error al eliminar el anime:", error.message);
  }
};
