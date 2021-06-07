import axios from 'axios';


// const BASE_URL: string = '/api-v1';

let BASE_URL: string;
if(process.env.NODE_ENV === "development"){
  BASE_URL = "http://localhost:3001";
}else{
  BASE_URL = '/api-v1';
}

export const instance = axios.create({
  baseURL: BASE_URL
});



