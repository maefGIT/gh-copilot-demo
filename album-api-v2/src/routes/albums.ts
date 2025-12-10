import { Router, Request, Response } from 'express';
import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from '../data/albums';
import { validateAlbumInput, validateAlbumUpdateInput } from '../middleware/validation';

const router = Router();

// GET / - Welcome message
router.get('/', (_req: Request, res: Response) => {
  res.send('Hit the /albums endpoint to retrieve a list of albums!');
});

// GET /albums - Get all albums
router.get('/albums', (_req: Request, res: Response) => {
  const albums = getAllAlbums();
  res.json(albums);
});

// GET /albums/:id - Get album by ID
router.get('/albums/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid album ID' });
    return;
  }
  
  const album = getAlbumById(id);
  
  if (!album) {
    res.status(404).json({ error: 'Album not found' });
    return;
  }
  
  res.json(album);
});

// POST /albums - Create a new album
router.post('/albums', validateAlbumInput, (req: Request, res: Response) => {
  const { title, artist, price, image_url } = req.body;
  
  const newAlbum = createAlbum({
    title: title.trim(),
    artist: artist.trim(),
    price,
    image_url: image_url.trim()
  });
  
  res.status(201).json(newAlbum);
});

// PUT /albums/:id - Update an album
router.put('/albums/:id', validateAlbumUpdateInput, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid album ID' });
    return;
  }
  
  const { title, artist, price, image_url } = req.body;
  
  const updateData: any = {};
  if (title !== undefined) updateData.title = title.trim();
  if (artist !== undefined) updateData.artist = artist.trim();
  if (price !== undefined) updateData.price = price;
  if (image_url !== undefined) updateData.image_url = image_url.trim();
  
  const updatedAlbum = updateAlbum(id, updateData);
  
  if (!updatedAlbum) {
    res.status(404).json({ error: 'Album not found' });
    return;
  }
  
  res.json(updatedAlbum);
});

// DELETE /albums/:id - Delete an album
router.delete('/albums/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid album ID' });
    return;
  }
  
  const deleted = deleteAlbum(id);
  
  if (!deleted) {
    res.status(404).json({ error: 'Album not found' });
    return;
  }
  
  res.status(204).send();
});

export default router;
