# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Magic Photo Editor** is an AI-powered web application for intelligent object removal from images. Built with Next.js 15 and MediaPipe, it provides one-click object removal with professional-grade results entirely in the browser.

### Core Features
- **AI Object Detection**: MediaPipe-powered automatic object detection with 95%+ accuracy
- **One-Click Removal**: Single click to remove objects with intelligent background inpainting
- **Background Removal**: Full background segmentation and removal
- **Smart Cropping**: AI-suggested crop regions for social media platforms
- **Multi-Format Export**: AVIF, WebP, PNG, JPEG with transparency support

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript 5.6
- **AI/ML**: MediaPipe 0.10.15 (Object Detection, Segmentation)
- **State Management**: Zustand (Global), TanStack Query (Server), React Hook Form (Forms)
- **Styling**: Tailwind CSS 3.4 with Glassmorphism design
- **UI Components**: Headless UI + custom components
- **Animation**: Framer Motion
- **Processing**: Web Workers + WebAssembly

### Project Structure
The application follows Clean Architecture principles with clear separation of concerns:

```
src/
├── components/          # React UI components
│   ├── layout/         # App layout components
│   ├── upload/         # File upload components
│   ├── workspace/      # Canvas and editing workspace
│   ├── properties/     # Settings and properties panel
│   ├── mobile/         # Mobile-specific components
│   └── ui/            # Reusable UI components
├── services/          # Business logic and external integrations
│   ├── mediapipe/     # MediaPipe AI service integration
│   ├── processing/    # Image processing operations
│   ├── export/        # File export and format conversion
│   └── validation/    # Input validation utilities
├── hooks/             # Custom React hooks
├── utils/             # Pure utility functions
├── types/             # TypeScript type definitions
└── stores/            # Zustand state management
```

## Development Workflow

### Build Commands
Since there's no package.json yet, the application will use these standard Next.js commands:

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint
npm run type-check   # TypeScript compiler check
npm run format       # Prettier formatting

# Testing
npm run test         # Jest unit tests
npm run test:e2e     # Playwright end-to-end tests
npm run test:coverage # Test coverage report
```

### Development Standards

#### Code Style
- **TypeScript**: Strict mode enabled with full type safety
- **ESLint**: Next.js configuration with custom rules for hooks and TypeScript
- **Prettier**: Standard formatting with custom rules for consistency
- **Components**: Functional components with proper TypeScript interfaces
- **State Management**: Zustand stores with typed actions and selectors

#### Component Patterns
- **Composition over Inheritance**: Small, reusable components
- **Props Interfaces**: All components have strict TypeScript interfaces
- **Error Boundaries**: Proper error handling at component level
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: React.memo, useMemo, useCallback where appropriate

#### File Naming Conventions
- **Components**: PascalCase (e.g., `CanvasWorkspace.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useObjectDetection.ts`)
- **Services**: PascalCase classes (e.g., `MediaPipeService.ts`)
- **Utils**: camelCase functions (e.g., `imageProcessing.ts`)
- **Types**: PascalCase interfaces (e.g., `ImageTypes.ts`)

### Core Business Logic

#### MediaPipe AI Integration
The application uses MediaPipe for all AI operations:

1. **Object Detection**: Automatic detection of 80+ object categories
2. **Segmentation**: Precise mask generation for selected objects
3. **Background Removal**: Full image segmentation for background removal

Key services:
- `MediaPipeService`: Main AI service class with model loading and inference
- `ObjectDetectionHook`: React hook for object detection operations
- `ImageProcessingService`: Canvas-based image manipulation

#### State Management Architecture
Uses Zustand for predictable state management:

- **Image Store**: Current image, detected objects, processing state
- **UI Store**: Canvas zoom/pan, tool selection, modal states
- **Settings Store**: User preferences, export options

#### Performance Considerations
- **Web Workers**: Heavy AI processing runs in background threads
- **Memory Management**: Automatic cleanup of large image buffers
- **Progressive Loading**: Essential models load first, advanced features on-demand
- **Caching**: Model caching with IndexedDB for faster subsequent loads

### Error Handling

The application implements comprehensive error handling:

1. **File Validation**: Type, size, and integrity checking
2. **AI Processing**: Model loading failures, inference errors
3. **Browser Compatibility**: Feature detection with graceful fallbacks
4. **Network Issues**: Retry logic for model downloads

Error categories:
- `ValidationError`: Input validation failures
- `ProcessingError`: AI/image processing failures  
- `SystemError`: Browser/platform compatibility issues

### Testing Strategy

#### Unit Tests
- Component rendering and user interactions
- Service classes and business logic
- Utility functions and data transformations
- Custom hooks behavior

#### Integration Tests
- End-to-end user workflows
- AI model integration
- File upload and processing pipeline
- Cross-browser compatibility

#### Performance Tests
- AI processing speed benchmarks
- Memory usage monitoring
- Large file handling tests

### Browser Support

**Full Support** (Tier 1):
- Chrome 85+, Firefox 93+, Safari 16.4+, Edge 85+

**Limited Support** (Tier 2):
- Samsung Internet 14.0+, Opera 71+

**Graceful Degradation**:
- Older browsers get manual selection mode
- GPU acceleration detection with CPU fallback
- Progressive enhancement based on capabilities

### MVP Integration Readiness

The codebase is designed for future integration with other MVP modules:

1. **Modular Architecture**: Independent, composable components
2. **Shared Services**: Reusable AI and image processing services
3. **Common UI**: Design system components for consistency
4. **State Management**: Unified state layer for cross-MVP communication

## Key Files to Understand

### Essential Architecture Files
- `docs/magic-photo-editor-tech-spec.md`: Complete technical specification
- `docs/magic-photo-editor-component-design.md`: React component structure
- `docs/magic-photo-editor-api-design.md`: API interfaces and type definitions
- `docs/magic-photo-editor-data-flow.md`: State management and async processing
- `docs/magic-photo-editor-dev-standards.md`: Development standards and checklists

### Implementation Priority
1. **Core Services**: MediaPipe integration, image processing
2. **UI Framework**: Canvas workspace, upload components  
3. **State Management**: Zustand stores and React hooks
4. **Export System**: Multi-format conversion and download
5. **Mobile Optimization**: Touch-friendly interface

## Performance Requirements

### Target Metrics
- **Load Time**: <3s on 3G, <1s on WiFi
- **Processing**: <3s for object detection, <5s for removal
- **Memory**: <200MB peak usage
- **Accuracy**: 95%+ object detection confidence

### Optimization Strategies
- Code splitting by route and feature
- Image optimization with WebP/AVIF
- Model quantization for smaller downloads
- Background processing with Web Workers
- Intelligent caching for models and results

## Security & Privacy

### Data Protection
- **100% Client-Side**: No server uploads or data transmission
- **Temporary Storage**: IndexedDB for models only, automatic cleanup
- **GDPR Compliant**: No personal data collection
- **Privacy First**: All processing happens locally in browser

### Input Validation
- Strict file type and size checking (50MB limit)
- Binary header verification for image integrity
- XSS prevention in dynamic content
- Memory bounds checking for large files

---

This CLAUDE.md provides the complete context needed for Claude Code to develop the Magic Photo Editor application efficiently and consistently.