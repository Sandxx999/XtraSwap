import { Request, Response } from 'express';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

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
    
    // Use gemini-1.5-flash for speed and efficiency, pro as fallback
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro"];
    let parsedData = null;
    let lastError = null;

    // Extract base64 and mime type
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ message: 'Invalid image format' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `You are an expert item appraiser for a neighborhood peer-to-peer marketplace. 
    Analyze this image and:
    1. Identify the exact product, including brand and model if visible.
    2. Assess the condition based on packaging (sealed/unopened) or visual wear.
    3. Determine the most relevant category.
    4. Write a professional, catchy title (max 50 chars).
    5. Write a friendly, detailed description that would help a neighbor decide to buy it.`;

    const schema = {
      description: "Item analysis schema",
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: "A short, catchy title (max 50 chars)",
        },
        description: {
          type: SchemaType.STRING,
          description: "A friendly, detailed description of the item",
        },
        category: {
          type: SchemaType.STRING,
          description: "Product category",
          enum: ["Food & Groceries", "Electronics", "Household", "Clothing", "Books", "Personal Care", "Gaming", "Kids"],
        },
        condition: {
          type: SchemaType.STRING,
          description: "Item condition",
          enum: ["Unopened", "Like New", "Good", "Used"],
        },
      },
      required: ["title", "description", "category", "condition"],
    };

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { 
            responseMimeType: "application/json",
            responseSchema: schema as any
          }
        });

        const result = await model.generateContent([prompt, ...imageParts]);
        const text = result.response.text();
        
        parsedData = JSON.parse(text);
        
        // If successful, break out of the retry loop
        break; 
      } catch (error: any) {
        console.warn(`Model ${modelName} failed:`, error.message);
        lastError = error;
      }
    }

    if (!parsedData) {
      throw lastError || new Error("All AI models failed to respond.");
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ message: 'Failed to analyze image with AI', details: error.message || error.toString() });
  }
};

export { analyzeImage };