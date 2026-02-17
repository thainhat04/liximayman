import React, { useState } from 'react';
import { ENVELOPE_IMAGES } from '../constants/envelopeImages';
import { RedEnvelopeItem } from '../models/RedEnvelope';

interface EnvelopeFormProps {
  onAdd: (envelope: RedEnvelopeItem) => void;
}

const EnvelopeForm: React.FC<EnvelopeFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedImageId, setSelectedImageId] = useState<string>(ENVELOPE_IMAGES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    onAdd({
      amount: amountNum,
      imageId: selectedImageId
    });

    setAmount('');
  };

  return (
    <form className="envelope-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="amount">Số tiền (VNĐ)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền..."
          required
        />
      </div>

      <div className="form-group">
        <label>Chọn mẫu bao lì xì</label>
        <div className="image-selector">
          {ENVELOPE_IMAGES.map((img) => (
            <div
              key={img.id}
              className={`image-option ${selectedImageId === img.id ? 'selected' : ''}`}
              onClick={() => setSelectedImageId(img.id)}
            >
              <div 
                className="image-preview" 
                style={{ background: img.gradient }}
              >
                <span className="envelope-icon">🧧</span>
              </div>
              <span className="image-name">{img.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-add">
        + Thêm bao lì xì
      </button>
    </form>
  );
};

export default EnvelopeForm;
