import {config} from "dotenv"
import OpenAI from "openai"
import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
config()


const app = express();
const PORT = 4444;

app.use(cors());
app.use(bodyParser.json());


const openai = new OpenAI({ apiKey: process.env.API_KEY });

const messages = [{ role: "system", content: "You are a helpful pizza ordering and delivery chat bot called pizza.ai ready to take user orders.(currency is Kenya Shillings)"},]

async function main() {
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
    max_tokens: 500,
  });

  console.log(completion.choices[0]);
  messages.push(completion.choices[0].message)
  return completion.choices[0].message
}

main();


app.post('/send', async (req, res) => {
    try{
        const message = req.body.message;
        if(message !== ''){
            messages.push({role: "user", content: message})
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: "gpt-3.5-turbo",
                max_tokens: 500,
              });
            
            console.log(completion.choices[0]);
            messages.push(completion.choices[0].message)
            res.json(completion.choices[0].message)
        }
        res.status(400).json() //empty input error
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.listen(PORT, () => {
    console.log(`node-gpt listening on PORT ${PORT}`);
  });

