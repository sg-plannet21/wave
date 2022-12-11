export type LoginResponse = {
  refresh: string;
  access: string;
};

export type RefreshTokenResponse = {
  access: string;
};

export enum EntityRoles {
  Prompts = 'Prompts',
  EntryPoints = 'EntryPoints',
  Menus = 'Menus',
  Queues = 'Queues',
  Schedules = 'Schedules',
  Administrator = 'Administrator',
}

// export type AdministratorRole = ['Administrator'];

export interface BusinessUnitRole {
  business_unit: string;
  business_unit_name: string;
  default_region: number;
  roles: EntityRoles[];
}

export interface User {
  token_type: string;
  exp: number;
  jti: string;
  user_id: number;
  username: string;
  is_wave_superuser: boolean;
  business_unit_roles: BusinessUnitRole[];
}
