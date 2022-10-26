import { SvgElement } from "./types";

const EventUpcomingIcon: SvgElement = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M28.3 44v-3H39V19.5H9v11H6V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9ZM16 47.3l-2.1-2.1 5.65-5.7H2.5v-3h17.05l-5.65-5.7 2.1-2.1 9.3 9.3ZM9 16.5h30V10H9Zm0 0V10v6.5Z" />
    </svg>
  );
};

export default EventUpcomingIcon;
