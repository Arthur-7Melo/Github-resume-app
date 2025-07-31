import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000
});

export async function fetchRepoInsights(repo) {
  await api.post(`/collect?repo=${encodeURIComponent(repo)}`);
  const res = await api.get(`/insights?repo=${encodeURIComponent(repo)}`);
  return res.data;
}

export default api;

