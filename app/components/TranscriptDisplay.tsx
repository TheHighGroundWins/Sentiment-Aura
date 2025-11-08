import React from 'react'

const TranscriptDisplay = ({transcript}: {transcript: string}) => {
  return (
    <div className={`${transcript.length > 0 ? "opacity-80":"opacity-0"} backdrop-blur-3xl rounded-2xl bg-[#33415566] mt-5 ml-10 mr-10 p-5 animate-FadeIn`}>
        <p>{transcript}</p>
    </div>
  )
}

export default TranscriptDisplay