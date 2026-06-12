import { Request, Response } from 'express';
import axios from 'axios';

const analyzeImage = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      res.status(400).json({ message: 'No image provided' });
      return;
    }

    const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY || 'rTr8HDJgq7thLLr029VT';
    
    // Extract base64 (remove the data:image/jpeg;base64, part)
    const base64Data = image.split(',')[1];

    // Roboflow Inference API - Using a general object detection model (COCO) which is stable
    const model = 'microsoft-coco/9'; 
    const url = `https://detect.roboflow.com/${model}?api_key=${ROBOFLOW_API_KEY}`;

    const response = await axios({
      method: 'POST',
      url: url,
      data: base64Data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const predictions = response.data.predictions;

    if (!predictions || predictions.length === 0) {
      res.status(404).json({ message: 'No objects detected in the image.' });
      return;
    }

    // Sort by confidence and pick the top one
    const topPrediction = predictions.sort((a: any, b: any) => b.confidence - a.confidence)[0];
    const objectName = topPrediction.class;

    // Map Roboflow classes to project categories
    const categoryMap: Record<string, string> = {
      'bottle': 'Food & Groceries',
      'apple': 'Food & Groceries',
      'sandwich': 'Food & Groceries',
      'orange': 'Food & Groceries',
      'broccoli': 'Food & Groceries',
      'carrot': 'Food & Groceries',
      'hot dog': 'Food & Groceries',
      'pizza': 'Food & Groceries',
      'donut': 'Food & Groceries',
      'cake': 'Food & Groceries',
      'cup': 'Household',
      'laptop': 'Electronics',
      'cell phone': 'Electronics',
      'keyboard': 'Electronics',
      'mouse': 'Electronics',
      'remote': 'Electronics',
      'book': 'Books',
      'backpack': 'Clothing',
      'handbag': 'Clothing',
      'tie': 'Clothing',
      'suitcase': 'Clothing',
      'bowl': 'Household',
      'chair': 'Household',
      'couch': 'Household',
      'bed': 'Household',
      'dining table': 'Household',
      'toilet': 'Household',
      'tv': 'Electronics',
      'microwave': 'Household',
      'oven': 'Household',
      'toaster': 'Household',
      'sink': 'Household',
      'refrigerator': 'Household',
      'clock': 'Household',
      'vase': 'Household',
      'scissors': 'Household',
      'teddy bear': 'Kids',
      'toothbrush': 'Personal Care',
      'car': 'Household', // Catch-all for generic objects
      'truck': 'Kids', // Usually toy trucks in this context
      'motorcycle': 'Household',
      'bicycle': 'Household'
    };

    const category = categoryMap[objectName] || 'Household';

    // Rich templates based on categories to provide accurate and appealing descriptions
    const descriptionTemplates: Record<string, string[]> = {
      "Electronics": [
        `This premium ${objectName} is in excellent working condition. It has been thoroughly tested and functions perfectly. A great opportunity to get reliable tech at a neighborly price!`,
        `Selling my gently used ${objectName}. It's been very reliable and has no major scratches or dents. Perfect for your daily tech needs, tested and ready to go.`
      ],
      "Household": [
        `Beautiful ${objectName} ready for a new home. Adds a wonderful touch to any room. It has been well-cared for, completely clean, and comes from a smoke-free home.`,
        `Upgrading my space and letting go of this high-quality ${objectName}. It's sturdy, incredibly functional, and looks fantastic in person.`
      ],
      "Food & Groceries": [
        `Fresh and sealed ${objectName}. I bought extra and won't be able to use it in time. Stored properly in a cool, dry place.`,
        `High quality ${objectName} available. Packaging is completely intact and it's well within the expiry date. Grab a healthy deal!`
      ],
      "Clothing": [
        `Stylish ${objectName} in fantastic condition. Gently worn, freshly laundered, and from a smoke-free, pet-free home.`,
        `This ${objectName} fits great and looks amazing. High-quality fabric and no tears or stains. A solid addition to your wardrobe.`
      ],
      "Kids": [
        `Fun and safe ${objectName}. My kids have outgrown it, but it still has years of life left. Cleaned and sanitized!`,
        `Wonderful ${objectName} that will bring lots of joy. Durable build and in great shape for the next family to enjoy.`
      ],
      "Gaming": [
        `Awesome ${objectName} for hours of entertainment. Tested and working perfectly without any issues.`,
        `Level up your setup with this ${objectName}. Very well taken care of by an adult gamer, works flawlessly.`
      ],
      "Books": [
        `Great read! This ${objectName} has clean pages and a solid spine. No highlighting or dog-eared pages.`,
        `Must-have ${objectName} for your collection. Read once and kept carefully on a bookshelf.`
      ],
      "Personal Care": [
        `Brand new, unopened ${objectName}. Perfect for your daily routine. Authentic product in pristine condition.`
      ]
    };

    const templates = descriptionTemplates[category] || descriptionTemplates["Household"];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Generate a professional Title
    const titleAdjectives = ['Premium', 'High-Quality', 'Excellent', 'Gently Used', 'Reliable', 'Authentic'];
    const adj = titleAdjectives[Math.floor(Math.random() * titleAdjectives.length)];
    const titleName = objectName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const title = `${adj} ${titleName}`;

    res.json({
      title,
      description: randomTemplate,
      category,
      condition: 'Like New', // Safe default for an AI estimate
      predictions: [{ class: objectName, confidence: topPrediction.confidence }]
    });

  } catch (error: any) {
    console.error('Roboflow Analysis Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to analyze image with Roboflow', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

export { analyzeImage };
