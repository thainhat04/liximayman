-- Red Envelope Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if exist (for development)
DROP TABLE IF EXISTS envelopes CASCADE;
DROP TABLE IF EXISTS packets CASCADE;

-- Table: packets
-- Stores red envelope packet/collection information
CREATE TABLE packets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_token UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    total_envelopes INTEGER NOT NULL,
    opened_count INTEGER DEFAULT 0,
    allow_multiple_open BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: envelopes
-- Stores individual red envelope information
CREATE TABLE envelopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    packet_id UUID NOT NULL REFERENCES packets(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    image_id VARCHAR(50) NOT NULL,
    is_opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP,
    opened_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_packets_creator_token ON packets(creator_token);
CREATE INDEX idx_packets_created_at ON packets(created_at);
CREATE INDEX idx_packets_is_active ON packets(is_active);

CREATE INDEX idx_envelopes_packet_id ON envelopes(packet_id);
CREATE INDEX idx_envelopes_packet_opened ON envelopes(packet_id, is_opened);
CREATE INDEX idx_envelopes_is_opened ON envelopes(is_opened);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_packets_updated_at
    BEFORE UPDATE ON packets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to reset packet status
CREATE OR REPLACE FUNCTION reset_packet_status(p_packet_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Reset all envelopes
    UPDATE envelopes
    SET is_opened = false,
        opened_at = NULL,
        opened_by = NULL
    WHERE packet_id = p_packet_id;
    
    -- Reset packet counter
    UPDATE packets
    SET opened_count = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_packet_id;
END;
$$ LANGUAGE plpgsql;

-- Function to claim/open an envelope
CREATE OR REPLACE FUNCTION claim_envelope(
    p_envelope_id UUID,
    p_opened_by VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, message TEXT, amount DECIMAL) AS $$
DECLARE
    v_packet_id UUID;
    v_is_opened BOOLEAN;
    v_amount DECIMAL;
    v_allow_multiple BOOLEAN;
BEGIN
    -- Check if envelope exists and get info
    SELECT e.packet_id, e.is_opened, e.amount, p.allow_multiple_open
    INTO v_packet_id, v_is_opened, v_amount, v_allow_multiple
    FROM envelopes e
    JOIN packets p ON e.packet_id = p.id
    WHERE e.id = p_envelope_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Envelope not found'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;
    
    -- Check if already opened and multiple open not allowed
    IF v_is_opened AND NOT v_allow_multiple THEN
        RETURN QUERY SELECT false, 'This envelope has already been opened'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;
    
    -- Mark as opened
    UPDATE envelopes
    SET is_opened = true,
        opened_at = CURRENT_TIMESTAMP,
        opened_by = p_opened_by
    WHERE id = p_envelope_id;
    
    -- Increment packet opened count (only if not already opened)
    IF NOT v_is_opened THEN
        UPDATE packets
        SET opened_count = opened_count + 1
        WHERE id = v_packet_id;
    END IF;
    
    RETURN QUERY SELECT true, 'Success'::TEXT, v_amount;
END;
$$ LANGUAGE plpgsql;

-- Insert test data (optional - remove in production)
-- Uncomment to test
/*
DO $$
DECLARE
    v_packet_id UUID;
BEGIN
    -- Insert test packet
    INSERT INTO packets (name, total_envelopes)
    VALUES ('Test Red Envelope', 3)
    RETURNING id INTO v_packet_id;
    
    -- Insert test envelopes
    INSERT INTO envelopes (packet_id, amount, image_id)
    VALUES 
        (v_packet_id, 100000, 'red-gold'),
        (v_packet_id, 200000, 'lucky-red'),
        (v_packet_id, 500000, 'golden-fortune');
END $$;
*/
