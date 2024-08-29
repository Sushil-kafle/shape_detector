import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const sendCanvasImageData = async () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      console.log(imageData);

      const canvasDataURL = canvas.toDataURL("image/png");
      const base64ImageData = canvasDataURL.split(",")[1];

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageData: base64ImageData }),
        });
        const res = await response.json();
        console.log(res);
      } catch (error) {
        console.error("Error uploading image data:", error);
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.stroke();
    }
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasDrawn) {
      sendCanvasImageData();
      setHasDrawn(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center space-y-4 p-4">
      <div className="flex space-x-4 mb-4 items-end gap-3">
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-8"
          />
        </div>
        <div>
          <Label htmlFor="brushSize">Brush Size</Label>
          <Input
            type="number"
            id="brushSize"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            min="1"
            max="50"
            className="w-16"
          />
        </div>
        <Button onClick={clearCanvas}>Clear Canvas</Button>
      </div>
      <div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="border border-gray-300"
        />
      </div>
    </div>
  );
}
