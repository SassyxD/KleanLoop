import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // allow larger base64 uploads for dev/testing
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body as { image?: string };
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // image expected as data:[mime];base64,XXXXX
    const matches = image.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Invalid image format' });

    const mime = matches[1];
    const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1];
    const b64 = matches[3];

    const buffer = Buffer.from(b64, 'base64');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `upload_${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    const url = `/uploads/${filename}`;
    return res.status(200).json({ url });
  } catch (err: any) {
    console.error('Upload error', err?.message || err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
