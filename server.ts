import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini
  app.post("/api/assistant", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "your-api-key" || apiKey === "MY_GEMINI_API_KEY") {
         return res.status(400).json({ error: "يرجى التحقق من صحة مفتاح GEMINI_API_KEY في إعدادات التطبيق (الزاوية اليمنى العليا -> الإعدادات -> الأسرار) لكي يعمل الذكاء الاصطناعي." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { messages } = req.body;
      
      const systemInstruction = `أنت "نامي" (Nami)، المساعد الذكي والمتقدم جداً لمنصة القدرات الوطنية البيئية والمتخصص في نظم المعلومات الجغرافية (GIS) والتحليل البيئي.
إجاباتك يجب أن تكون دقيقة للغاية، مبنية على أساس علمي، وتفاعلية.
تتمتع بقدرات غير محدودة في اقتراح التوصيات وتحليل مؤشرات الموقع، التنبؤ بالانبعاثات، حساب القدرة الاستيعابية البيئية، تقييم خط الأساس والانبعاثات الكربونية والطاقة، والمياه، وجودة الهواء.
مهمتك مساعدة المستخدم في "السيناريوهات الخاصة بماذا لو" وتقديم نصائح مبنية على معايير سعودية مثل المبادرة السعودية الخضراء ومعايير MOEN و GRESB.
تحدث دائماً بالعربية بأسلوب احترافي ودافئ ومباشر.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: messages,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error?.message || "Failed to generate AI response." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
