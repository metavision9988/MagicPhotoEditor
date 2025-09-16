// Core Types for Magic Photo Editor

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: BoundingBox;
  mask?: ImageData;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditOperation {
  id: string;
  type: EditType;
  timestamp: number;
  parameters: EditParameters;
  preview?: string;
}

export type EditType = 
  | 'objectRemoval'
  | 'backgroundReplacement'
  | 'objectReplacement'
  | 'colorCorrection'
  | 'qualityEnhancement'
  | 'crop'
  | 'resize';

export interface EditParameters {
  targetObjectId?: string;
  replacementImage?: string;
  backgroundColor?: string;
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
  cropArea?: BoundingBox;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  currentOperation?: string | undefined;
  error?: string | undefined;
}

export interface ImageData {
  originalImage: HTMLImageElement;
  processedImage?: HTMLCanvasElement;
  detectedObjects: DetectedObject[];
  editHistory: EditOperation[];
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
    lastModified: Date;
  };
}

export interface AppState {
  currentImage: ImageData | null;
  processingStatus: ProcessingStatus;
  selectedObjects: string[];
  undoHistory: EditOperation[];
  redoHistory: EditOperation[];
}

export interface MediaPipeConfig {
  modelAssetPath: string;
  runningMode: 'IMAGE' | 'VIDEO';
  delegate: 'CPU' | 'GPU';
}