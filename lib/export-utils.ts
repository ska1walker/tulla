import { toPng } from 'html-to-image';

const EXPORT_WIDTH = 1920;
const EXPORT_HEIGHT = 1080;

export async function exportToPng(
  element: HTMLElement,
  filename: string,
  whitespace: number
): Promise<void> {
  const padding = (whitespace / 100) * EXPORT_WIDTH;

  const dataUrl = await toPng(element, {
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    backgroundColor: '#ffffff',
    style: {
      padding: `${padding}px`,
      boxSizing: 'border-box',
    },
    pixelRatio: 1,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function generateExportFilename(target: 'timeline' | 'analytics'): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  return `maiflow-${target}-${timestamp}.png`;
}
