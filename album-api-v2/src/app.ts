import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import albumRoutes from './routes/albums';

const app: Application = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/', albumRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
