"use client";

import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { saveDrawingApi } from "./attendanceService";
import { translations, type Translations } from "@/lib/translations";
import Konva from "konva";
import { floodFill } from "./floodFill";

export type CanvasItem = 
| {
    type: 'line';
    tool: 'brush' | 'eraser';
    points: number[];
    strokeColor: string;
    strokeWidth: number;
    opacity?: number;
  }
| {
    type: 'fill';
    image: string; // dataURL
    x: number;
    y: number;
    opacity?: number;
  };

// Legacy naming for compatibility, or alias
export type LineData = CanvasItem;

export interface UseAttendanceCanvasReturn {
  // Refs
  stageRef: React.RefObject<Konva.Stage | null>;
  
  // State
  lines: CanvasItem[];
  isDrawing: boolean;
  brushColor: string;
  brushSize: number;
  tool: 'brush' | 'eraser' | 'fill';
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  isError: boolean;
  brushOpacity: number;
  
  // Actions
  setTool: (tool: 'brush' | 'eraser' | 'fill') => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  saveDrawing: () => Promise<void>;
  
  // Canvas event handlers
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  handleMouseUp: () => void;
  
  // Translations
  t: Translations['attendance'];
}

// Default colors palette
export const COLORS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#FF8C00", // Orange
  "#9B59B6", // Purple
  "#3498DB", // Sky Blue
  "#E74C3C", // Crimson
];

export function useAttendanceCanvas(): UseAttendanceCanvasReturn {
  const stageRef = useRef<Konva.Stage | null>(null);
  const { language } = useLanguage();
  
  // Drawing state
  const [lines, setLines] = useState<CanvasItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'fill'>('brush');
  
  // History for undo/redo
  const [history, setHistory] = useState<CanvasItem[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Translations
  const t = language === 'vi' ? translations.vi.attendance : translations.en.attendance;

  // Save current state to history
  const saveToHistory = useCallback((newLines: CanvasItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newLines);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();

    if (!stage || !pos) return;

    if (tool === 'fill') {
      try {
        // Create a temporary canvas at 1x pixel ratio for processing
        // Use toCanvas to get current state. Note: toCanvas is synchronous.
        const canvas = stage.toCanvas({ pixelRatio: 1 });
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const filledDataUrl = floodFill(ctx, pos.x, pos.y, brushColor);
          if (filledDataUrl) {
             const newFill: CanvasItem = {
               type: 'fill',
               image: filledDataUrl,
               x: 0,
               y: 0,
               opacity: brushOpacity,
             };
             const newLines = [...lines, newFill];
             setLines(newLines);
             saveToHistory(newLines);
          }
        }
      } catch (err) {
        console.error("Fill failed", err);
      }
      return;
    }

    setIsDrawing(true);
    
    // Line drawing logic
    const newLine: CanvasItem = {
      type: 'line',
      tool: tool as 'brush' | 'eraser', // safe cast
      points: [pos.x, pos.y],
      strokeColor: tool === 'eraser' ? '#FFFFFF' : brushColor,
      strokeWidth: brushSize,
      opacity: brushOpacity,
    };
    setLines([...lines, newLine]);
  }, [tool, brushColor, brushSize, brushOpacity, lines, saveToHistory]);

  // Handle mouse/touch move
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    
    if (pos && lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      
      // Ensure we are modifying a line
      if (lastLine.type !== 'line') return;
      
      const newPoints = [...lastLine.points, pos.x, pos.y];
      
      const updatedLines = lines.slice(0, -1);
      updatedLines.push({
        ...lastLine,
        points: newPoints,
      });
      
      setLines(updatedLines);
    }
  }, [isDrawing, lines]);

  // Handle mouse/touch up
  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory(lines);
    }
  }, [isDrawing, lines, saveToHistory]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setLines([]);
    saveToHistory([]);
  }, [saveToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLines(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLines(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Save drawing
  const saveDrawing = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;

    setIsSaving(true);
    setSaveMessage(null);
    setIsError(false);

    try {
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });
      await saveDrawingApi({
        imageData: dataUrl,
        timestamp: new Date(),
      });
      
      setSaveMessage(t.saved);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save drawing:", error);
      setIsError(true);
      setSaveMessage(t.errorSave);
      setTimeout(() => {
        setSaveMessage(null);
        setIsError(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  }, [t.saved, t.errorSave]);

  return {
    stageRef,
    lines,
    isDrawing,
    brushColor,
    brushSize,
    brushOpacity,
    tool,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isSaving,
    saveMessage,
    isError,
    setTool,
    setBrushColor,
    setBrushSize,
    setBrushOpacity,
    clearCanvas,
    undo,
    redo,
    saveDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    t,
  };
}
