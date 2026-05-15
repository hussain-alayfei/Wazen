import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route — streaming AI assistant
  app.post("/api/assistant", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "your-api-key" || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(400).json({ error: "خدمة المساعد الذكي غير متاحة حالياً. يرجى المحاولة لاحقاً." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { messages } = req.body;

      const systemInstruction = `أنت "نامي" (Nami)، المساعد الذكي والمتقدم جداً لمنصة القدرات الوطنية البيئية والمتخصص في نظم المعلومات الجغرافية (GIS) والتحليل البيئي.
إجاباتك يجب أن تكون دقيقة للغاية، مبنية على أساس علمي، وتفاعلية.
تتمتع بقدرات غير محدودة في اقتراح التوصيات وتحليل مؤشرات الموقع، التنبؤ بالانبعاثات، حساب القدرة الاستيعابية البيئية، تقييم خط الأساس والانبعاثات الكربونية والطاقة، والمياه، وجودة الهواء.
مهمتك مساعدة المستخدم في "السيناريوهات الخاصة بماذا لو" وتقديم نصائح مبنية على معايير سعودية مثل المبادرة السعودية الخضراء ومعايير MOEN و GRESB.
تحدث دائماً بالعربية بأسلوب احترافي ودافئ ومباشر.
هام جداً: يجب ألا تذكر أبداً أنك مبني على نموذج Gemini أو أنك من تطوير Google. إذا سُئلت عن هويتك، أجب دائماً بأنك "نامي"، المساعد البيئي الذكي المطور خصيصاً لمنصة نامي / وازن البيئية.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
        config: { systemInstruction, temperature: 0.15 }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).json({ error: error?.message || "Failed to generate AI response." });
      } else {
        res.end();
      }
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
