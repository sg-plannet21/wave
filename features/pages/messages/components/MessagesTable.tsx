import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import AudioPlayerDialog from 'components/feedback/audio-player-dialog';
import { Plus } from 'components/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  MessagessTableRecord,
  useMessagesTableData,
} from '../hooks/useMessagesTableData';
import DeleteSection from './DeleteMessage';

const MessagesTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, isLoading, error } = useMessagesTableData();
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Schedules,
  ]);

  const columns: TableColumn<MessagessTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: 'messages/[messageId]',
              query: { businessUnitId, messageId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    {
      field: 'audioFile',
      ignoreFiltering: true,
      label: 'Play',
      Cell({ entry }) {
        return (
          <AudioPlayerDialog
            trackList={{ src: entry.audioFile, name: entry.name }}
          />
        );
      },
    },
  ];

  if (isSuperUser || hasWriteAccess) {
    columns.push({
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <div className="text-right">
            <DeleteSection id={entry.id} name={entry.name} />
          </div>
        );
      },
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>We have encountered an error..</div>;

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="md:w-1/4 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        <Link href={`/${businessUnitId}/messages/upload`}>
          <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <Plus />
            <span>New Messages</span>
          </a>
        </Link>
      </div>
      <div className="w-full">
        <WaveTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default MessagesTable;
