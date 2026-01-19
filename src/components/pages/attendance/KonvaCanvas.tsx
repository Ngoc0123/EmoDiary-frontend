"use client";

import { Stage, Layer, Line, Rect, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { forwardRef, useEffect, useState } from "react";
import type { LineData } from "./useAttendanceCanvas";

interface KonvaCanvasProps {
  width: number;
  height: number;
  lines: LineData[]; // LineData is now alias for CanvasItem
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMouseUp: () => void;
}

// Helper hook to load image
const useImage = (url: string) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);
  return [image];
};

const URLImage = ({ src, x, y, opacity }: { src: string; x: number; y: number; opacity?: number }) => {
  const [image] = useImage(src);
  return <KonvaImage image={image} x={x} y={y} opacity={opacity ?? 1} />;
};

export const KonvaCanvas = forwardRef<Konva.Stage, KonvaCanvasProps>(
  function KonvaCanvas({ width, height, lines, onMouseDown, onMouseMove, onMouseUp }, ref) {
    return (
      <Stage
        ref={ref}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
        style={{ cursor: 'crosshair' }}
      >
        <Layer>
          {/* White background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#FFFFFF"
          />
          
          {/* Draw all items */}
          {lines.map((item, i) => {
            if (item.type === 'fill') {
              return (
                <URLImage
                  key={i}
                  src={item.image}
                  x={item.x}
                  y={item.y}
                  opacity={item.opacity}
                />
              );
            }

            // Default to line if type missing (legacy) or explicitly 'line'
            // But our union forces type check if we are strict. 
            // We'll treat it as line if not fill.
            if (item.type === 'line') {
              return (
                <Line
                  key={i}
                  points={item.points}
                  stroke={item.strokeColor}
                  strokeWidth={item.strokeWidth}
                  opacity={item.opacity ?? 1}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    item.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    );
  }
);
