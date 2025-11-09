require("dotenv").config();
const express = require('express');
const cors = require("cors")
const app = express();
app.use(cors({origin: ['https://main.d3pqawc439qb79.amplifyapp.com',
'http://localhost:3000']}))
app.use(express.json())

app.post('/process_text', async (req, res) => {
    
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 500
      })
    })
    

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'Groq API error' 
      });
    }

    try {
        const aiTextResponse = data.choices[0].message.content;
        const cleanedData = aiTextResponse.replace(/```json\n?/g, '')
                                            .replace(/```\n?/g, '')
                                            .trim();
        const processedData = JSON.parse(cleanedData)
        res.json(processedData);
    } catch (parseError) {
        res.status(500).json({ 
            error: 'Invalid JSON response from Groq',
            rawResponse: data.content[0].text 
        });
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Require the Routes API  
// Create a Server and run it on the port 3000
const server = app.listen(3001, function () {
    // Starting the Server at the port 3001
    const addr = server.address();

    if (addr) {
        const host = addr.address;
        const port = addr.port;
        console.log(`Server running at http://${host}:${port}`);
    } else {
        console.log("Server address not available");
    }
})