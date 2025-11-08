"use client"
import React, { useRef, useState } from 'react'
import getAccess from './Transcriber';


const Controls = ({setTranscript}:{ setTranscript: React.Dispatch<React.SetStateAction<string>>;}) => {
    const[clicked, setClicked] = useState(false);
    const[recording, setRecording] = useState(false);
    let transcript = "";
    const socketRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const getAccess = async () => {
    
    //stop all connections
    if (recording) {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socketRef.current?.close();
      setRecording(false);
    } else {
      try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      const socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=nova-3', [ 'token', "6b47de4ae6459958453c9fbaf13b448d4a992812" ]);
      socket.onopen = () => {
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      });
        mediaRecorder.start(250)
      };
      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);

        const result = received.channel?.alternatives[0]?.transcript;
          if (result) {
            setTranscript((prev: string) => prev+" "+result);
          }
        };
        setRecording(true)
      } catch(err) {
        setTranscript("Failed to start transcription: "+err);
      }
      }
    }

    const startStop = () => {
      setClicked(!clicked);
      setTimeout(() => setClicked(false), 300)
      getAccess()
    }
  return (
    <div className='flex gap-4 items-center'>
    <button className={`border-2 transition-colors duration-300 ease-in-out bg-black ${clicked ? "text-black bg-white" : "text-white"}`} onClick={startStop}>Start/Stop</button>
    <img src={recording? "square-48.png" : "circle-48.png"} width={20} height={20}></img>
    </div>
  )
}

export default Controls