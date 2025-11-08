"use client";
import React, { useEffect, useRef } from "react";
import p5 from "p5";

export interface sentimentData {
    happy: number,
    sad: number,
    angry: number,
    surprised: number,
    arousal: number,
    valence: number
}

function emotionToHSV(value: number, min=0,max=10) {
    const normalized = (value - min) / (max - min);
  
  let hue;
  if (normalized < 0.5) {
    // 0 to 0.5: Blue (240°) → Cyan (180°)
    hue = 240 - (normalized * 2 * 60);
  } else {
    // 0.5 to 1: Yellow (60°) → Red (0°)
    hue = 60 - ((normalized - 0.5) * 2 * 60);
  }

  return hue;
}

export default function AudioVisual({sentiments}: {sentiments: sentimentData}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    import("p5").then((p5Mod)=>{
    const p5 = p5Mod.default;

    const particleNum = 500;

    let delta = 0;
    let baseHue: number[] = [];
    let hueRange: number[] = [];
    let baseSat = [100, 100, 100];
    let satRange = 0;
    let scale = 3;
    let noiseScale = 0.002;
    let brightness = 100;

    if(sentiments==null) {
      return
    }

    for (let impact = 0; impact < (sentiments.arousal/2); impact++) {
      baseHue.push(emotionToHSV(sentiments.happy-sentiments.sad+sentiments.angry)+50*impact);
      baseSat.push(100);
    }
    
    let speed = 2;
    const offset = {x:1000, y:1000}
    type particle= {x: number, y: number};
    let particles: particle[][] = Array.from({length: baseHue.length}, () => []);
    

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(900, 800)
        p.strokeWeight(scale)
        p.background(0);
        p.colorMode(p.HSB, 360, 100, 100, 100);

        for (let i = 0; i < particleNum; i++) {
          let x = 0;
          let y = 0;
          for (let numParts = 0; numParts<baseHue.length; numParts++) {
            let prevX = x;
            let prevY = y;
            if (numParts == 0) {
              x = p.random(p.width);
              y = p.random(p.height);
            } else {
              x = prevX + p.random(-10,10)*numParts;
              y = prevY + p.random(-10,10)*numParts;
            }

            particles[numParts].push({ x, y});
            particles[numParts].push({ x, y});

          }
        }

        p.stroke(255);
      };
      
      p.draw = () => {

      p.background(0,0,0,5);
      delta += p.deltaTime / 1000;
      


      for (let numParts = 0; numParts<baseHue.length; numParts++) {
        let prevPar = particles[0][0];
        
        for (let i=0; i<particleNum; i++ ) {
          let par = particles[numParts][i];
          let hue = baseHue[numParts] + (p.noise(par.x + 1000, par.y + 1000, ) - 0.5) * 2 * hueRange;
          let sat = baseSat[numParts] + (p.noise(par.x + 2000, par.y + 2000) - 0.5) * 2 * satRange;

          let n = p.noise(par.x*noiseScale+offset.x*numParts, par.y*noiseScale+offset.y*numParts);
          let a = p.TWO_PI * n;

          par.x += Math.cos(a)*speed;
          par.y += Math.sin(a)*speed;

          p.stroke(hue, sat, brightness, 100)
          p.point(par.x,par.y);

          
          
          let firstPar = particles[0][i];
          if (!onScreen(par)) {
          //first particles
            if (numParts == 0) {
              par.x = p.random(p.width);
              par.y = p.random(p.height);
            } else {
              par.x = firstPar.x + p.random(-10,10)*numParts;
              par.y = firstPar.y + p.random(-10,10)*numParts;
            }
          }
          prevPar = par;
        }
      }

    };

    const onScreen = (v: particle) => {
        return v.x>=0 && v.y <= p.width && v.y >= 0 && v.y<=p.height;
    }

    const updateField = () => {
      p.noiseSeed(p.millis())
    }
    };

    

    const canvas = new p5(sketch, containerRef.current!);
  
  

    // Clean up on unmount
    return () => {
      canvas.remove();
    };});
    
  }, [sentiments]);

  return (
    <div className="border border-gray-400" ref={containerRef}></div>
  );
}