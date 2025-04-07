const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialisation de l'API Gemini pour la plateforme collaborative
const genAI = new GoogleGenerativeAI("AIzaSyBVX3X2P-DODXlqCBepD3EOFwDIhONKcwQ");

// Route pour générer du contenu pédagogique ou de révision avec Gemini
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Le prompt est requis." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({ generatedText: response });
  } catch (error) {
    console.error("Erreur API Gemini :", error);
    res.status(500).json({ error: "Erreur lors de la génération du contenu." });
  }
});

module.exports = router;
