import { IContentLayout } from './Content';

const base: IContentLayout = {
  title: 'Hello world!',
  children: '{{children}}',
};

export const mockContentLayoutProps = {
  base,
};
