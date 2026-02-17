import { RedEnvelope, EnvelopeItem } from '../types/RedEnvelope';

class InMemoryStorage {
  private redEnvelopes: Map<string, RedEnvelope> = new Map();

  create(redEnvelope: RedEnvelope): Promise<void> {
    this.redEnvelopes.set(redEnvelope.id, redEnvelope);
    return Promise.resolve();
  }

  findById(id: string): Promise<RedEnvelope | undefined> {
    return Promise.resolve(this.redEnvelopes.get(id));
  }

  update(id: string, redEnvelope: RedEnvelope): Promise<boolean> {
    if (this.redEnvelopes.has(id)) {
      this.redEnvelopes.set(id, redEnvelope);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(this.redEnvelopes.delete(id));
  }

  // Claim/Open an envelope
  async claimEnvelope(envelopeId: string, openedBy?: string): Promise<{
    success: boolean;
    message: string;
    amount?: number;
    envelope?: EnvelopeItem;
  }> {
    // Find which packet contains this envelope
    let targetPacket: RedEnvelope | undefined;
    let targetEnvelope: EnvelopeItem | undefined;

    for (const packet of this.redEnvelopes.values()) {
      const env = packet.envelopes.find(e => e.id === envelopeId);
      if (env) {
        targetPacket = packet;
        targetEnvelope = env;
        break;
      }
    }

    if (!targetEnvelope || !targetPacket) {
      return {
        success: false,
        message: 'Envelope not found'
      };
    }

    if (targetEnvelope.isOpened) {
      return {
        success: false,
        message: 'This envelope has already been opened'
      };
    }

    // Mark as opened
    targetEnvelope.isOpened = true;
    targetEnvelope.openedAt = new Date();
    
    // Update the packet
    this.redEnvelopes.set(targetPacket.id, targetPacket);

    return {
      success: true,
      message: 'Success',
      amount: targetEnvelope.amount,
      envelope: targetEnvelope
    };
  }

  // Reset packet status (optional feature)
  async resetPacket(id: string): Promise<boolean> {
    const packet = this.redEnvelopes.get(id);
    if (!packet) {
      return false;
    }

    // Reset all envelopes
    packet.envelopes.forEach(env => {
      env.isOpened = false;
      env.openedAt = undefined;
    });

    this.redEnvelopes.set(id, packet);
    return true;
  }
}

export default new InMemoryStorage();
