async function testVision() {
  const KEY = 'AIzaSyAlZ70snbSdTAJyg61Q7kYcvNZCgw_Llcg';
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const fs = require('fs');
  const path = require('path');
  
  // Use glob to find a screenshot
  const desktopFiles = fs.readdirSync('/Users/sagarsunilchaurasia/Desktop/');
  const imgFile = desktopFiles.find(f => f.endsWith('.png') && !f.startsWith('.'));
  
  if (!imgFile) {
    console.log("No PNG found on desktop");
    return;
  }
  
  const localImg = path.join('/Users/sagarsunilchaurasia/Desktop/', imgFile);
  console.log("Testing with:", localImg);
  const imgBuffer = fs.readFileSync(localImg);
  console.log("Image size:", imgBuffer.length, "bytes");
  
  const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"];
  
  for (const modelName of models) {
    try {
      const genAI = new GoogleGenerativeAI(KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        "Describe this image briefly:",
        { inlineData: { data: imgBuffer.toString('base64'), mimeType: 'image/png' } }
      ]);
      const text = await result.response.text();
      console.log(`✅ ${modelName}: ${text.slice(0, 200)}`);
      return;
    } catch (err) {
      console.error(`❌ ${modelName}: ${err.message.slice(0, 300)}`);
    }
  }
}

testVision().catch(console.error);
