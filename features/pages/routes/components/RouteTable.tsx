import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { Route } from '../types';

const RouteTable: React.FC = () => {
  const { data, error } = useWaveCollectionRequest<Route>('routes');

  if (!data) return <div>Loading...</div>;

  if (error) return <div>An Error has occurred...</div>;
  console.log('route data', data);

  return <div>Route Table</div>;
};

export default RouteTable;
