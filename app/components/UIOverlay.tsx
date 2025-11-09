"use client"
import TranscriptDisplay from './TranscriptDisplay'
import KeywordsDisplay from './KeywordsDisplay'
import Controls from './Controls'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { sentimentData } from './AudioVisual'
import dynamic from 'next/dynamic'

export interface Transcript {
    text: string,
    is_final: boolean,
  }

const AudioVisual = dynamic(() => import("./AudioVisual"), {
  ssr: false,
});

function hashArray(arr: any[]): string {
  let hash = 0x811c9dc5;
  const str = JSON.stringify(arr);
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

const UIOverlay = () => {

  const[keywordList, setKeywords] = useState([""]);
  const [transcript, setTranscript] = useState<Transcript>({text:"", is_final: false});
  const [sentiments, setSentiments] = useState<sentimentData>({happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    arousal: 0,
    valence: 0});

  useEffect(() => {
    if (transcript.text && transcript.is_final) {
      callServer();
    }
  },[transcript.text, transcript.is_final]);

  const callServer = async () => {
    
    const response = await axios.post('http://localhost:3001/process_text',
      {
        message: `sentimental analysis (scale 0-10 happy, sad, angry, surprised, arousal, valence(binary value of -1 or 1)) and keywords (5 maximum), give pure JSON Data: ${transcript.text}`
      },
      {
        headers: {
            'Content-Type': 'application/json'
        }
      }
    );

    console.log(response)

    setSentiments(response.data["sentimental_analysis"]);
    setKeywords(response.data["keywords"]);
    
  };
  

  return (
    <div className='relative'>
        <AudioVisual key = {hashArray(keywordList)} sentiments={sentiments}/>
        
        <div className='absolute inset-0 top-1/2 flex flex-col text-2xl gap-4 justify-center items-center'>
            
            <TranscriptDisplay transcript={transcript}/>
            <KeywordsDisplay keywords={keywordList}/>
            <Controls setTranscript={setTranscript}/>
            <button onClick={callServer}>button</button>
        </div>
    </div>
  )
}

export default UIOverlay