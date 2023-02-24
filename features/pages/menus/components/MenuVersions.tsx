import VersionsDrawer from 'features/entity-versions/components/VersionsDrawer';
import VersionsTable from 'features/entity-versions/components/VersionsTable';
import useMenusVersionData from '../hooks/useMenusVersionData';

type MenuVersionsProps = {
  menuId: string;
};

const MenuVersions: React.FC<MenuVersionsProps> = ({ menuId: menuId }) => {
  const { data, mappings, error, isLoading, label } =
    useMenusVersionData(menuId);

  if (error) return <div>We encountered an error...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <VersionsDrawer title={label}>
      <VersionsTable
        mappings={mappings}
        currentVersion={data[0]}
        previousVersions={data.slice(1)}
      />
    </VersionsDrawer>
  );
};

export default MenuVersions;
