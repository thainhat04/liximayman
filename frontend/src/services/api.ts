import axios from 'axios';
import { RedEnvelopeUpsertDTO, RedEnvelopeDetailDTO, RedEnvelopeDTO, ClaimEnvelopeResponse } from '../models/RedEnvelope';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createRedEnvelope = async (data: RedEnvelopeUpsertDTO): Promise<RedEnvelopeDetailDTO> => {
  const response = await api.post<RedEnvelopeDetailDTO>('/red-envelopes', data);
  return response.data;
};

export const getRedEnvelope = async (id: string): Promise<RedEnvelopeDTO> => {
  const response = await api.get<RedEnvelopeDTO>(`/red-envelopes/${id}`);
  return response.data;
};

export const updateRedEnvelope = async (id: string, token: string, data: RedEnvelopeUpsertDTO): Promise<RedEnvelopeDTO> => {
  const response = await api.put<RedEnvelopeDTO>(`/red-envelopes/${id}?token=${token}`, data);
  return response.data;
};

export const claimEnvelope = async (redEnvelopeId: string, envelopeId: string): Promise<ClaimEnvelopeResponse> => {
  const response = await api.post<ClaimEnvelopeResponse>(`/red-envelopes/${redEnvelopeId}/claim/${envelopeId}`);
  return response.data;
};
