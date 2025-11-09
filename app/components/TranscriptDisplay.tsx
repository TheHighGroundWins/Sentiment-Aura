import React, { useEffect, useRef } from 'react'
import { Transcript } from './UIOverlay'

const TranscriptDisplay = ({transcript}: {transcript: Transcript}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  },[transcript.text]);


  return (
    <div ref={ref} style={{height:'100px', overflow: 'hidden'}} className={`${transcript.text.length > 0 ? "opacity-80":"opacity-0"}
    backdrop-blur-3xl rounded-2xl bg-[#33415566] mt-5 ml-10 mr-10 p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-scroll scroll-smooth`}>
        <p>{transcript.text}</p>
    </div>
  )
}

export default TranscriptDisplay