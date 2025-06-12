import axios, {AxiosInstance} from 'axios';

const axiosClient: AxiosInstance = axios.create({
  timeout: 15000, // 15 seconds
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
