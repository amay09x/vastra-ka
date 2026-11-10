import api from "./api";

export async function checkBackend() {
  const response = await api.get("/health");
  return response.data;
}
fetch("http://127.0.0.1:8000/health")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));