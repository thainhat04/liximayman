import React from 'react';
import { RedEnvelopeItem } from '../models/RedEnvelope';
import { ENVELOPE_IMAGES } from '../constants/envelopeImages';

interface EnvelopeCardProps {
  envelope: RedEnvelopeItem;
  onRemove?: () => void;
  showRemove?: boolean;
}

const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ envelope, onRemove, showRemove = false }) => {
  const imageConfig = ENVELOPE_IMAGES.find(img => img.id === envelope.imageId);
  
  return (
    <div className="envelope-card">
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
      {showRemove && onRemove && (
        <button className="remove-btn" onClick={onRemove}>
          ×
        </button>
      )}
    </div>
  );
};

export default EnvelopeCard;
