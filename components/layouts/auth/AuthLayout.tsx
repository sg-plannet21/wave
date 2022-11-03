import Image from 'next/image';
import logo from 'public/logo.svg';

export interface IAuthLayout {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<IAuthLayout> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center text-white">
            <Image
              width="96px"
              height="96px"
              className="h-24 w-auto"
              src={logo}
              alt="logo"
            />
          </div>
        </div>

        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
