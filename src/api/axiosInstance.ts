import { urls } from '@/constants';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: urls.walletApi, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
