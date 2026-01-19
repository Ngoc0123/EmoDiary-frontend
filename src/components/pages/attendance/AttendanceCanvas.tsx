"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Paintbrush, 
  Eraser, 
  Pipette,
  Layers,
  ChevronUp,
  ChevronDown,
  Share2,
  Download,
  Home,
  Check,
  Undo2,
  Redo2,
  Sparkles,
  Droplets,
  PaintBucket,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAttendanceCanvas, COLORS } from "./useAttendanceCanvas";

const KonvaCanvas = dynamic(
  () => import("./KonvaCanvas").then((mod) => mod.KonvaCanvas),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-slate-400">Loading canvas...</div>
      </div>
    )
  }
);

export function AttendanceCanvas() {
  const {
    stageRef,
    lines,
    brushColor,
    brushSize,
    tool,
    canUndo,
    canRedo,
    isSaving,
    saveMessage,
    isError,
    setTool,
    setBrushColor,
    setBrushSize,
    clearCanvas,
    undo,
    redo,
    saveDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    brushOpacity,
    setBrushOpacity,
    t,
  } = useAttendanceCanvas();

  // A4 paper dimensions (approx 150 DPI for good quality) - Landscape
  const A4_WIDTH = 1754;
  const A4_HEIGHT = 1240;

  const containerRef = useRef<HTMLDivElement>(null);
  // Remove dynamic stage size, use fixed A4
  const [baseScale, setBaseScale] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showZoomControl, setShowZoomControl] = useState(false);
  const [isBottomBarCollapsed, setIsBottomBarCollapsed] = useState(false);
  const [isTopBarCollapsed, setIsTopBarCollapsed] = useState(false);
  // Zoom level: 1 = Fits screen, >1 = Zoom in
  const [canvasZoom, setCanvasZoom] = useState(100);

  // Calculate base scale to fit A4 into container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Add some padding (e.g. 40px total)
        const padding = 40;
        const availableWidth = rect.width - padding;
        const availableHeight = rect.height - padding;
        
        const scaleX = availableWidth / A4_WIDTH;
        const scaleY = availableHeight / A4_HEIGHT;
        
        // Fit entirely visible
        setBaseScale(Math.min(scaleX, scaleY));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isTopBarCollapsed, isBottomBarCollapsed]);

  const currentScale = baseScale * (canvasZoom / 100);

  const handleToolChange = (newTool: 'brush' | 'eraser' | 'fill') => {
    setTool(newTool);
  };
  
  const handleDownload = () => {
    const stage = stageRef.current;
    if (!stage) return;
    
    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    
    try {
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Drawing',
          text: 'Check out my drawing!',
          files: [new File([blob], 'drawing.png', { type: 'image/png' })],
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Image copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const tools = [
    { id: 'brush', icon: Paintbrush, label: t.brush },
    { id: 'fill', icon: PaintBucket, label: t.fill },
    { id: 'eraser', icon: Eraser, label: t.eraser },
    { id: 'picker', icon: Pipette, label: t.picker },
  ];

  return (
    <div className="relative h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar and Header unchanged... */}
      {/* ... */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-16 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-slate-100 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-2">
          {tools.map((toolItem) => {
            const IconComponent = toolItem.icon;
            const isActive = toolItem.id === tool || 
              (toolItem.id === 'picker' && showColorPicker);
            
            return (
              <button
                key={toolItem.id}
                onClick={() => {
                  if (toolItem.id === 'brush' || toolItem.id === 'eraser' || toolItem.id === 'fill') {
                    handleToolChange(toolItem.id as 'brush' | 'eraser' | 'fill');
                  } else if (toolItem.id === 'picker') {
                    setShowColorPicker(!showColorPicker);
                  }
                }}
                className={`
                  w-11 h-11 flex items-center justify-center rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-300/50' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
                title={toolItem.label}
              >
                <IconComponent className="h-5 w-5" />
              </button>
            );
          })}
          
          {/* Zoom Control Button */}
          <button
            onClick={() => setShowZoomControl(!showZoomControl)}
            className={`
              w-11 h-11 flex items-center justify-center rounded-xl
              transition-all duration-200
              ${showZoomControl 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-300/50' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
            title={t.zoom}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-16 flex flex-col relative h-full">
        
        {/* Top Header Bar */}
        <div className="relative z-20 w-full">
          <header 
            className={`
              relative w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm
              transition-all duration-300 ease-in-out
              ${isTopBarCollapsed ? 'h-0 opacity-0 overflow-hidden border-none' : 'h-16 opacity-100'}
            `}
          >
             {/* Header Content... Keep existing... */}
            <div className={`h-full px-6 pr-8 flex items-center justify-between relative ${isTopBarCollapsed ? 'hidden' : ''}`}>
              
              {/* Left Side Buttons */}
              <div className="flex items-center gap-3">
                <Button onClick={saveDrawing} disabled={isSaving} className="h-9 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-md">
                  {isSaving ? t.saving : t.save}
                </Button>
                <Button variant="outline" onClick={clearCanvas} className="h-9 px-4 text-red-600 border-red-200 font-semibold rounded-lg">
                  {t.clear}
                </Button>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={undo} disabled={!canUndo} className={`p-2 rounded-lg ${canUndo ? 'hover:bg-slate-100 text-slate-600' : 'text-slate-300'}`} title={t.undo}> <Undo2 className="h-4 w-4" /> </button>
                  <button onClick={redo} disabled={!canRedo} className={`p-2 rounded-lg ${canRedo ? 'hover:bg-slate-100 text-slate-600' : 'text-slate-300'}`} title={t.redo}> <Redo2 className="h-4 w-4" /> </button>
                </div>
                {saveMessage && (
                  <span className={`text-sm font-medium animate-fade-in ml-2 ${isError ? 'text-red-500' : 'text-emerald-600'}`}>
                    {isError ? '✕ ' : '✓ '} {saveMessage}
                  </span>
                )}
              </div>

              <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-semibold text-slate-700 pointer-events-auto select-none">{t.drawYourFeeling}</span>
              </div>

              {/* Right Side Buttons */}
              <div className="flex items-center gap-2 z-10 w-[140px] justify-end">
                <button onClick={handleShare} className="p-2.5 hover:bg-slate-100 rounded-lg border border-slate-200" title={t.share}> <Share2 className="h-5 w-5 text-slate-600" /> </button>
                <button onClick={handleDownload} className="p-2.5 hover:bg-slate-100 rounded-lg border border-slate-200" title={t.download}> <Download className="h-5 w-5 text-slate-600" /> </button>
                <Link href="/" className="p-2.5 hover:bg-slate-100 rounded-lg border border-slate-200" title={t.backToHome}> <Home className="h-5 w-5 text-slate-600" /> </Link>
              </div>
            </div>
          </header>
        </div>

        {/* Canvas Container - Allow scroll if zoomed */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-auto bg-slate-100 flex items-center justify-center p-8"
        >
          <div 
            className="flex-shrink-0 bg-white shadow-xl shadow-slate-300/50 transition-transform duration-200 ease-out origin-center border border-slate-200"
            style={{ 
              width: A4_WIDTH,
              height: A4_HEIGHT,
              transform: `scale(${currentScale})`,
              // When scaled down, we want it to take less layout space? 
              // Usually transform scale doesn't affect layout flow unless we use 'zoom' (non-standard) or negative margins.
              // But 'origin-center' + flex centering works well if we don't care about extra margins.
              // To avoid scrollbars when zoomed OUT (fitted), we need to ensure the wrapper fits.
              // But overflow-auto on strict fit is fine.
            }}
          >
            <KonvaCanvas
              ref={stageRef}
              width={A4_WIDTH}
              height={A4_HEIGHT}
              lines={lines}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-30">
          
          {/* Bottom Collapse Trigger */}
          {!isBottomBarCollapsed && (
            <div className="absolute bottom-full left-0 right-0 flex justify-end pr-6 pointer-events-none z-10">
               <div 
                 className="pointer-events-auto flex items-start justify-center pt-1 w-24 h-5 bg-white hover:bg-slate-50 border border-slate-200 border-b-0 rounded-t-xl shadow-sm transition-colors group cursor-pointer" 
                 onClick={() => setIsBottomBarCollapsed(true)}
                 title="Collapse toolbar"
               >
                <ChevronDown className="h-3 w-3 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          )}

          {/* Bottom Expand Trigger */}
          {isBottomBarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-end pr-6 pointer-events-none z-10">
               <div 
                 className="pointer-events-auto flex items-end justify-center pb-1 w-24 h-5 bg-white hover:bg-slate-50 border border-slate-200 border-b-0 rounded-t-xl shadow-sm transition-colors group cursor-pointer" 
                 onClick={() => setIsBottomBarCollapsed(false)}
                 title="Show toolbar"
               >
                <ChevronUp className="h-3 w-3 text-slate-500 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          )}

          {/* Bottom Toolbar */}
          <footer 
            className={`
              relative z-20 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-sm
              transition-all duration-300 ease-in-out origin-bottom
              ${isBottomBarCollapsed ? 'h-0 py-0 px-0 opacity-0 overflow-hidden border-none' : 'py-3 px-6 h-auto opacity-100'}
            `}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setShowColorPicker(!showColorPicker)} className="relative h-8 w-8 rounded-full border-2 border-white shadow-lg ring-2 ring-slate-200" style={{ backgroundColor: brushColor }} />
                <div className="h-6 w-6 rounded-full border-2 border-white shadow-md flex items-center justify-center bg-slate-100"> <div className="rounded-full" style={{ width: Math.min(brushSize / 3, 12), height: Math.min(brushSize / 3, 12), backgroundColor: brushColor, opacity: brushOpacity }} /> </div>
              </div>
              
              {/* Brush Size Slider */}
              <div className="flex-[3] flex items-center gap-2">
                <div className="flex-1 relative">
                  <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
                </div>
              </div>
              
              <div className="w-px h-6 bg-slate-200 shrink-0" />
              
              {/* Opacity Slider */}
              <div className="flex-[2] flex items-center gap-2">
                <Droplets className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="flex-1 relative">
                  <input type="range" min="1" max="100" value={brushOpacity * 100} onChange={(e) => setBrushOpacity(parseInt(e.target.value) / 100)} title={t.opacity} className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
                </div>
                <span className="text-xs font-medium text-slate-500 w-10 text-right shrink-0">{Math.round(brushOpacity * 100)}%</span>
              </div>
              
              <div className="flex-1" />
            </div>
          </footer>
        </div>
      </div>

      {/* FIXED Top Bar Toggles */}
      {!isTopBarCollapsed && (
        <div className="fixed top-16 left-16 right-0 flex justify-end pr-6 pointer-events-none z-30 transition-all duration-300">
          <div 
            onClick={() => setIsTopBarCollapsed(true)}
            className="pointer-events-auto flex items-start justify-center pt-1
              w-24 h-5
              bg-white/90 backdrop-blur border border-t-0 border-slate-200
              rounded-b-xl shadow-sm
              hover:bg-slate-50 transition-colors
              cursor-pointer
              group"
            title="Collapse toolbar"
          >
            <ChevronUp className="h-3 w-3 text-slate-400 group-hover:text-slate-600 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </div>
      )}

      {isTopBarCollapsed && (
        <div className="fixed top-0 left-16 right-0 flex justify-end pr-6 pointer-events-none z-30 transition-all duration-300">
          <div 
            onClick={() => setIsTopBarCollapsed(false)}
            className="pointer-events-auto flex items-end justify-center pb-1
              w-24 h-5
              bg-white/90 backdrop-blur border border-t-0 border-slate-200
              rounded-b-xl shadow-sm
              hover:bg-slate-50 transition-colors
              cursor-pointer
              group"
            title="Show toolbar"
          >
            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 group-hover:translate-y-0.5 transition-all" />
          </div>
        </div>
      )}

      {/* Color Picker Popup */}
      {showColorPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
          <div className="fixed left-20 bottom-24 z-50 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in">
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button key={color} onClick={() => { setBrushColor(color); setTool('brush'); setShowColorPicker(false); }} className={`h-10 w-10 rounded-xl transition-all duration-200 hover:scale-110 ${brushColor === color ? 'ring-2 ring-offset-2 ring-amber-500 scale-110' : 'ring-1 ring-slate-200'}`} style={{ backgroundColor: color }}>
                  {brushColor === color && <Check className={`m-auto h-4 w-4 ${color === '#FFFFFF' || color === '#FFEAA7' ? 'text-slate-600' : 'text-white'}`} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Zoom Control Popup */}
      {showZoomControl && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowZoomControl(false)} />
          <div className="fixed left-20 top-1/2 -translate-y-1/2 z-50 p-4 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in w-16 flex flex-col items-center h-64">
             <div className="h-full relative w-full flex justify-center">
                 {/* Vertical slider wrapper */}
                <input 
                  type="range" 
                  min="50" 
                  max="300" 
                  value={canvasZoom} 
                  onChange={(e) => setCanvasZoom(parseInt(e.target.value))} 
                  title={t.zoom} 
                  className="absolute -rotate-90 w-48 h-2 top-1/2 -translate-y-1/2 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" 
                />
             </div>
             <div className="mt-4 text-xs font-medium text-slate-500 text-center">{canvasZoom}%</div>
          </div>
        </>
      )}
    </div>
  );
}
