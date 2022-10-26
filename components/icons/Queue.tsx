import { SvgElement } from "./types";

const Queue: SvgElement = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 48 48"
      stroke="currentColor"
      {...props}
    >
      <path d="m16.25 41.4-2.1-2.1 3.2-3.3q-5.5 0-9.425-3.75Q4 28.5 4 23q0-5.35 3.725-9.175Q11.45 10 16.8 10h7.6v3h-7.6q-4.1 0-6.95 2.925Q7 18.85 7 23q0 4.25 3.125 7.125T17.6 33l-3.3-3.3 2.1-2.1 6.8 6.85ZM28.6 36v-3H44v3Zm0-11.5v-3H44v3ZM27.4 13v-3H44v3Z" />
    </svg>
  );
};

export default Queue;
