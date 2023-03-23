export type GetAddressParametersType = {
  user: string;
  assetId: string;
  custody: 'internal' | 'exchange' | 'custodian';
  wallet: number;
};

export type GetNextReceiveIndexResponseType = {
  index: number;
  bip44Path: number;
  isRegistered: boolean;
};
