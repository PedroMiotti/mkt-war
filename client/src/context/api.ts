import axios from 'axios';


const BASE_URL: string = '';

export const instance = axios.create({
  baseURL: BASE_URL
});



