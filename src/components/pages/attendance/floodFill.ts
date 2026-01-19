
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance: number = 30
): string | null {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Parse fill color
  const fillRgb = hexToRgb(fillColorHex);
  if (!fillRgb) return null;
  
  // Get start position index
  const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
  
  // Get start color
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];
  
  // If start color is same as fill color, return
  if (
    Math.abs(startR - fillRgb.r) < tolerance &&
    Math.abs(startG - fillRgb.g) < tolerance &&
    Math.abs(startB - fillRgb.b) < tolerance &&
    startA > 128
  ) {
     // Already somewhat filled or close color?
     // Actually strict equality check is usually safer for start condition to avoid infinite loop if tolerance is high
     // But for anti-aliasing we compare difference.
  }
  
  // Create output buffer (transparent)
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const outputCtx = outputCanvas.getContext('2d');
  if (!outputCtx) return null;
  
  const outputImageData = outputCtx.createImageData(width, height);
  const outputData = outputImageData.data;
  
  const queue = [[Math.floor(startX), Math.floor(startY)]];
  const visited = new Set<string>();
  
  // Helper to check color match
  const matchColor = (pos: number) => {
    const r = data[pos];
    const g = data[pos + 1];
    const b = data[pos + 2];
    const a = data[pos + 3];
    
    // Treat transparent boundaries as walls? Or fill transparent areas?
    // "Paint a whole closed section".
    // Usually we fill white area bounded by black lines.
    // So we match start color.
    
    return (
      Math.abs(r - startR) <= tolerance &&
      Math.abs(g - startG) <= tolerance &&
      Math.abs(b - startB) <= tolerance &&
      Math.abs(a - startA) <= tolerance
    );
  };
  
  // 1D array for visited to be faster?
  // width*height size
  const visitedArr = new Uint8Array(width * height);
  
  while (queue.length > 0) {
    const [x, y] = queue.pop()!;
    const idx = y * width + x;
    
    if (visitedArr[idx]) continue;
    visitedArr[idx] = 1;
    
    const pos = idx * 4;
    
    // Set color in output
    outputData[pos] = fillRgb.r;
    outputData[pos + 1] = fillRgb.g;
    outputData[pos + 2] = fillRgb.b;
    outputData[pos + 3] = 255; // Full alpha for the fill shape itself (opacity applied by Konva)
    
    // Check neighbors
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];
    
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visitedArr[nIdx]) {
            const nPos = nIdx * 4;
            if (matchColor(nPos)) {
                queue.push([nx, ny]);
            }
        }
      }
    }
  }
  
  outputCtx.putImageData(outputImageData, 0, 0);
  return outputCanvas.toDataURL();
}
