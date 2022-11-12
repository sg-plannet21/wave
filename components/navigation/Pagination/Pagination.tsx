export type PaginationProps = {
  sampleTextProp: string;
};

const Pagination: React.FC<PaginationProps> = ({ sampleTextProp }) => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
      {sampleTextProp}
    </div>
  );
};

export default Pagination;
