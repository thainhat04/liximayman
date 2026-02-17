export interface EnvelopeItem {
  id: string;
  amount: number;
  imageId: string;
  isOpened: boolean;
  openedAt?: Date;
}

export interface RedEnvelopeUpsertDTO {
  envelopes: Array<{
    amount: number;
    imageId: string;
  }>;
}

export interface RedEnvelopeDTO {
  id: string;
  envelopes: Array<{
    id: string;
    imageId: string;
    isOpened: boolean;
    amount?: number; // Only shown if opened
    openedAt?: Date;
  }>;
  createdAt: Date;
}

export interface RedEnvelopeDetailDTO extends RedEnvelopeDTO {
  publicUrl: string;
  editUrl?: string;
  creatorToken?: string;
}

export interface RedEnvelope {
  id: string;
  envelopes: EnvelopeItem[];
  creatorToken: string;
  createdAt: Date;
}

export interface ClaimEnvelopeDTO {
  success: boolean;
  envelope?: {
    id: string;
    amount: number;
    imageId: string;
    openedAt: Date;
  };
  message?: string;
}
