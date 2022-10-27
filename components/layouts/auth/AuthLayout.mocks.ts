import { IAuthLayout } from './AuthLayout';

const base: IAuthLayout = {
  title: 'Hello world!',
  children: '{{children}}',
};

export const mockAuthLayoutProps = {
  base,
};
