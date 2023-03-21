export type GetAddressParametersType = {
  user: string;
  assetId: string;
  custody: 'internal' | 'exchange' | 'custodian';
  wallet: number;
};
