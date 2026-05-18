import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Letter Generation
  app.post("/api/generate-letter", async (req, res) => {
    try {
      const { type, rawNotes, context, sections } = req.body;

      const systemInstruction = `
        Anda adalah asisten administrasi profesional Pemerintahan Kabupaten Bangka Barat.
        Tugas Anda adalah menulis draf surat resmi berdasarkan Perbup Bangka Barat Nomor 67 Tahun 2023.
        Gunakan bahasa Indonesia yang sangat formal, baku (EYD), dan sesuai gaya bahasa birokrasi Indonesia.
        
        Jenis Surat: ${type}
        Struktur Bagian yang diminta: ${JSON.stringify(sections.map((s: any) => s.title))}
        
        Raw Notes: ${rawNotes}
        Context: ${JSON.stringify(context)}
        
        Uraikan isi surat untuk masing-masing bagian di atas berdasarkan Raw Notes.
        Berikan jawaban dalam format JSON:
        {
          "sections": [
            { "title": "Judul Bagian", "content": "Konten yang Anda tulis" },
            ...
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Tolong buatkan draf surat resminya.",
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
