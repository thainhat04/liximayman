import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RedEnvelopeDTO, EnvelopeItemDTO } from '../models/RedEnvelope';
import { getRedEnvelope, claimEnvelope } from '../services/api';
import { ENVELOPE_IMAGES } from '../constants/envelopeImages';

const ViewEnvelope: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [envelope, setEnvelope] = useState<RedEnvelopeDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [justOpened, setJustOpened] = useState<string | null>(null);

  const fetchEnvelope = async () => {
    if (!id) {
      setError('ID không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      const data = await getRedEnvelope(id);
      setEnvelope(data);
    } catch (err) {
      console.error('Error fetching envelope:', err);
      setError('Không tìm thấy bao lì xì');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvelope();
  }, [id]);

  const handleOpenEnvelope = async (envelopeId: string) => {
    if (!id || claiming) return;

    setClaiming(envelopeId);
    try {
      const result = await claimEnvelope(id, envelopeId);
      
      if (result.success && result.envelope) {
        // Refresh data
        await fetchEnvelope();
        // Highlight the opened envelope
        setJustOpened(envelopeId);
        setTimeout(() => setJustOpened(null), 3000);
      } else {
        alert(result.message || 'Bao lì xì này đã được mở rồi');
      }
    } catch (err: any) {
      console.error('Error claiming envelope:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Có lỗi xảy ra khi mở bao lì xì');
      }
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (error || !envelope) {
    return (
      <div className="container">
        <div className="error-card">
          <h1>😢 {error || 'Không tìm thấy bao lì xì'}</h1>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Tạo bao lì xì mới
          </button>
        </div>
      </div>
    );
  }

  const totalOpened = envelope.envelopes.filter(e => e.isOpened).length;
  const totalEnvelopes = envelope.envelopes.length;
  const creatorToken = localStorage.getItem(`token_${id}`);

  return (
    <div className="container">
      <div className="view-header">
        <h1>🧧 Bao Lì Xì Năm Mới</h1>
        <p className="subtitle">Chọn một bao lì xì và nhận may mắn!</p>
        {creatorToken && (
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/edit/${id}?token=${creatorToken}`)}
          >
            ✏️ Chỉnh sửa
          </button>
        )}
      </div>

      <div className="envelopes-display">
        <div className="stats-card">
          <div className="stat-item">
            <span className="stat-label">Tổng số bao</span>
            <span className="stat-value">{totalEnvelopes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Đã mở</span>
            <span className="stat-value">{totalOpened}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Còn lại</span>
            <span className="stat-value">{totalEnvelopes - totalOpened}</span>
          </div>
        </div>

        <div className="envelopes-grid-view">
          {envelope.envelopes.map((env) => (
            <EnvelopeCardView
              key={env.id}
              envelope={env}
              onOpen={() => handleOpenEnvelope(env.id)}
              isOpening={claiming === env.id}
              justOpened={justOpened === env.id}
            />
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Tạo bao lì xì của bạn
        </button>
      </div>
    </div>
  );
};

interface EnvelopeCardViewProps {
  envelope: EnvelopeItemDTO;
  onOpen: () => void;
  isOpening: boolean;
  justOpened: boolean;
}

const EnvelopeCardView: React.FC<EnvelopeCardViewProps> = ({ 
  envelope, 
  onOpen, 
  isOpening,
  justOpened 
}) => {
  const imageConfig = ENVELOPE_IMAGES.find(img => img.id === envelope.imageId);
  
  return (
    <div className={`envelope-card-view ${envelope.isOpened ? 'opened' : 'closed'} ${justOpened ? 'just-opened' : ''}`}>
      <div 
        className="envelope-image-view" 
        style={{ background: imageConfig?.gradient || '#DC2626' }}
        onClick={!envelope.isOpened ? onOpen : undefined}
      >
        <div className="envelope-pattern">
          <div className="envelope-flap"></div>
          <div className="envelope-body">
            <div className="envelope-seal">
              {envelope.isOpened ? '✓' : '福'}
            </div>
          </div>
        </div>
        {!envelope.isOpened && (
          <div className="envelope-overlay">
            <button 
              className="btn-open-envelope"
              onClick={onOpen}
              disabled={isOpening}
            >
              {isOpening ? '...' : 'Mở'}
            </button>
          </div>
        )}
      </div>
      <div className="envelope-info-view">
        {envelope.isOpened ? (
          <>
            <div className="envelope-amount-revealed">
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }).format(envelope.amount || 0)}
            </div>
            <div className="envelope-status">Đã mở</div>
          </>
        ) : (
          <>
            <div className="envelope-mystery">???</div>
            <div className="envelope-hint">Nhấn để mở</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewEnvelope;
