import Axios, { AxiosRequestConfig } from 'axios';
import storage from './storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API_URL :>> ', API_URL);

// import { useNotificationStore } from "@/stores/notifications";

function businessUnitRequestInterceptor(config: AxiosRequestConfig) {
  const businessUnit = storage.getBusinessUnit();
  if (!config.headers) config.headers = { Accept: 'application/json' };
  if (businessUnit) config.headers['businessunit'] = businessUnit;
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

export function setAuthHeader(authToken: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

// export function createWaveKey(url: string): string {
//   const config: AxiosRequestConfig = {
//     url,
//     headers: {
//       businessunit: storage.getBusinessUnit(),
//     },
//   };
//   return JSON.stringify(config);
// }

// export function waveFetcher(request: string) {
//   return axios(JSON.parse(request));
// }

// export function createWaveFetcherKey(
//   request: AxiosRequestConfig | null
// ): string | null {
//   const defaultHeaders: AxiosRequestConfig = {
//     headers: {
//       businessunit: storage.getBusinessUnit(),
//     },
//   };
//   return request ? JSON.stringify({ ...defaultHeaders, ...request }) : null;
// }

export function fetcher(request: AxiosRequestConfig | null) {
  return axios.request({
    headers: {
      businessunit: storage.getBusinessUnit(),
    },
    ...request,
  });
}

// export function fetcher(key: [url: string, businessUnitId?: string]) {
//   const [url, businessUnitId] = key;
//   return axios.get(url, {
//     headers: {
//       businessunit: businessUnitId ?? storage.getBusinessUnit(),
//       'Content-Type': 'application/json',
//     },
//   });
// }

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
