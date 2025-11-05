"use client"
import TranscriptDisplay from './TranscriptDisplay'
import KeywordsDisplay from './KeywordsDisplay'
import Controls from './Controls'
import AudioVisual from './AudioVisual'
import React, { useEffect, useState} from 'react'

const UIOverlay = () => {

  const[keywordList, setKeywords] = useState([""]);
  const [words, setWords] = useState<string[]>([]);

  const updateKeywords = () => {
      setKeywords(words)
    }

  const inputKeywords = (e: React.ChangeEvent<HTMLInputElement>) => {
      setWords(e.target.value.split(""))
    }

  return (
    <div className='relative'>
        <AudioVisual />
        
        <div className='absolute flex flex-col text-2xl gap-10'>
            
            <TranscriptDisplay/>
            <KeywordsDisplay keywords={keywordList}/>
            <Controls/>
            <input onChange={inputKeywords}></input>
            <button onClick={updateKeywords}>button</button>
        </div>
    </div>
  )
}

export default UIOverlay