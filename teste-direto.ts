import dotenv from 'dotenv';
dotenv.config();

async function testarApiDireto() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Testando a rota v1 (estável) em vez da v1beta
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: "Diga 'Conexão direta estabelecida'" }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ SUCESSO DIRETO:", data.candidates[0].content.parts[0].text);
    } else {
      console.error("❌ ERRO DA API:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ ERRO NO FETCH:", error);
  }
}

testarApiDireto();