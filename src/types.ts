export type GetAddressParametersType = {
  assetId: string;
  userId: string;
  walletId: number;
};

export type GetNextReceiveIndexResponseType = {
  addressIndex: number;
  bip44Path: number;
  isRegistered: boolean;
};

export type RegisterAddressParametersType = GetAddressParametersType & {
  address: string;
  addressIndex: number;
  bip44Path: number;
  memo?: string;
};

export type RegisterAddressResponseType = {
  error?: string;
  status?: 'ok';
};
