export interface EnvelopeImage {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

export const ENVELOPE_IMAGES: EnvelopeImage[] = [
  {
    id: 'red-gold',
    name: 'Đỏ Vàng Kim',
    color: '#DC2626',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #FCD34D 100%)'
  },
  {
    id: 'lucky-red',
    name: 'Đỏ May Mắn',
    color: '#B91C1C',
    gradient: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #DC2626 100%)'
  },
  {
    id: 'golden-fortune',
    name: 'Vàng Phú Quý',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FCD34D 100%)'
  },
  {
    id: 'prosperity',
    name: 'Đỏ Thịnh Vượng',
    color: '#DC2626',
    gradient: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #F87171 100%)'
  },
  {
    id: 'pink-blossom',
    name: 'Hồng Mai',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #F9A8D4 100%)'
  },
  {
    id: 'royal-gold',
    name: 'Vàng Hoàng Gia',
    color: '#CA8A04',
    gradient: 'linear-gradient(135deg, #854D0E 0%, #CA8A04 50%, #FDE047 100%)'
  }
];
