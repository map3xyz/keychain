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
