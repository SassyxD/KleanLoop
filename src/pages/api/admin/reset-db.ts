import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Run seed script
    const { stdout, stderr } = await execAsync('npx tsx prisma/seed.ts', {
      cwd: process.cwd(),
    });

    console.log('Seed output:', stdout);
    if (stderr) console.error('Seed errors:', stderr);

    return res.status(200).json({ 
      success: true, 
      message: 'Database reset and seeded successfully',
      output: stdout,
    });
  } catch (error: any) {
    console.error('Reset error:', error);
    return res.status(500).json({ 
      error: 'Failed to reset database',
      details: error.message,
    });
  }
}
