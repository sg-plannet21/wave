import { SvgElement } from "./types";

const BusinessUnit: SvgElement = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M30.2 42v-6.25h-7.7v-20.5h-4.65v6.5H4V6h13.85v6.25H30.2V6H44v15.75H30.2v-6.5h-4.7v17.5h4.7v-6.5H44V42ZM7 9v9.75Zm26.2 20.25V39ZM33.2 9v9.75Zm0 9.75H41V9h-7.8Zm0 20.25H41v-9.75h-7.8ZM7 18.75h7.85V9H7Z" />
    </svg>
  );
};

export default BusinessUnit;
