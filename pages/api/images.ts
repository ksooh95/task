// pages/api/images.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const filePath = path.resolve('./db.json');
        const jsonData = await fs.promises.readFile(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        const images = data.images;
        res.status(200).json(images);
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ error: 'Failed to read images' });
    }
}
