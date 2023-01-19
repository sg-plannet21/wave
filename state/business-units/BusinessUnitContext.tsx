import { createContext, useCallback, useState } from 'react';

export interface BusinessUnitOption {
  id: string;
  name: string;
}

interface IBusinessUnitContext {
  activeBusinessUnit?: BusinessUnitOption;
  setActiveBusinessUnit: (businessUnit: BusinessUnitOption) => void;
}

const defaultValue: IBusinessUnitContext = {
  activeBusinessUnit: undefined,
  setActiveBusinessUnit: () => undefined,
};

const BusinessUnitContext = createContext<IBusinessUnitContext>(defaultValue);

export const BusinessUnitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [businessUnit, setBusinessUnit] = useState<
    BusinessUnitOption | undefined
  >(undefined);

  const setActiveBusinessUnit: IBusinessUnitContext['setActiveBusinessUnit'] =
    useCallback(
      (businessUnit) => setBusinessUnit(businessUnit),
      [setBusinessUnit]
    );

  return (
    <BusinessUnitContext.Provider
      value={{
        activeBusinessUnit: businessUnit,
        setActiveBusinessUnit,
      }}
    >
      {children}
    </BusinessUnitContext.Provider>
  );
};

export default BusinessUnitContext;
