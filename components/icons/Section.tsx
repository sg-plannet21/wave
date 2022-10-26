import { SvgElement } from "./types";

const Section: SvgElement = (props) => {
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
      <path d="M7 42q-1.2 0-2.1-.9Q4 40.2 4 39V20.45h3V39h22.6v3Zm6.05-6q-1.2 0-2.125-.9T10 33V14.45h3V33h22.65v3ZM19 30q-1.2 0-2.1-.9-.9-.9-.9-2.1V9q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v18q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h22V12.1H19V27Z" />
    </svg>
  );
};

export default Section;