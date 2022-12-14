import { axios } from 'lib/client/axios';

export default function deleteSchedule(id: string) {
  return axios.delete(`/schedules/${id}/`);
}
