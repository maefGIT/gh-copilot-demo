import app from './app';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🎵 Album API v2 is running on http://localhost:${PORT}`);
  console.log(`📖 Visit http://localhost:${PORT}/ for API information`);
  console.log(`📚 Get all albums at http://localhost:${PORT}/albums`);
});
