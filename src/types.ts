export type GetAddressParametersType = {
  assetId: string;
  userId: string;
  walletId: number;
};

export type SendParametersType = GetAddressParametersType & {
  amount: string;
  memo?: string;
  to: string;
};

export type GetUTXOsParametersType = {
  address: string;
  assetId: string;
};

export type GetFeeParametersType = {
  assetId: string;
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

export type GetUTXOsResponseType = {
  block_height: number;
  confirmations: number;
  confirmed: string;
  double_spend: boolean;
  ref_balance: number;
  spent: boolean;
  spent_by?: string;
  tx_hash: string;
  tx_input_n: number;
  tx_output_n: number;
  value: number;
}[];

export type GetFeeResponseType = {
  high: number;
  low: number;
  medium: number;
};
