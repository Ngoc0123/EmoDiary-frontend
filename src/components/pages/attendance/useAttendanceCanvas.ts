"use client";

import { useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { saveDrawingApi } from "./attendanceService";
import { translations, type Translations } from "@/lib/translations";
import { toast } from "sonner";
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

// Legacy alias
export type LineData = CanvasItem;

// Layer data model
export interface LayerData {
  id: number;
  name: string;
  visible: boolean;
  items: CanvasItem[];
}

export interface UseAttendanceCanvasReturn {
  stageRef: React.RefObject<Konva.Stage | null>;
  
  // Layer state
  layers: LayerData[];
  activeLayerId: number;
  
  // Drawing state
  isDrawing: boolean;
  brushColor: string;
  brushSize: number;
  tool: 'brush' | 'eraser' | 'fill' | 'picker';
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  isError: boolean;
  brushOpacity: number;
  
  // Drawing actions
  setTool: (tool: 'brush' | 'eraser' | 'fill' | 'picker') => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  saveDrawing: () => Promise<void>;
  
  // Layer actions
  addLayer: () => void;
  deleteLayer: (id: number) => void;
  toggleLayerVisibility: (id: number) => void;
  setActiveLayerId: (id: number) => void;
  
  // Canvas event handlers
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  handleMouseUp: () => void;
  
  t: Translations['attendance'];
}

// Default colors palette
export const COLORS = [
  "#000000", "#FFFFFF", "#FF6B6B", "#4ECDC4",
  "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
  "#FF8C00", "#9B59B6", "#3498DB", "#E74C3C",
];

/** Deep clone layers to prevent reference issues in history */
function cloneLayers(layers: LayerData[]): LayerData[] {
  return layers.map(l => ({ ...l, items: [...l.items] }));
}

const INITIAL_LAYERS: LayerData[] = [
  { id: 1, name: 'Layer 1', visible: true, items: [] },
];

export function useAttendanceCanvas(): UseAttendanceCanvasReturn {
  const stageRef = useRef<Konva.Stage | null>(null);
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const dailyMood = searchParams.get("mood");
  
  // Layer state
  const [layers, setLayers] = useState<LayerData[]>(() => cloneLayers(INITIAL_LAYERS));
  const [activeLayerId, setActiveLayerId] = useState(1);
  const [nextLayerId, setNextLayerId] = useState(2);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'fill' | 'picker'>('brush');
  
  // History for undo/redo (stores snapshots of all layers)
  const [history, setHistory] = useState<LayerData[][]>([cloneLayers(INITIAL_LAYERS)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const t = language === 'vi' ? translations.vi.attendance : translations.en.attendance;

  // Save current layers state to history
  const saveToHistory = useCallback((newLayers: LayerData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cloneLayers(newLayers));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // ===== LAYER MANAGEMENT =====
  
  const addLayer = useCallback(() => {
    const newId = nextLayerId;
    const newLayer: LayerData = {
      id: newId,
      name: `Layer ${newId}`,
      visible: true,
      items: [],
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setActiveLayerId(newId);
    setNextLayerId(prev => prev + 1);
    saveToHistory(newLayers);
  }, [nextLayerId, layers, saveToHistory]);

  const deleteLayer = useCallback((id: number) => {
    if (layers.length <= 1) return; // Can't delete the last layer
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayerId === id) {
      setActiveLayerId(newLayers[newLayers.length - 1].id);
    }
    saveToHistory(newLayers);
  }, [layers, activeLayerId, saveToHistory]);

  const toggleLayerVisibility = useCallback((id: number) => {
    setLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  }, []);

  // ===== MOUSE HANDLERS =====

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!stage || !pos) return;

    // Color picker (eyedropper) tool
    if (tool === 'picker') {
      try {
        const canvas = stage.toCanvas({ pixelRatio: 1 });
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const pixel = ctx.getImageData(Math.floor(pos.x), Math.floor(pos.y), 1, 1).data;
          const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`.toUpperCase();
          setBrushColor(hex);
          setTool('brush');
        }
      } catch (err) {
        console.error("Color pick failed", err);
      }
      return;
    }

    // Fill tool
    if (tool === 'fill') {
      try {
        const canvas = stage.toCanvas({ pixelRatio: 1 });
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const filledDataUrl = floodFill(ctx, pos.x, pos.y, brushColor);
          if (filledDataUrl) {
            const newFill: CanvasItem = {
              type: 'fill',
              image: filledDataUrl,
              x: 0, y: 0,
              opacity: brushOpacity,
            };
            // Add fill to active layer
            const newLayers = layers.map(layer =>
              layer.id === activeLayerId
                ? { ...layer, items: [...layer.items, newFill] }
                : layer
            );
            setLayers(newLayers);
            saveToHistory(newLayers);
          }
        }
      } catch (err) {
        console.error("Fill failed", err);
      }
      return;
    }

    // Brush / Eraser tool
    setIsDrawing(true);
    const newLine: CanvasItem = {
      type: 'line',
      tool: tool as 'brush' | 'eraser',
      points: [pos.x, pos.y],
      strokeColor: tool === 'eraser' ? '#FFFFFF' : brushColor,
      strokeWidth: brushSize,
      opacity: brushOpacity,
    };
    // Add new line to the active layer
    setLayers(layers.map(layer =>
      layer.id === activeLayerId
        ? { ...layer, items: [...layer.items, newLine] }
        : layer
    ));
  }, [tool, brushColor, brushSize, brushOpacity, layers, activeLayerId, saveToHistory]);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    // Update the last item in the active layer using functional updater
    // to avoid stale closure on rapid mouse moves
    setLayers(prev => prev.map(layer => {
      if (layer.id !== activeLayerId || layer.items.length === 0) return layer;
      const lastItem = layer.items[layer.items.length - 1];
      if (lastItem.type !== 'line') return layer;
      
      return {
        ...layer,
        items: [
          ...layer.items.slice(0, -1),
          { ...lastItem, points: [...lastItem.points, pos.x, pos.y] },
        ],
      };
    }));
  }, [isDrawing, activeLayerId]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory(layers);
    }
  }, [isDrawing, layers, saveToHistory]);

  // ===== CANVAS ACTIONS =====

  // Clear active layer only
  const clearCanvas = useCallback(() => {
    const newLayers = layers.map(layer =>
      layer.id === activeLayerId ? { ...layer, items: [] } : layer
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
  }, [layers, activeLayerId, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const restored = cloneLayers(history[newIndex]);
      setLayers(restored);
      // If the active layer was deleted via undo, select the last available
      if (!restored.find(l => l.id === activeLayerId)) {
        setActiveLayerId(restored[restored.length - 1].id);
      }
    }
  }, [history, historyIndex, activeLayerId]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const restored = cloneLayers(history[newIndex]);
      setLayers(restored);
      if (!restored.find(l => l.id === activeLayerId)) {
        setActiveLayerId(restored[restored.length - 1].id);
      }
    }
  }, [history, historyIndex, activeLayerId]);

  const saveDrawing = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;

    setIsSaving(true);
    setSaveMessage(null);
    setIsError(false);

    try {
      await saveDrawingApi({
        drawing_data: { layers },
        daily_mood: dailyMood ?? undefined,
      });
      toast.success(t.saved, {
        duration: 2000,
        onAutoClose: () => {
          window.location.href = '/';
        },
        onDismiss: () => {
          window.location.href = '/';
        },
      });
    } catch (error) {
      console.error("Failed to save drawing:", error);
      setIsError(true);
      toast.error(t.errorSave, { duration: 4000 });
    } finally {
      setIsSaving(false);
    }
  }, [layers, dailyMood, t.saved, t.errorSave]);

  return {
    stageRef,
    layers,
    activeLayerId,
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
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    setActiveLayerId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    t,
  };
}
