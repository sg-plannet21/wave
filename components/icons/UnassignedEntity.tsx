import { SvgElement } from "./types";

const UnassignedEntity: SvgElement = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 48 48"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M22.5 44v-9h-11L6 29.5l5.5-5.5h11v-4.5H7.8v-11h14.7V4h3v4.5h11L42 14l-5.5 5.5h-11V24h14.7v11H25.5v9ZM10.8 16.5h24.45l2.5-2.5-2.5-2.5H10.8ZM12.75 32H37.2v-5H12.75l-2.5 2.5ZM10.8 16.5v-5 5ZM37.2 32v-5 5Z" />
    </svg>
  );
};

export default UnassignedEntity;
