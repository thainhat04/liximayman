import pool from '../config/database';
import { RedEnvelope, EnvelopeItem } from '../types/RedEnvelope';

class DatabaseStorage {
  // Create a new red envelope packet
  async create(redEnvelope: RedEnvelope): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert packet
      await client.query(
        `INSERT INTO packets (id, creator_token, total_envelopes, created_at)
         VALUES ($1, $2, $3, $4)`,
        [
          redEnvelope.id,
          redEnvelope.creatorToken,
          redEnvelope.envelopes.length,
          redEnvelope.createdAt
        ]
      );
      
      // Insert envelopes
      if (redEnvelope.envelopes.length > 0) {
        const envelopeValues = redEnvelope.envelopes.map((env) => 
          `('${env.id}', '${redEnvelope.id}', ${env.amount}, '${env.imageId}', ${env.isOpened})`
        ).join(',');
        
        await client.query(
          `INSERT INTO envelopes (id, packet_id, amount, image_id, is_opened)
           VALUES ${envelopeValues}`
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Find red envelope packet by ID
  async findById(id: string): Promise<RedEnvelope | undefined> {
    const client = await pool.connect();
    
    try {
      // Get packet info
      const packetResult = await client.query(
        'SELECT * FROM packets WHERE id = $1 AND is_active = true',
        [id]
      );
      
      if (packetResult.rows.length === 0) {
        return undefined;
      }
      
      const packet = packetResult.rows[0];
      
      // Get envelopes
      const envelopesResult = await client.query(
        'SELECT * FROM envelopes WHERE packet_id = $1 ORDER BY created_at',
        [id]
      );
      
      const envelopes: EnvelopeItem[] = envelopesResult.rows.map(row => ({
        id: row.id,
        amount: parseFloat(row.amount),
        imageId: row.image_id,
        isOpened: row.is_opened,
        openedAt: row.opened_at
      }));
      
      return {
        id: packet.id,
        envelopes,
        creatorToken: packet.creator_token,
        createdAt: packet.created_at
      };
    } finally {
      client.release();
    }
  }

  // Update red envelope packet (for editing)
  async update(id: string, redEnvelope: RedEnvelope): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if packet exists
      const checkResult = await client.query(
        'SELECT id FROM packets WHERE id = $1',
        [id]
      );
      
      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      
      // Delete old envelopes
      await client.query('DELETE FROM envelopes WHERE packet_id = $1', [id]);
      
      // Insert new envelopes
      if (redEnvelope.envelopes.length > 0) {
        const envelopeValues = redEnvelope.envelopes.map((env) => 
          `('${env.id}', '${id}', ${env.amount}, '${env.imageId}', ${env.isOpened})`
        ).join(',');
        
        await client.query(
          `INSERT INTO envelopes (id, packet_id, amount, image_id, is_opened)
           VALUES ${envelopeValues}`
        );
      }
      
      // Update packet
      await client.query(
        `UPDATE packets 
         SET total_envelopes = $1, opened_count = 0, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [redEnvelope.envelopes.length, id]
      );
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Claim/Open an envelope
  async claimEnvelope(envelopeId: string, openedBy?: string): Promise<{
    success: boolean;
    message: string;
    amount?: number;
    envelope?: EnvelopeItem;
  }> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM claim_envelope($1, $2)',
        [envelopeId, openedBy || null]
      );
      
      const { success, message, amount } = result.rows[0];
      
      if (!success) {
        return { success: false, message };
      }
      
      // Get updated envelope info
      const envelopeResult = await client.query(
        'SELECT * FROM envelopes WHERE id = $1',
        [envelopeId]
      );
      
      const env = envelopeResult.rows[0];
      
      return {
        success: true,
        message,
        amount: parseFloat(amount),
        envelope: {
          id: env.id,
          amount: parseFloat(env.amount),
          imageId: env.image_id,
          isOpened: env.is_opened,
          openedAt: env.opened_at
        }
      };
    } finally {
      client.release();
    }
  }

  // Reset packet status (optional feature)
  async resetPacket(id: string): Promise<boolean> {
    try {
      await pool.query('SELECT reset_packet_status($1)', [id]);
      return true;
    } catch (error) {
      console.error('Error resetting packet:', error);
      return false;
    }
  }

  // Delete packet
  async delete(id: string): Promise<boolean> {
    try {
      const result = await pool.query(
        'UPDATE packets SET is_active = false WHERE id = $1',
        [id]
      );
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error deleting packet:', error);
      return false;
    }
  }
}

export default new DatabaseStorage();
