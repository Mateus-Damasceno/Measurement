import { Request } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const convertToBase64 = (file: Express.Multer.File): string => {
  return file.buffer.toString('base64');
};