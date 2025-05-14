import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import verifyToken from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

const COHERE_API_URL = 'https://api.cohere.ai/generate'; // Endpoint for Cohere's generation API

router.post('/', verifyToken, async (req, res) => {
  console.log("Token verified");
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      COHERE_API_URL,
      {
        model: 'command', // Use the "command" model for text generation
        prompt: prompt,
        max_tokens: 100, // Adjust token limit as per your needs
      },
      {
        headers: {
         Authorization: `Bearer ${process.env.COHERE_API_KEY}`, 

        },
      }
    );

    console.log("Response from Cohere: ", response.data); // Log the entire response

    // Directly access the 'text' field
    const generatedText = response.data.text || 'No response generated';

    return res.json({ result: generatedText });
  } catch (error) {
    console.error("Error calling Cohere API:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

export default router;
