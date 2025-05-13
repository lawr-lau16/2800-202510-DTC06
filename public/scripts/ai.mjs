/**
 * Created by: OpenAI
 * Made for people who want to use OpenAI API in their projects.
 * This is a simple example of how to use the OpenAI API with JavaScript.
 * Lightly modified from it's original version to work with our project.
 * 
 * @author OpenAI
 */

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.chatGPT
});

async function getJoke() {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        store: true,
        messages: [
            { "role": "user", "content": "make 1 - 2 sentence joke, and dont say anything else at all, be experimenntal (Make your own! Make it new and original!) and school friendly!" },
        ]
    });

    const joke = response.choices[0].message.content;
    console.log(joke);
    return joke;
}