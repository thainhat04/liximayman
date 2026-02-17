import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import EnvelopeForm from '../components/EnvelopeForm';
import { RedEnvelopeItem } from '../models/RedEnvelope';
import { getRedEnvelope, updateRedEnvelope } from '../services/api';
import { ENVELOPE_IMAGES } from '../constants/envelopeImages';

const EditEnvelope: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [envelopes, setEnvelopes] = useState<RedEnvelopeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvelope = async () => {
      if (!id || !token) {
        setError('Thiếu thông tin xác thực');
        setLoading(false);
        return;
      }

      try {
        const data = await getRedEnvelope(id);
        // Convert DTO to RedEnvelopeItem for editing
        setEnvelopes(data.envelopes.map(env => ({
          amount: env.amount || 0,
          imageId: env.imageId
        })));
      } catch (err) {
        console.error('Error fetching envelope:', err);
        setError('Không tìm thấy bao lì xì');
      } finally {
        setLoading(false);
      }
    };

    fetchEnvelope();
  }, [id, token]);

  const handleAddEnvelope = (envelope: RedEnvelopeItem) => {
    setEnvelopes([...envelopes, envelope]);
  };

  const handleRemoveEnvelope = (index: number) => {
    setEnvelopes(envelopes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!id || !token) {
      alert('Thiếu thông tin xác thực');
      return;
    }

    if (envelopes.length === 0) {
      alert('Vui lòng thêm ít nhất một bao lì xì');
      return;
    }

    setSaving(true);
    try {
      await updateRedEnvelope(id, token, { envelopes });
      alert('Cập nhật thành công!');
      navigate(`/view/${id}`);
    } catch (err: any) {
      console.error('Error updating envelope:', err);
      if (err.response?.status === 403) {
        alert('Token không hợp lệ. Bạn không có quyền chỉnh sửa bao lì xì này.');
      } else {
        alert('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-card">
          <h1>😢 {error}</h1>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Tạo bao lì xì mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>✏️ Chỉnh Sửa Bao Lì Xì</h1>
        <p className="subtitle">Thay đổi nội dung bao lì xì của bạn</p>
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
              <p className="hint">Thêm bao lì xì →</p>
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
              <div className="button-group">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/view/${id}`)}
                >
                  Hủy
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEnvelope;
