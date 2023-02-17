import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { User } from '../types';

export type UpdateUserRolesDto = {
  roles: User['business_unit_roles'];
  userId: User['id'];
};

export function updateUserRoles(
  payload: UpdateUserRolesDto
): Promise<AxiosResponse<User, WaveError>> {
  return axios.patch(`/users/${payload.userId}/`, {
    business_unit_roles: payload.roles,
    id: payload.userId,
  });
}
