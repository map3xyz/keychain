export type GetAddressParametersType = {
  assetId: string;
  custody: 'internal' | 'exchange' | 'custodian';
  userId: string;
  wallet: number;
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
