import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
// Choose storage: InMemoryStorage or DatabaseStorage
import inMemoryStorage from '../storage/InMemoryStorage';
import databaseStorage from '../storage/DatabaseStorage';
import { RedEnvelopeUpsertDTO, RedEnvelopeDetailDTO, RedEnvelopeDTO, ClaimEnvelopeDTO, EnvelopeItem } from '../types/RedEnvelope';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Storage selection - will be set during server initialization
export let storage: typeof databaseStorage | typeof inMemoryStorage = databaseStorage;

export function setStorage(storageInstance: typeof databaseStorage | typeof inMemoryStorage) {
  storage = storageInstance;
  console.log(`📦 Using storage: ${storageInstance === databaseStorage ? 'Database' : 'In-Memory'}`);
}

// Create new red envelope
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: RedEnvelopeUpsertDTO = req.body;

    if (!data.envelopes || !Array.isArray(data.envelopes) || data.envelopes.length === 0) {
      return res.status(400).json({ error: 'Envelopes array is required and must not be empty' });
    }

    // Validate each envelope
    for (const envelope of data.envelopes) {
      if (typeof envelope.amount !== 'number' || envelope.amount <= 0) {
        return res.status(400).json({ error: 'Each envelope must have a positive amount' });
      }
      if (!envelope.imageId || typeof envelope.imageId !== 'string') {
        return res.status(400).json({ error: 'Each envelope must have an imageId' });
      }
    }

    const id = uuidv4();
    const creatorToken = uuidv4();
    
    // Add unique ID and isOpened status to each envelope
    const envelopesWithState: EnvelopeItem[] = data.envelopes.map(env => ({
      id: uuidv4(),
      amount: env.amount,
      imageId: env.imageId,
      isOpened: false
    }));
    
    const redEnvelope = {
      id,
      envelopes: envelopesWithState,
      creatorToken,
      createdAt: new Date()
    };

    await storage.create(redEnvelope);

    const response: RedEnvelopeDetailDTO = {
      id: redEnvelope.id,
      envelopes: redEnvelope.envelopes.map(env => ({
        id: env.id,
        imageId: env.imageId,
        isOpened: env.isOpened,
        amount: env.amount // Creator can see all amounts
      })),
      createdAt: redEnvelope.createdAt,
      publicUrl: `${FRONTEND_URL}/view/${id}`,
      editUrl: `${FRONTEND_URL}/edit/${id}?token=${creatorToken}`,
      creatorToken
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating red envelope:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get red envelope by ID (public view - hide amounts for unopened envelopes)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.query.token as string;
    const redEnvelope = await storage.findById(id);

    if (!redEnvelope) {
      return res.status(404).json({ error: 'Red envelope not found' });
    }

    // If has creator token, show all amounts (edit mode)
    const isCreator = token && token === redEnvelope.creatorToken;

    const response: RedEnvelopeDTO = {
      id: redEnvelope.id,
      envelopes: redEnvelope.envelopes.map(env => ({
        id: env.id,
        imageId: env.imageId,
        isOpened: env.isOpened,
        amount: isCreator || env.isOpened ? env.amount : undefined, // Hide amount if not opened
        openedAt: env.openedAt
      })),
      createdAt: redEnvelope.createdAt
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching red envelope:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim/Open a specific envelope
router.post('/:id/claim/:envelopeId', async (req: Request, res: Response) => {
  try {
    const { envelopeId } = req.params;
    const openedBy = req.ip || req.headers['x-forwarded-for'] as string;

    const result = await storage.claimEnvelope(envelopeId, openedBy);

    if (!result.success) {
      const response: ClaimEnvelopeDTO = {
        success: false,
        message: result.message
      };
      return res.status(400).json(response);
    }

    const response: ClaimEnvelopeDTO = {
      success: true,
      envelope: result.envelope ? {
        id: result.envelope.id,
        amount: result.envelope.amount,
        imageId: result.envelope.imageId,
        openedAt: result.envelope.openedAt!
      } : undefined
    };

    res.json(response);
  } catch (error) {
    console.error('Error claiming envelope:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update red envelope (requires creator token)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.query.token as string;
    const data: RedEnvelopeUpsertDTO = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Creator token is required' });
    }

    const existingEnvelope = await storage.findById(id);
    if (!existingEnvelope) {
      return res.status(404).json({ error: 'Red envelope not found' });
    }

    if (existingEnvelope.creatorToken !== token) {
      return res.status(403).json({ error: 'Invalid creator token' });
    }

    if (!data.envelopes || !Array.isArray(data.envelopes) || data.envelopes.length === 0) {
      return res.status(400).json({ error: 'Envelopes array is required and must not be empty' });
    }

    // Validate each envelope
    for (const envelope of data.envelopes) {
      if (typeof envelope.amount !== 'number' || envelope.amount <= 0) {
        return res.status(400).json({ error: 'Each envelope must have a positive amount' });
      }
      if (!envelope.imageId || typeof envelope.imageId !== 'string') {
        return res.status(400).json({ error: 'Each envelope must have an imageId' });
      }
    }

    // Re-create envelopes with new IDs and reset opened status
    const envelopesWithState: EnvelopeItem[] = data.envelopes.map(env => ({
      id: uuidv4(),
      amount: env.amount,
      imageId: env.imageId,
      isOpened: false
    }));

    const updatedEnvelope = {
      ...existingEnvelope,
      envelopes: envelopesWithState
    };

    await storage.update(id, updatedEnvelope);

    const response: RedEnvelopeDTO = {
      id: updatedEnvelope.id,
      envelopes: updatedEnvelope.envelopes.map(env => ({
        id: env.id,
        imageId: env.imageId,
        isOpened: env.isOpened,
        amount: env.amount // Creator can see all amounts
      })),
      createdAt: updatedEnvelope.createdAt
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating red envelope:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
