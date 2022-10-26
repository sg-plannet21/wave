import { SvgElement } from "./types";

const EntryPoint: SvgElement = (props) => {
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
      <path d="M6 42v-3h4.6V6h19.5v2.25h7.35V39H42v3h-7.55V11.25H30.1V42Zm7.6-33v30Zm10.95 15q0-.85-.575-1.425Q23.4 22 22.55 22q-.85 0-1.425.575-.575.575-.575 1.425 0 .85.575 1.425Q21.7 26 22.55 26q.85 0 1.425-.575.575-.575.575-1.425ZM13.6 39h13.5V9H13.6Z" />
    </svg>
  );
};
export default EntryPoint;
