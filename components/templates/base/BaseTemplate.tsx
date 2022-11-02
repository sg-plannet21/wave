export type BaseTemplateProps = {
  sampleTextProp: string;
};

const BaseTemplate: React.FC<BaseTemplateProps> = ({ sampleTextProp }) => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
      {sampleTextProp}
    </div>
  );
};

export default BaseTemplate;
