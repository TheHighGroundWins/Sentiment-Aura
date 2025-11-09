"use server"

import axios from "axios";
import { Transcript } from "../components/UIOverlay";

export async function processText({transcript}: {transcript: Transcript}) {
    const response = await axios.post('http://ec2-18-223-235-254.us-east-2.compute.amazonaws.com:3001/process_text',
    {
    message: `sentimental analysis (scale 0-10 happy, sad, angry, surprised, arousal, valence(binary value of -1 or 1)) and keywords (5 maximum), give pure JSON Data: ${transcript.text}`
    },
    {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status != 200) {
        console.log("failed to get response from AI");
    }

    return response;
}