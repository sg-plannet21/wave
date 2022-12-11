import Axios, { AxiosRequestConfig } from 'axios';
import storage from './storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API_URL :>> ', API_URL);

// import { useNotificationStore } from "@/stores/notifications";

function businessUnitRequestInterceptor(config: AxiosRequestConfig) {
  const businessUnit = storage.getBusinessUnit();
  if (!config.headers) config.headers = { Accept: 'application/json' };
  if (businessUnit) config.headers['businessunit'] = businessUnit;

  if (config.method === 'post' || config.method === 'patch')
    config.data.business_unit = businessUnit;

  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

export function setAuthHeader(authToken: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

axios.interceptors.request.use(businessUnitRequestInterceptor);

// axios.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     useNotificationStore.getState().addNotification({
//       type: "error",
//       title: "Error",
//       message,
//     });

//     return Promise.reject(error);
//   }
// );
