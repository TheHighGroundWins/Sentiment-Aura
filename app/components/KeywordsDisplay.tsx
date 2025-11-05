import React, { useEffect, useState, useRef } from 'react'

const KeywordsDisplay = ({keywords}: {keywords: String[]}) => {

  const[loaded, reload] = useState(String);
  const containerRef = useRef(null);

  function hashArray(arr: any[]): string {
  let hash = 0x811c9dc5;
  const str = JSON.stringify(arr);
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(36);
  }


  return (
    <div className='flex gap-1' key={hashArray(keywords)}>
    {[...keywords].map((word, i) => (<h2 key={i} className='animate-FadeIn' 
    style={{animationIterationCount: 1, animationFillMode: "both", animationDelay: `${i*0.05}s`, animationDuration: '2s'}}>{word}</h2>))}
    </div>
  )
}

export default KeywordsDisplay