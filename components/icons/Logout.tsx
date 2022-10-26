import { SvgElement } from "./types";

const Logout: SvgElement = (props) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
        <path d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h14.55v3H9v30h14.55v3Zm24.3-9.25-2.15-2.15 5.1-5.1h-17.5v-3h17.4l-5.1-5.1 2.15-2.15 8.8 8.8Z" />
      </svg>
    </svg>
  );
};

export default Logout;
