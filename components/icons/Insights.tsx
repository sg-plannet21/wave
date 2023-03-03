import { SvgElement } from './types';

const Insights: SvgElement = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="none"
      viewBox="0 96 960 960"
      className="h-6 w-6"
      {...props}
    >
      <path d="M109.912 906Q81 906 60.5 885.411 40 864.823 40 835.911 40 807 60.494 786.5t49.273-20.5q5.233 0 10.233.5 5 .5 13 2.5l200-200q-2-8-2.5-13t-.5-10.233q0-28.779 20.589-49.273Q371.177 476 400.089 476 429 476 449.5 496.634t20.5 49.61Q470 548 467 569l110 110q8-2 13-2.5t10-.5q5 0 10 .5t13 2.5l160-160q-2-8-2.5-13t-.5-10.233q0-28.779 20.589-49.273Q821.177 426 850.089 426 879 426 899.5 446.589q20.5 20.588 20.5 49.5Q920 525 899.506 545.5T850.233 566Q845 566 840 565.5q-5-.5-13-2.5L667 723q2 8 2.5 13t.5 10.233q0 28.779-20.589 49.273Q628.823 816 599.911 816 571 816 550.5 795.506T530 746.233q0-5.233.5-10.233.5-5 2.5-13L423 613q-8 2-13 2.5t-10.25.5q-1.75 0-22.75-3L177 813q2 8 2.5 13t.5 10.233q0 28.779-20.589 49.273Q138.823 906 109.912 906ZM160 464l-20.253-43.747L96 400l43.747-20.253L160 336l20.253 43.747L224 400l-43.747 20.253L160 464Zm440-51-30.717-66.283L503 316l66.283-30.717L600 219l30.717 66.283L697 316l-66.283 30.717L600 413Z" />
    </svg>
  );
};

export default Insights;
