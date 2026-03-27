const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Analyze an image buffer using Google Gemini Vision (gemini-2.5-flash)
 * @param {Buffer} imageBuffer - Raw image bytes
 * @param {String} mimeType - e.g. 'image/jpeg'
 * @returns {Promise<String>} AI-generated description
 */
async function analyzeImage(imageBuffer, mimeType) {
  const apiKey = process.env.OPENAI_API_KEY; // env var name kept for backwards compat
  
  if (!apiKey || apiKey.includes('your_openai_api_key_here')) {
    console.warn('⚠️  No API key set. Returning mock description.');
    return `[Mock] This image appears to contain interesting visual content. Set OPENAI_API_KEY in your .env file to get real AI descriptions.`;
  }

  // Guard: Gemini requires a reasonably-sized image
  if (imageBuffer.length < 1000) {
    throw new Error('Image is too small or corrupted. Please upload a valid image (at least a few KB in size).');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = 'You are an expert image analyst. Describe what you see in this image clearly and concisely in 2-4 sentences. Include the main subjects, colors, setting, and any notable details.';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.isBuffer(imageBuffer)
            ? imageBuffer.toString('base64')
            : imageBuffer,
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    const msg = error.message || '';
    if (msg.includes('400') || msg.includes('Unable to process')) {
      throw new Error('Gemini could not process this image. It may be corrupted or an unsupported format.');
    } else if (msg.includes('429')) {
      throw new Error('API rate limit reached. Please wait a moment and try again.');
    }
    console.error('Gemini API Error:', msg);
    throw new Error('AI analysis failed: ' + msg.split('\n')[0]);
  }
}

module.exports = { analyzeImage };
