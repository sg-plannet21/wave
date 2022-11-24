const storagePrefix = 'wave_';

enum StorageKey {
  BusinessUnit = 'business_unit',
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}

function getLocalStorageItem(key: StorageKey) {
  return JSON.parse(
    window.localStorage.getItem(`${storagePrefix}${key}`) as string
  );
}
function setLocalStorageItem(key: StorageKey, value: string) {
  window.localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(value));
}
function clearLocalStorageItem(key: StorageKey) {
  JSON.parse(window.localStorage.getItem(`${storagePrefix}${key}`) as string);
}

const storage = {
  getAccessToken: (): string => getLocalStorageItem(StorageKey.AccessToken),
  setAccessToken: (token: string) => {
    setLocalStorageItem(StorageKey.AccessToken, token);
  },
  clearAccessToken: () => {
    clearLocalStorageItem(StorageKey.AccessToken);
  },
  getRefreshToken: (): string => getLocalStorageItem(StorageKey.RefreshToken),
  setRefreshToken: (token: string) => {
    setLocalStorageItem(StorageKey.RefreshToken, token);
  },
  clearRefreshToken: () => {
    clearLocalStorageItem(StorageKey.RefreshToken);
  },
  getBusinessUnit: (): string => getLocalStorageItem(StorageKey.BusinessUnit),
  setBusinessUnit: (businessUnitId: string) => {
    setLocalStorageItem(StorageKey.BusinessUnit, businessUnitId);
  },
  clearBusinessUnit: () => {
    clearLocalStorageItem(StorageKey.BusinessUnit);
  },
};

export default storage;
