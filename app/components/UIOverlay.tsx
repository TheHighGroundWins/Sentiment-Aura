"use client"
import TranscriptDisplay from './TranscriptDisplay'
import KeywordsDisplay from './KeywordsDisplay'
import Controls from './Controls'
import AudioVisual from './AudioVisual'
import React, { useEffect, useState} from 'react'

const UIOverlay = () => {

  const[keywordList, setKeywords] = useState([""]);
  const [words, setWords] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");





  
  const updateKeywords = () => {
      setKeywords(words)
    }

  const inputKeywords = (e: React.ChangeEvent<HTMLInputElement>) => {
      setWords(e.target.value.split(""))
    }

  return (
    <div className='relative'>
        <AudioVisual/>
        <div className='absolute inset-0 top-1/2 flex flex-col text-2xl gap-4 justify-center items-center'>
            
            <TranscriptDisplay transcript={transcript}/>
            <KeywordsDisplay keywords={keywordList}/>
            <Controls setTranscript={setTranscript}/>
            <input onChange={inputKeywords}></input>
            <button onClick={updateKeywords}>button</button>
        </div>
    </div>
  )
}

export default UIOverlay