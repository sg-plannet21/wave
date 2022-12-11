import { axios } from 'lib/client/axios';

export default function deleteRoute(id: string) {
  return axios.delete(`/routes/${id}/`);
}
