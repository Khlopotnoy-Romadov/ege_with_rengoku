import axios from 'axios';

// Используем URL вашего Laravel
const API_BASE = 'http://127.0.0.1:8000/api/v1';

export async function mapSubjects() {
  try {
    const response = await axios.get(`${API_BASE}/subjects`);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки предметов:', error);
    return [];
  }
}

export async function fetchSubject(slug) {
  try {
    const response = await axios.get(`${API_BASE}/subjects/${slug}/full`);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки предмета:', error);
    return { topics: [], name: '' };
  }
}