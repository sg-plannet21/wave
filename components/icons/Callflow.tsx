import { SvgElement } from './types';

const Callflow: SvgElement = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="none"
      viewBox="0 96 960 960"
      className="h-6 w-6"
      {...props}
    >
      <path d="M160 1016V796h100V686H160V466h100V356H160V136h260v220H320v110h100v80h160v-80h260v220H580v-80H420v80H320v110h100v220H160Zm60-60h140V856H220v100Zm0-330h140V526H220v100Zm420 0h140V526H640v100ZM220 296h140V196H220v100Zm70-50Zm0 330Zm420 0ZM290 906Z" />
    </svg>
  );
};

export default Callflow;
