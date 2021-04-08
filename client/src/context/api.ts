import axios from 'axios';


const BASE_URL: string = 'http://localhost:3001';

export const instance = axios.create({
  baseURL: BASE_URL
});



