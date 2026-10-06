const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const getOpportunities = () => request('/opportunities');
export const getOpportunity = (id) => request(`/opportunities/${id}`);
export const createOpportunity = (data) => request('/opportunities', { method: 'POST', body: JSON.stringify(data) });
export const updateOpportunity = (id, data) =>
  request(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteOpportunity = (id) => request(`/opportunities/${id}`, { method: 'DELETE' });
