import { Router } from "express";
import { prisma } from "../prisma.js";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage });

export const postsRouter = Router();

// Upload image
postsRouter.post('/image', upload.single('filename'), async (req, res) => {
  try {
    const description = req.body.description;
    const authorId = req.body.authorId;
    const filename = req.file.filename;

    // Save filename URL to the post in the database
    const post = await prisma.post.create({
      data: { 
        description: description,
        filename: filename,
        authorId: authorId,
      },
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get image
postsRouter.get('/:id/image', async (req, res) => {
  try {
    const postId = req.params.id;

    // Retrieve image URL from the post in the database
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || !post.filename) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(post.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

// Get all images
postsRouter.get('/images', async (req, res) => {
  try {
    // Retrieve all posts with image URLs from the database
    const posts = await prisma.post.findMany();
    
    const filenames = posts.map((post) => post.filename);
    res.json(filenames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});
