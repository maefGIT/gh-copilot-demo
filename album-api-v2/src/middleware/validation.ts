import { Request, Response, NextFunction } from 'express';

export interface ValidationError {
  error: string;
  details: { [key: string]: string };
}

export const validateAlbumInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, artist, price, image_url } = req.body;
  const errors: { [key: string]: string } = {};

  // Validate required fields
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.title = 'Title is required and must be a non-empty string';
  }

  if (!artist || typeof artist !== 'string' || artist.trim() === '') {
    errors.artist = 'Artist is required and must be a non-empty string';
  }

  if (price === undefined || price === null) {
    errors.price = 'Price is required';
  } else if (typeof price !== 'number' || isNaN(price)) {
    errors.price = 'Price must be a valid number';
  } else if (price <= 0) {
    errors.price = 'Price must be a positive number';
  }

  if (!image_url || typeof image_url !== 'string' || image_url.trim() === '') {
    errors.image_url = 'Image URL is required and must be a non-empty string';
  }

  // If there are validation errors, return 400
  if (Object.keys(errors).length > 0) {
    const validationError: ValidationError = {
      error: 'Validation failed',
      details: errors
    };
    res.status(400).json(validationError);
    return;
  }

  next();
};

export const validateAlbumUpdateInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, artist, price, image_url } = req.body;
  const errors: { [key: string]: string } = {};

  // For updates, fields are optional but must be valid if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Title must be a non-empty string';
    }
  }

  if (artist !== undefined) {
    if (typeof artist !== 'string' || artist.trim() === '') {
      errors.artist = 'Artist must be a non-empty string';
    }
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || isNaN(price)) {
      errors.price = 'Price must be a valid number';
    } else if (price <= 0) {
      errors.price = 'Price must be a positive number';
    }
  }

  if (image_url !== undefined) {
    if (typeof image_url !== 'string' || image_url.trim() === '') {
      errors.image_url = 'Image URL must be a non-empty string';
    }
  }

  // Check if at least one field is provided for update
  if (title === undefined && artist === undefined && price === undefined && image_url === undefined) {
    errors.body = 'At least one field must be provided for update';
  }

  // If there are validation errors, return 400
  if (Object.keys(errors).length > 0) {
    const validationError: ValidationError = {
      error: 'Validation failed',
      details: errors
    };
    res.status(400).json(validationError);
    return;
  }

  next();
};
