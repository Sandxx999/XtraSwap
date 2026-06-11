import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const analyzeImage = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      res.status(400).json({ message: 'No image provided' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ message: 'Gemini API key not configured' });
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Extract base64 and mime type
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ message: 'Invalid image format' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `Analyze this image of an item someone is trying to sell on a neighborhood marketplace.
    Identify the product, its likely condition, and write a compelling title and description.
    The JSON must have these exact keys:
    - "title": A short, catchy title (max 50 chars).
    - "description": A friendly, detailed description of the item.
    - "category": Must be exactly one of: "Food & Groceries", "Electronics", "Household", "Clothing", "Books".
    - "condition": Must be exactly one of: "Unopened", "Like New", "Good", "Used". Guess based on packaging or visual state.`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();

    const parsedData = JSON.parse(text);

    res.json(parsedData);
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ message: 'Failed to analyze image with AI', details: error.message || error.toString() });
  }
};

export { analyzeImage };