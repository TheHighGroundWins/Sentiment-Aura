import React, { useEffect, useRef } from 'react'

const KeywordsDisplay = ({keywords}: {keywords: String[]}) => {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth;
    }
  },[keywords]);

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
    <div ref={ref} style={{width:'600px', height:'60px', overflow: 'hidden'}} className={`flex gap-2 ${keywords.length > 0 ? "opacity-80":"opacity-0"} justify-center 
      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-x-scroll scroll-smooth
     backdrop-blur-xl rounded-full bg-[#33415566] p-4`} key={hashArray(keywords)}>
    {[...keywords].map((word, i) => (<h2 key={i} className='animate-FadeIn'
    style={{animationIterationCount: 1, animationFillMode: "both", animationDelay: `${i*0.05}s`, animationDuration: '2s'}}>{word}</h2>))}
    </div>
  )
}

export default KeywordsDisplay