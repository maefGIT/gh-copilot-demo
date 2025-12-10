import request from 'supertest';
import app from '../src/app';
import { resetAlbums, getAllAlbums } from '../src/data/albums';

describe('Album API v2', () => {
  // Reset data before each test
  beforeEach(() => {
    resetAlbums();
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Hit the /albums endpoint');
    });
  });

  describe('GET /albums', () => {
    it('should return all albums', async () => {
      const response = await request(app).get('/albums');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(6);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('artist');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('image_url');
    });

    it('should return correct first album data', async () => {
      const response = await request(app).get('/albums');
      expect(response.body[0]).toEqual({
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo"
      });
    });
  });

  describe('GET /albums/:id', () => {
    it('should return album by ID', async () => {
      const response = await request(app).get('/albums/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo"
      });
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app).get('/albums/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Album not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/albums/invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid album ID');
    });
  });

  describe('POST /albums', () => {
    it('should create a new album with auto-incremented ID', async () => {
      const newAlbum = {
        title: "New Album",
        artist: "New Artist",
        price: 15.99,
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(newAlbum);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 7);
      expect(response.body.title).toBe("New Album");
      expect(response.body.artist).toBe("New Artist");
      expect(response.body.price).toBe(15.99);
      expect(response.body.image_url).toBe("https://example.com/image.jpg");
    });

    it('should trim whitespace from string fields', async () => {
      const newAlbum = {
        title: "  Trimmed Title  ",
        artist: "  Trimmed Artist  ",
        price: 12.99,
        image_url: "  https://example.com/image.jpg  "
      };

      const response = await request(app)
        .post('/albums')
        .send(newAlbum);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Trimmed Title");
      expect(response.body.artist).toBe("Trimmed Artist");
      expect(response.body.image_url).toBe("https://example.com/image.jpg");
    });

    it('should return 400 when title is missing', async () => {
      const invalidAlbum = {
        artist: "Artist",
        price: 12.99,
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toHaveProperty('title');
    });

    it('should return 400 when artist is missing', async () => {
      const invalidAlbum = {
        title: "Title",
        price: 12.99,
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('artist');
    });

    it('should return 400 when price is missing', async () => {
      const invalidAlbum = {
        title: "Title",
        artist: "Artist",
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('price');
    });

    it('should return 400 when price is not a number', async () => {
      const invalidAlbum = {
        title: "Title",
        artist: "Artist",
        price: "invalid",
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('price');
    });

    it('should return 400 when price is negative', async () => {
      const invalidAlbum = {
        title: "Title",
        artist: "Artist",
        price: -5.99,
        image_url: "https://example.com/image.jpg"
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.details.price).toContain('positive');
    });

    it('should return 400 when image_url is missing', async () => {
      const invalidAlbum = {
        title: "Title",
        artist: "Artist",
        price: 12.99
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('image_url');
    });

    it('should return 400 with multiple validation errors', async () => {
      const invalidAlbum = {
        price: -10
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('title');
      expect(response.body.details).toHaveProperty('artist');
      expect(response.body.details).toHaveProperty('price');
      expect(response.body.details).toHaveProperty('image_url');
    });
  });

  describe('PUT /albums/:id', () => {
    it('should update an existing album', async () => {
      const updateData = {
        title: "Updated Title",
        artist: "Updated Artist",
        price: 19.99,
        image_url: "https://updated.com/image.jpg"
      };

      const response = await request(app)
        .put('/albums/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("Updated Title");
      expect(response.body.artist).toBe("Updated Artist");
      expect(response.body.price).toBe(19.99);
      expect(response.body.image_url).toBe("https://updated.com/image.jpg");
    });

    it('should partially update an album', async () => {
      const updateData = {
        price: 25.99
      };

      const response = await request(app)
        .put('/albums/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("You, Me and an App Id"); // Original title
      expect(response.body.price).toBe(25.99); // Updated price
    });

    it('should trim whitespace on update', async () => {
      const updateData = {
        title: "  Updated  "
      };

      const response = await request(app)
        .put('/albums/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated");
    });

    it('should return 404 for non-existent album', async () => {
      const updateData = {
        title: "Updated"
      };

      const response = await request(app)
        .put('/albums/999')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Album not found');
    });

    it('should return 400 for invalid ID', async () => {
      const updateData = {
        title: "Updated"
      };

      const response = await request(app)
        .put('/albums/invalid')
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid album ID');
    });

    it('should return 400 when no fields provided', async () => {
      const response = await request(app)
        .put('/albums/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('body');
    });

    it('should return 400 when price is invalid', async () => {
      const updateData = {
        price: -10
      };

      const response = await request(app)
        .put('/albums/1')
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.details).toHaveProperty('price');
    });
  });

  describe('DELETE /albums/:id', () => {
    it('should delete an existing album', async () => {
      const response = await request(app).delete('/albums/1');
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verify it's deleted
      const getResponse = await request(app).get('/albums/1');
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app).delete('/albums/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Album not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/albums/invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid album ID');
    });

    it('should reduce total album count after deletion', async () => {
      const beforeResponse = await request(app).get('/albums');
      const beforeCount = beforeResponse.body.length;

      await request(app).delete('/albums/1');

      const afterResponse = await request(app).get('/albums');
      expect(afterResponse.body.length).toBe(beforeCount - 1);
    });
  });

  describe('ID Auto-increment', () => {
    it('should auto-increment IDs correctly', async () => {
      const album1 = {
        title: "Album 1",
        artist: "Artist 1",
        price: 10.99,
        image_url: "https://example.com/1.jpg"
      };

      const album2 = {
        title: "Album 2",
        artist: "Artist 2",
        price: 11.99,
        image_url: "https://example.com/2.jpg"
      };

      const response1 = await request(app).post('/albums').send(album1);
      expect(response1.body.id).toBe(7);

      const response2 = await request(app).post('/albums').send(album2);
      expect(response2.body.id).toBe(8);
    });

    it('should handle ID increment after deletion', async () => {
      await request(app).delete('/albums/6');

      const newAlbum = {
        title: "New Album",
        artist: "New Artist",
        price: 12.99,
        image_url: "https://example.com/new.jpg"
      };

      const response = await request(app).post('/albums').send(newAlbum);
      // Should still be 7, not reuse deleted ID 6
      expect(response.body.id).toBe(7);
    });
  });

  describe('Data Persistence in Memory', () => {
    it('should persist created albums across requests', async () => {
      const newAlbum = {
        title: "Persistent Album",
        artist: "Persistent Artist",
        price: 16.99,
        image_url: "https://example.com/persistent.jpg"
      };

      const createResponse = await request(app).post('/albums').send(newAlbum);
      const newId = createResponse.body.id;

      const getResponse = await request(app).get(`/albums/${newId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.title).toBe("Persistent Album");
    });

    it('should persist updates across requests', async () => {
      await request(app).put('/albums/1').send({ title: "Changed Title" });

      const getResponse = await request(app).get('/albums/1');
      expect(getResponse.body.title).toBe("Changed Title");
    });
  });
});
