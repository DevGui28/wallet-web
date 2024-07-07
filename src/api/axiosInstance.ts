import { cookiesName, urls } from '@/constants';
import axios from 'axios';
import { cookies } from 'next/headers';

const token = cookies().get(cookiesName.token)?.value

const axiosInstance = axios.create({
  baseURL: urls.walletApi, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

export default axiosInstance;
