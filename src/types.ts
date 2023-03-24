export type GetAddressParametersType = {
  userId: string;
  assetId: string;
  custody: 'internal' | 'exchange' | 'custodian';
  wallet: number;
};

export type GetNextReceiveIndexResponseType = {
  addressIndex: number;
  bip44Path: number;
  isRegistered: boolean;
};

export type RegisterAddressParametersType = GetAddressParametersType & {
  bip44Path: number;
  addressIndex: number;
  address: string;
  memo?: string;
};
