export interface IContentLayout {
  title: string;
  children: React.ReactNode;
}

const ContentLayout: React.FC<IContentLayout> = ({ title, children }) => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
    </div>
  );
};
export default ContentLayout;
