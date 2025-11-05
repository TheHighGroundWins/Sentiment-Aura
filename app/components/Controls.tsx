"use client"
import React, { useState } from 'react'


const Controls = () => {
    const[clicked, setClicked] = useState(false);
    const startStop = () => {
        setClicked(!clicked);
        setTimeout(() => setClicked(false), 300)
    }
  return (
    <button className={`border-2 transition-colors duration-300 ease-in-out ${clicked ? "text-black bg-white" : "text-white"}`} onClick={startStop}>Start/Stop</button>
  )
}

export default Controls