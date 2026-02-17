import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnvelopeForm from '../components/EnvelopeForm';
import { RedEnvelopeItem } from '../models/RedEnvelope';
import { createRedEnvelope } from '../services/api';
import { ENVELOPE_IMAGES } from '../constants/envelopeImages';

const CreateEnvelope: React.FC = () => {
  const [envelopes, setEnvelopes] = useState<RedEnvelopeItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ publicUrl: string; editUrl: string } | null>(null);
  const navigate = useNavigate();

  const handleAddEnvelope = (envelope: RedEnvelopeItem) => {
    setEnvelopes([...envelopes, envelope]);
  };

  const handleRemoveEnvelope = (index: number) => {
    setEnvelopes(envelopes.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (envelopes.length === 0) {
      alert('Vui lòng thêm ít nhất một bao lì xì');
      return;
    }

    setIsCreating(true);
    try {
      const response = await createRedEnvelope({ envelopes });
      
      // Save creator token to localStorage
      if (response.creatorToken) {
        localStorage.setItem(`token_${response.id}`, response.creatorToken);
      }

      setResult({
        publicUrl: response.publicUrl,
        editUrl: response.editUrl || ''
      });
    } catch (error) {
      console.error('Error creating red envelope:', error);
      alert('Có lỗi xảy ra khi tạo bao lì xì. Vui lòng thử lại.');
    } finally {
      setIsCreating(false);
    }
  };

  if (result) {
    return (
      <div className="container">
        <div className="result-card">
          <div className="success-icon">✓</div>
          <h1>Tạo bao lì xì thành công!</h1>
          <p className="subtitle">Chia sẻ link này cho bạn bè để họ xem bao lì xì của bạn</p>
          
          <div className="link-section">
            <label>Link công khai (chỉ xem)</label>
            <div className="link-box">
              <input type="text" value={result.publicUrl} readOnly />
              <button 
                className="btn btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(result.publicUrl);
                  alert('Đã copy link!');
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="link-section">
            <label>Link chỉnh sửa (chỉ dành cho bạn)</label>
            <div className="link-box">
              <input type="text" value={result.editUrl} readOnly />
              <button 
                className="btn btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(result.editUrl);
                  alert('Đã copy link!');
                }}
              >
                Copy
              </button>
            </div>
            <p className="warning">⚠️ Lưu link này để có thể chỉnh sửa sau</p>
          </div>

          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => {
                const id = result.publicUrl.split('/').pop();
                navigate(`/view/${id}`);
              }}
            >
              Xem bao lì xì
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setResult(null);
                setEnvelopes([]);
              }}
            >
              Tạo bao mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🧧 Tạo Bao Lì Xì Năm Mới</h1>
        <p className="subtitle">Gửi lời chúc may mắn đến người thân yêu</p>
      </div>

      <div className="content-grid">
        <div className="form-section">
          <EnvelopeForm onAdd={handleAddEnvelope} />
        </div>

        <div className="preview-section">
          <h2>Danh sách bao lì xì ({envelopes.length})</h2>
          {envelopes.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có bao lì xì nào</p>
              <p className="hint">Thêm bao lì xì đầu tiên của bạn →</p>
            </div>
          ) : (
            <>
              <div className="envelopes-grid">
                {envelopes.map((envelope, index) => {
                  const imageConfig = ENVELOPE_IMAGES.find(img => img.id === envelope.imageId);
                  return (
                    <div key={index} className="envelope-card">
                      <div 
                        className="envelope-image" 
                        style={{ background: imageConfig?.gradient || '#DC2626' }}
                      >
                        <div className="envelope-pattern">
                          <div className="envelope-flap"></div>
                          <div className="envelope-body">
                            <div className="envelope-seal">福</div>
                          </div>
                        </div>
                      </div>
                      <div className="envelope-info">
                        <div className="envelope-amount">
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(envelope.amount)}
                        </div>
                        <div className="envelope-name">{imageConfig?.name || 'Lì xì'}</div>
                      </div>
                      <button className="remove-btn" onClick={() => handleRemoveEnvelope(index)}>
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="total-section">
                <strong>Tổng số tiền:</strong>
                <span className="total-amount">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(envelopes.reduce((sum, e) => sum + e.amount, 0))}
                </span>
              </div>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? 'Đang tạo...' : '🎉 Tạo bao lì xì'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEnvelope;
