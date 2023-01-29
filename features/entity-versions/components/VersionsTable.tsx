import classNames from 'classnames';
import Table, { TableColumn } from 'components/data-display/table';
import Select, { SelectOption } from 'components/inputs/select';
import { Version } from 'lib/client/types';
import { useEffect, useState } from 'react';
import {
  CommonVersionFields,
  DeserialiseEntityReturn,
  EntityMapping,
  VersionMappings,
} from '../types';

type VersionsTableProps<Entity extends { versions: Version[] }> = {
  mappings: EntityMapping<Entity>[];
  currentVersion: VersionMappings<Omit<Entity, 'versions'>> &
    CommonVersionFields;
  previousVersions: Array<
    VersionMappings<Omit<Entity, 'versions'>> & CommonVersionFields
  >;
};

const VersionsTable = <Entity extends { versions: Version[] }>({
  mappings,
  currentVersion,
  previousVersions,
}: VersionsTableProps<Entity>) => {
  const [selectedVersion, setSelectedVersion] = useState<SelectOption>({
    label: `Version ${previousVersions.length}`,
    value: 0,
  });

  useEffect(() => {
    setSelectedVersion({
      label: `Version ${previousVersions.length}`,
      value: 0,
    });
  }, [previousVersions.length]);

  if (!previousVersions.length) return <div>No Previous versions</div>;

  const columns: TableColumn<{
    key: keyof DeserialiseEntityReturn<Entity>;
    label: string | number;
  }>[] = [
    {
      field: 'key',
      label: '',
      Cell({ entry }) {
        return (
          <span className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {entry.label}
          </span>
        );
      },
    },
    {
      field: 'key',
      label: 'Current Version',
      Cell({ entry }) {
        const currentValue = currentVersion[entry.key];
        const versionValue =
          previousVersions[parseInt(selectedVersion.value as string)][
            entry.key
          ];
        return (
          <span
            className={classNames({
              'text-green-500 dark:text-green-400':
                currentValue !== versionValue,
            })}
          >
            {currentVersion[entry.key]}
          </span>
        );
      },
    },
    {
      field: 'key',
      label: `Version ${
        previousVersions.length - parseInt(selectedVersion.value as string)
      }`,
      Cell({ entry }) {
        const currentValue = currentVersion[entry.key];
        const versionValue =
          previousVersions[parseInt(selectedVersion.value as string)][
            entry.key
          ];
        return (
          <span
            className={classNames({
              'text-red-500 dark:text-red-400': currentValue !== versionValue,
            })}
          >
            {versionValue}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-end p-1">
        <Select
          className="w-64"
          selectedOption={selectedVersion}
          onChange={setSelectedVersion}
          options={Array.from(Array(previousVersions.length).keys()).map(
            (option) => ({
              label: `Version ${previousVersions.length - option}`,
              value: option,
            })
          )}
        />
      </div>
      <Table<EntityMapping<Entity>> data={mappings} columns={columns} />
    </div>
  );
};

export default VersionsTable;
