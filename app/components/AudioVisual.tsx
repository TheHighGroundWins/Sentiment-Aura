"use client";
import React, { useEffect, useRef } from "react";
import p5 from "p5";

export default function AudioVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    import("p5").then((p5Mod)=>{
      const p5 = p5Mod.default;
    

    const sketch = (p: p5) => {
      p.setup = () => p.createCanvas(600, 400, p.WEBGL);
      p.draw = () => {
        p.background(250);
        p.normalMaterial();
        p.push();
        p.rotateZ(p.frameCount * 0.01);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);
        p.plane(100);
        p.pop();
      };
    };

    const canvas = new p5(sketch, containerRef.current!);

    // Clean up on unmount
    return () => {
      canvas.remove();
    };});
  }, []);

  return (
    <div className="w-[600px] h-[400px] border border-gray-400" ref={containerRef}></div>
  );
}