"use client";

import { Stage, Layer, Line, Rect, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { forwardRef, useEffect, useState } from "react";
import type { LayerData } from "./useAttendanceCanvas";

interface KonvaCanvasProps {
  width: number;
  height: number;
  layers: LayerData[];
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMouseUp: () => void;
}

// Helper hook to load image from data URL
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
  function KonvaCanvas({ width, height, layers, onMouseDown, onMouseMove, onMouseUp }, ref) {
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
        style={{ cursor: 'inherit' }}
      >
        {/* Background layer — always visible white canvas */}
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="#FFFFFF" />
        </Layer>
        
        {/* User layers — rendered in order, Konva handles visibility */}
        {layers.map((layer) => (
          <Layer key={layer.id} visible={layer.visible}>
            {layer.items.map((item, i) => {
              if (item.type === 'fill') {
                return (
                  <URLImage
                    key={`${layer.id}-fill-${i}`}
                    src={item.image}
                    x={item.x}
                    y={item.y}
                    opacity={item.opacity}
                  />
                );
              }

              if (item.type === 'line') {
                return (
                  <Line
                    key={`${layer.id}-line-${i}`}
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
        ))}
      </Stage>
    );
  }
);
