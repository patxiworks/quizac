


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/*export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}*/

/*import axios from 'axios';

export default async function handler(req, res) {
  console.log('apiKey')
  if (req.method === 'GET') {
    const { prompt } = req.body;
    const apiKey = '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';

    try {
      console.log('try')
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci/completions',
        {
          prompt,
          max_tokens: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );
        console.log(response)
      const responseData = response.data.choices[0].text;
      res.status(200).json({ response: responseData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  await fetch(
    `https://api.openai.com/v1/completions`,
    {
        body: JSON.stringify({"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}),
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer  API_KEY_HERE",
        },
            }
  ).then((response) => {
      if (response.ok) {
          response.json().then((json) => {
              terminal.echo(json);
          });
      }
  });
}*/

import OpenAI from "openai";
//const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: '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'
})

export default async function handler(req, res) {
  const { text } = req.body;
 
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(req.body.animal),
    temperature: 0.6,
  });
 
  //const sentiment = response.choices[0].text;
 
  res.status(200).json({ completion });
 }