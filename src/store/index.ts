import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, ImageData, ProcessingStatus, EditOperation, DetectedObject } from '@/types';

interface AppStore extends AppState {
  // Actions
  setCurrentImage: (image: ImageData | null) => void;
  updateProcessingStatus: (status: Partial<ProcessingStatus>) => void;
  toggleObjectSelection: (objectId: string) => void;
  clearObjectSelection: () => void;
  addEditOperation: (operation: EditOperation) => void;
  undo: () => void;
  redo: () => void;
  updateDetectedObjects: (objects: DetectedObject[]) => void;
  resetApp: () => void;
}

const initialState: AppState = {
  currentImage: null,
  processingStatus: {
    isProcessing: false,
    progress: 0,
    currentOperation: undefined,
    error: undefined,
  } satisfies ProcessingStatus,
  selectedObjects: [],
  undoHistory: [],
  redoHistory: [],
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentImage: (image) => {
        set(
          {
            currentImage: image,
            selectedObjects: [],
            undoHistory: [],
            redoHistory: [],
            processingStatus: {
              isProcessing: false,
              progress: 0,
              currentOperation: undefined,
              error: undefined,
            } satisfies ProcessingStatus,
          },
          false,
          'setCurrentImage'
        );
      },

      updateProcessingStatus: (status) => {
        set(
          (state) => ({
            processingStatus: { ...state.processingStatus, ...status },
          }),
          false,
          'updateProcessingStatus'
        );
      },

      toggleObjectSelection: (objectId) => {
        set(
          (state) => ({
            selectedObjects: state.selectedObjects.includes(objectId)
              ? state.selectedObjects.filter((id) => id !== objectId)
              : [...state.selectedObjects, objectId],
          }),
          false,
          'toggleObjectSelection'
        );
      },

      clearObjectSelection: () => {
        set({ selectedObjects: [] }, false, 'clearObjectSelection');
      },

      addEditOperation: (operation) => {
        set(
          (state) => ({
            undoHistory: [...state.undoHistory, operation],
            redoHistory: [], // Clear redo history when new operation is added
          }),
          false,
          'addEditOperation'
        );
      },

      undo: () => {
        const { undoHistory, redoHistory } = get();
        if (undoHistory.length === 0) return;

        const lastOperation = undoHistory[undoHistory.length - 1];
        if (!lastOperation) return;

        set({
          undoHistory: undoHistory.slice(0, -1),
          redoHistory: [...redoHistory, lastOperation],
        }, false, 'undo');
      },

      redo: () => {
        const { undoHistory, redoHistory } = get();
        if (redoHistory.length === 0) return;

        const operationToRedo = redoHistory[redoHistory.length - 1];
        if (!operationToRedo) return;

        set({
          undoHistory: [...undoHistory, operationToRedo],
          redoHistory: redoHistory.slice(0, -1),
        }, false, 'redo');
      },

      updateDetectedObjects: (objects) => {
        set(
          (state) => ({
            currentImage: state.currentImage
              ? { ...state.currentImage, detectedObjects: objects }
              : null,
          }),
          false,
          'updateDetectedObjects'
        );
      },

      resetApp: () => {
        set(initialState, false, 'resetApp');
      },
    }),
    {
      name: 'magic-photo-editor-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);