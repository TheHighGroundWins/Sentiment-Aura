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

function emotionToHSV(happy: number, sad: number, angry: number, min=0,max=10) {
  //normalize emotion ranges
  const h = (happy - min) / (max - min);
  const s = (sad - min) / (max - min);
  const a = (angry - min) / (max - min);
  const happyB = 60;
  const sadB = 180;
  const angryB = 270;
  const happyScale = 60;
  const angryScale = 90;
  
  //get the total to be compared against
  const total = h + s + a;
  
  if (total === 0) return 180;
  
  //scale to HSV values
  const happyHue = happyB + (h * happyScale);
  const sadHue = sadB + (s * happyScale);
  const angryHue = angryB + (a * angryScale);
  
  //calculate relative weights
  const happyWeight = h / total;
  const sadWeight = s / total;
  const angryWeight = a / total;
  
  //get final hue
  let hue = (happyHue * happyWeight) + 
            (sadHue * sadWeight) + 
            (angryHue * angryWeight);
  
  //if over limit set to red.
  if (angryWeight > 0.5 && hue > 300) {
    hue = hue % 360;
  }
  
  return Math.round(hue);
}

export default function AudioVisual({sentiments}: {sentiments: sentimentData}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const sentimentRef = useRef(sentiments);

  useEffect(() => {
    sentimentRef.current = sentiments;
  }, [sentiments]);
  
  useEffect(() => {
    if (p5Instance.current || !containerRef.current) return;

    const particleNum = 500;

    let delta = 0;
    let baseHue: number[] = [];
    let hueRange = 10;
    let baseSat: number[] = [];
    let satRange = 10;
    let scale = 3;
    let noiseScale = 0.002;
    let brightness = 100;
    const colorRange = 30;
    const valenceScale = 30;
    const arousalScale = 10;

    if(sentiments == null)
      return;
    hueRange = sentiments.arousal;


    for (let impact = 0; impact < (sentiments.surprised/2); impact++) {
      baseHue.push(emotionToHSV(sentiments.happy,sentiments.sad,sentiments.angry)+colorRange*impact);
      const arousal = sentiments.arousal*arousalScale - sentiments.valence *valenceScale;
      baseSat.push(arousal);
    }
    
    let speed = sentiments.arousal/2;
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

    p5Instance.current = new p5(sketch, containerRef.current);
  

    // Clean up on unmount
    return () => {
      p5Instance.current?.remove();
      p5Instance.current= null
    };
  },[]);
    

  return (
    <div className="border border-gray-400" ref={containerRef}></div>
  );
}