"use client";

import "./attendance.css";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Pencil,
  PenTool,
  Pipette,
  Eraser,
  PaintBucket,
  Share2,
  Download,
  Home,
  Check,
  Undo2,
  Redo2,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Layers,
} from "lucide-react";
import { useAttendanceCanvas, COLORS } from "./useAttendanceCanvas";

const KonvaCanvas = dynamic(
  () => import("./KonvaCanvas").then((mod) => mod.KonvaCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-slate-400">Loading canvas...</div>
      </div>
    ),
  }
);

// Default palette colors
const PALETTE_COLORS = [
  "#000000", // Black
  "#F97316", // Orange
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#22C55E", // Green
];

export function AttendanceCanvas() {
  const {
    stageRef,
    layers,
    activeLayerId,
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
    brushOpacity,
    setBrushOpacity,
    t,
  } = useAttendanceCanvas();

  // A4 paper dimensions (landscape)
  const A4_WIDTH = 1754;
  const A4_HEIGHT = 1240;

  const containerRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [canvasZoom] = useState(100);
  const [activeToolId, setActiveToolId] = useState("brush");

  // Sync activeToolId when hook auto-switches tool (e.g. picker → brush)
  useEffect(() => {
    if (tool === 'brush' && activeToolId === 'picker') {
      setActiveToolId('brush');
    }
  }, [tool, activeToolId]);

  // Whether the current brush color is a non-default (custom) color
  const isCustomColor = !PALETTE_COLORS.includes(brushColor);

  // Calculate base scale to fit A4 into container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const padding = 60;
        const availableWidth = rect.width - padding;
        const availableHeight = rect.height - padding;

        const scaleX = availableWidth / A4_WIDTH;
        const scaleY = availableHeight / A4_HEIGHT;

        setBaseScale(Math.min(scaleX, scaleY));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const currentScale = baseScale * (canvasZoom / 100);

  const handleToolChange = (toolId: string, newTool: "brush" | "eraser" | "fill" | "picker") => {
    setActiveToolId(toolId);
    setTool(newTool);
  };

  const handleDownload = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
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
          title: "My Drawing",
          text: "Check out my drawing!",
          files: [new File([blob], "drawing.png", { type: "image/png" })],
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Image copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  // Custom cursor generation — circle matching brush size
  const canvasCursor = useMemo(() => {
    if (typeof window === 'undefined') return 'crosshair';
    if (tool === 'picker') return 'crosshair';
    if (tool === 'fill') return 'crosshair';

    const visualSize = Math.max(4, Math.min(brushSize * currentScale, 120));
    const canvasEl = document.createElement('canvas');
    const size = Math.ceil(visualSize) + 4;
    canvasEl.width = size;
    canvasEl.height = size;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return 'crosshair';

    const center = size / 2;
    const radius = visualSize / 2;

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = tool === 'eraser' ? '#888' : brushColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();

    const hotspot = Math.floor(center);
    return `url(${canvasEl.toDataURL()}) ${hotspot} ${hotspot}, crosshair`;
  }, [tool, brushSize, currentScale, brushColor]);

  // Slider percentage for visual fill
  const brushSizePct = ((brushSize - 1) / 49) * 100;
  const opacityPct = brushOpacity * 100;

  // Left sidebar tools
  const sidebarTools = [
    { id: "brush", icon: Pencil, label: t.brush, toolType: "brush" as const },
    { id: "pen", icon: PenTool, label: "Pen", toolType: "brush" as const },
    { id: "fill", icon: PaintBucket, label: t.fill, toolType: "fill" as const },
    { id: "picker", icon: Pipette, label: t.picker, toolType: "picker" as const },
    { id: "eraser", icon: Eraser, label: t.eraser, toolType: "eraser" as const },
  ];

  return (
    <div className="attendance-page">
      {/* ===== TOP BAR ===== */}
      <header className="attendance-topbar">
        <div className="attendance-topbar__left">
          <Link href="/" className="attendance-topbar__home" title={t.backToHome}>
            <Home className="w-8 h-8" />
          </Link>
          <h1
            className="attendance-topbar__title"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            {t.drawYourFeeling}
          </h1>
          {saveMessage && (
            <span className={`attendance-topbar__message ${isError ? "attendance-topbar__message--error" : ""}`}>
              {isError ? "✕ " : "✓ "} {saveMessage}
            </span>
          )}
        </div>
        <div className="attendance-topbar__right">
          {/* Share/Download toggle */}
          <button
            className="attendance-topbar__icon-btn"
            onClick={() => setShowSharePopup(!showSharePopup)}
            title={t.share}
          >
            <Share2 className="w-8 h-8" />
          </button>

          {/* Save */}
          <button
            className="attendance-topbar__icon-btn attendance-topbar__icon-btn--save"
            onClick={saveDrawing}
            disabled={isSaving}
            title={t.save}
          >
            <Save className="w-8 h-8" />
          </button>

          {/* Done */}
          <button
            className="attendance-topbar__icon-btn attendance-topbar__icon-btn--done"
            onClick={saveDrawing}
            disabled={isSaving}
            title={isSaving ? t.saving : "Done"}
          >
            <Check className="w-8 h-8" />
          </button>

          {/* Share popup */}
          {showSharePopup && (
            <>
              <div
                className="attendance-overlay"
                onClick={() => setShowSharePopup(false)}
              />
              <div className="attendance-share-popup">
                <button
                  className="attendance-share-popup__item"
                  onClick={() => {
                    handleShare();
                    setShowSharePopup(false);
                  }}
                >
                  <Share2 className="w-6 h-6" />
                  {t.share}
                </button>
                <button
                  className="attendance-share-popup__item"
                  onClick={() => {
                    handleDownload();
                    setShowSharePopup(false);
                  }}
                >
                  <Download className="w-6 h-6" />
                  {t.download}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="attendance-main">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="attendance-sidebar">
          <div className="attendance-sidebar__tools">
          {sidebarTools.map((toolItem) => {
              const IconComponent = toolItem.icon;
              const isActive = activeToolId === toolItem.id;

              return (
                <button
                  key={toolItem.id}
                  onClick={() => handleToolChange(toolItem.id, toolItem.toolType)}
                  className={`attendance-sidebar__tool ${
                    isActive ? "attendance-sidebar__tool--active" : ""
                  }`}
                  title={toolItem.label}
                >
                  <IconComponent className="w-6 h-6" />
                </button>
              );
            })}
          </div>

          {/* Undo/Redo at bottom */}
          <div className="attendance-sidebar__bottom">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`attendance-sidebar__action ${!canUndo ? "attendance-sidebar__action--disabled" : ""}`}
              title={t.undo}
            >
              <Undo2 className="w-6 h-6" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`attendance-sidebar__action ${!canRedo ? "attendance-sidebar__action--disabled" : ""}`}
              title={t.redo}
            >
              <Redo2 className="w-6 h-6" />
            </button>
          </div>
        </aside>

        {/* ===== CANVAS AREA ===== */}
        <div className="attendance-canvas-area" ref={containerRef}>
          <div
            className="attendance-canvas-wrapper"
            style={{
              width: A4_WIDTH,
              height: A4_HEIGHT,
              transform: `scale(${currentScale})`,
              cursor: canvasCursor,
            }}
          >
            <KonvaCanvas
              ref={stageRef}
              width={A4_WIDTH}
              height={A4_HEIGHT}
              layers={layers}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
        </div>

        {/* ===== RIGHT PANEL (Layers) ===== */}
        <aside className="attendance-layers">
          <div className="attendance-layers__header">
            <Layers className="w-6 h-6" />
            <span>{t.layers}</span>
            <button
              className="attendance-layers__add"
              onClick={addLayer}
              title="Add Layer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="attendance-layers__list">
            {[...layers].reverse().map((layer) => {
              const isActive = layer.id === activeLayerId;
              return (
                <div
                  key={layer.id}
                  className={`attendance-layers__item ${
                    isActive ? "attendance-layers__item--active" : ""
                  }`}
                  onClick={() => setActiveLayerId(layer.id)}
                >
                  <div className="attendance-layers__thumbnail">
                    <div className={layer.items.length > 0 ? "attendance-layers__thumb-content" : "attendance-layers__thumb-bg"} />
                  </div>
                  <div className="attendance-layers__info">
                    <span className="attendance-layers__name">{layer.name}</span>
                    <span className="attendance-layers__subtitle">
                      {isActive ? "Active" : !layer.visible ? "Hidden" : `${layer.items.length} items`}
                    </span>
                  </div>
                  {layers.length > 1 && (
                    <button
                      className="attendance-layers__delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      title="Delete Layer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="attendance-layers__visibility"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                  >
                    {layer.visible ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ===== BOTTOM TOOLBAR ===== */}
      <footer className="attendance-bottombar">
        {/* Color Palette */}
        <div className="attendance-bottombar__colors">
          {PALETTE_COLORS.map((color) => {
            const isActive = brushColor === color;
            return (
              <button
                key={color}
                className={`attendance-bottombar__color-dot ${
                  isActive ? "attendance-bottombar__color-dot--active" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setBrushColor(color);
                  setTool("brush");
                  setActiveToolId("brush");
                }}
              >
                {isActive && (
                  <Check
                    className="w-4 h-4"
                    style={{
                      color:
                        color === "#EAB308" || color === "#22C55E"
                          ? "#1a1a1a"
                          : "#fff",
                    }}
                  />
                )}
              </button>
            );
          })}
          <button
            className={`attendance-bottombar__color-add ${
              isCustomColor ? "attendance-bottombar__color-add--active" : ""
            }`}
            style={
              isCustomColor
                ? { backgroundColor: brushColor, borderStyle: "solid" }
                : {}
            }
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="More colors"
          >
            {isCustomColor ? (
              <Check
                className="w-4 h-4"
                style={{
                  color:
                    brushColor === "#FFFFFF" || brushColor === "#FFEAA7"
                      ? "#1a1a1a"
                      : "#fff",
                }}
              />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="attendance-bottombar__divider" />

        {/* Brush Size */}
        <div className="attendance-bottombar__control">
          <span className="attendance-bottombar__label">{t.brushSize}</span>
          <div className="attendance-bottombar__slider-group">
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="attendance-bottombar__slider"
              style={{ '--slider-pct': `${brushSizePct}%` } as React.CSSProperties}
            />
            <span className="attendance-bottombar__value">{brushSize}px</span>
          </div>
        </div>

        <div className="attendance-bottombar__divider" />

        {/* Opacity */}
        <div className="attendance-bottombar__control">
          <span className="attendance-bottombar__label">{t.opacity}</span>
          <div className="attendance-bottombar__slider-group">
            <input
              type="range"
              min="1"
              max="100"
              value={brushOpacity * 100}
              onChange={(e) => setBrushOpacity(parseInt(e.target.value) / 100)}
              className="attendance-bottombar__slider attendance-bottombar__slider--opacity"
              style={{ '--slider-pct': `${opacityPct}%` } as React.CSSProperties}
            />
            <span className="attendance-bottombar__value">
              {Math.round(brushOpacity * 100)}%
            </span>
          </div>
        </div>
      </footer>

      {/* ===== COLOR PICKER POPUP ===== */}
      {showColorPicker && (
        <>
          <div
            className="attendance-overlay"
            onClick={() => setShowColorPicker(false)}
          />
          <div className="attendance-colorpicker">
            <div className="attendance-colorpicker__grid">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setBrushColor(color);
                    setShowColorPicker(false);
                  }}
                  className={`attendance-colorpicker__swatch ${
                    brushColor === color ? "attendance-colorpicker__swatch--active" : ""
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {brushColor === color && (
                    <Check
                      className="w-4 h-4"
                      style={{
                        color:
                          color === "#FFFFFF" || color === "#FFEAA7"
                            ? "#333"
                            : "#fff",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
