import express, { Request, Response } from 'express';
import { AuditRepository } from '../repositories/AuditRepository.js';

const router = express.Router();

// Get all audit logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const logs = await AuditRepository.getAll();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get audit logs for specific entity
router.get('/entity/:entityId', async (req: Request, res: Response) => {
  try {
    const { entityId } = req.params;
    const logs = await AuditRepository.getByEntityId(entityId);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching entity audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Export audit logs as CSV
router.get('/export/csv', async (req: Request, res: Response) => {
  try {
    const csv = await AuditRepository.exportAsCSV();
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="audit-log-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

export default router;
