import axios from 'axios';


const BASE_URL: string = '/api-v1';

export const instance = axios.create({
  baseURL: BASE_URL
});



