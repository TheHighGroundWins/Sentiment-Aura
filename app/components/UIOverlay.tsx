"use client"
import TranscriptDisplay from './TranscriptDisplay'
import KeywordsDisplay from './KeywordsDisplay'
import Controls from './Controls'
import AudioVisual from './AudioVisual'
import React, {useState} from 'react'
import axios from 'axios'
import { sentimentData } from './AudioVisual'

const UIOverlay = () => {

  const[keywordList, setKeywords] = useState([""]);
  const [words, setWords] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [sentiments, setSentiments] = useState<sentimentData>(null);

  const updateKeywords = () => {
      setKeywords(words)
    }

  const inputKeywords = (e: React.ChangeEvent<HTMLInputElement>) => {
      setWords(e.target.value.split(""))
    }

  const callServer = async () => {
    const response = await axios.post('http://localhost:3001/process_text',
      {
        message: 'sentimental analysis (scale 0-10, happy, sad, angry, surprised, arousal, valence) and keywords, give pure JSON Data: Interviewee: Yeah, sure. So, um, I was living in, uh, London at the time. (2:15 – noise from passing ambulance) It was, uh, quite a harrowing period, you know? The air raids, they were, uh, relentless. (4:45 – pause due to emotional recollection) I remember one night, the, um, sirens blaring, and we rushed to the, uh, bomb shelter. The fear, it’s hard to, um, put into words.'
      },
      {
        headers: {
            'Content-Type': 'application/json'
        }
      }
    );
    
    setSentiments(response.data["sentimental_analysis"]);
    setKeywords(response.data["keywords"]);
  };

  return (
    <div className='relative'>
        <AudioVisual sentiments={sentiments}/>
        <div className='absolute inset-0 top-1/2 flex flex-col text-2xl gap-4 justify-center items-center'>
            
            <TranscriptDisplay transcript={transcript}/>
            <KeywordsDisplay keywords={keywordList}/>
            <Controls setTranscript={setTranscript}/>
            <input onChange={inputKeywords}></input>
            <button onClick={callServer}>button</button>
        </div>
    </div>
  )
}

export default UIOverlay