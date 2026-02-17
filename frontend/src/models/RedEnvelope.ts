export interface RedEnvelopeItem {
  amount: number;
  imageId: string;
}

export interface EnvelopeItemDTO {
  id: string;
  imageId: string;
  isOpened: boolean;
  amount?: number;
  openedAt?: string;
}

export interface RedEnvelopeUpsertDTO {
  envelopes: RedEnvelopeItem[];
}

export interface RedEnvelopeDTO {
  id: string;
  envelopes: EnvelopeItemDTO[];
  createdAt: string;
}

export interface RedEnvelopeDetailDTO extends RedEnvelopeDTO {
  publicUrl: string;
  editUrl?: string;
  creatorToken?: string;
}

export interface ClaimEnvelopeResponse {
  success: boolean;
  envelope?: {
    id: string;
    amount: number;
    imageId: string;
    openedAt: string;
  };
  message?: string;
}
