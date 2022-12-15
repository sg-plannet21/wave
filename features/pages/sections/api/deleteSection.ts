import { axios } from 'lib/client/axios';

export default function deleteSection(id: string) {
  return axios.delete(`/section/${id}/`);
}
