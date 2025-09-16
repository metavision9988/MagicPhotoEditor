# ✨ Magic Photo Editor

AI-powered web application for intelligent object removal from images. Built with Next.js 15 and MediaPipe for professional-grade results entirely in the browser.

## 🎯 Key Features

- **🤖 AI Object Detection**: MediaPipe-powered automatic object detection with 95%+ accuracy
- **✨ One-Click Removal**: Single click to remove objects with intelligent background inpainting
- **🖼️ Background Removal**: Full background segmentation and removal
- **📱 Smart Cropping**: AI-suggested crop regions for social media platforms
- **📤 Multi-Format Export**: AVIF, WebP, PNG, JPEG with transparency support
- **🔒 Privacy First**: 100% client-side processing - no data ever leaves your browser

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript 5.6
- **AI/ML**: MediaPipe 0.10.15 (Object Detection, Segmentation)
- **State Management**: Zustand (Global), TanStack Query (Server), React Hook Form (Forms)
- **Styling**: Tailwind CSS 3.4 with Glassmorphism design
- **UI Components**: Headless UI + custom components
- **Animation**: Framer Motion
- **Processing**: Web Workers + WebAssembly

## 🏗️ Architecture

Built on Clean Architecture principles with clear separation of concerns:

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0+
- npm 9.0+ or yarn 1.22+
- Modern browser with WebAssembly support

### Installation

```bash
# Clone the repository
git clone https://github.com/metavision9988/MagicPhotoEditor.git
cd MagicPhotoEditor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Development Commands

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

## 🎨 Design System

The application features a modern Glassmorphism design with:

- **Glass Surface Effects**: Translucent backgrounds with backdrop blur
- **Bento Box Layout**: Card-based modular interface design
- **Dark/Light Theme**: Automatic theme detection with manual override
- **Responsive Design**: Mobile-first approach with touch-optimized interfaces
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

## ⚡ Performance

### Target Metrics
- **Load Time**: <3s on 3G, <1s on WiFi
- **Processing**: <3s for object detection, <5s for removal
- **Memory**: <200MB peak usage
- **Accuracy**: 95%+ object detection confidence

### Optimization Features
- Code splitting by route and feature
- Image optimization with WebP/AVIF
- Model quantization for smaller downloads
- Background processing with Web Workers
- Intelligent caching for models and results

## 🌐 Browser Support

**Full Support** (Tier 1):
- Chrome 85+, Firefox 93+, Safari 16.4+, Edge 85+

**Limited Support** (Tier 2):
- Samsung Internet 14.0+, Opera 71+

**Graceful Degradation**:
- Older browsers get manual selection mode
- GPU acceleration detection with CPU fallback
- Progressive enhancement based on capabilities

## 🔒 Privacy & Security

### Data Protection
- **100% Client-Side**: No server uploads or data transmission
- **Temporary Storage**: IndexedDB for models only, automatic cleanup
- **GDPR Compliant**: No personal data collection
- **Privacy First**: All processing happens locally in browser

### Security Features
- Strict file type and size checking (50MB limit)
- Binary header verification for image integrity
- XSS prevention in dynamic content
- Memory bounds checking for large files

## 📖 Documentation

- **[Technical Specification](docs/magic-photo-editor-tech-spec.md)**: Complete technical architecture
- **[Component Design](docs/magic-photo-editor-component-design.md)**: React component structure
- **[API Design](docs/magic-photo-editor-api-design.md)**: TypeScript interfaces and functions
- **[Data Flow](docs/magic-photo-editor-data-flow.md)**: State management and async processing
- **[Development Standards](docs/magic-photo-editor-dev-standards.md)**: Coding conventions and checklists
- **[Claude Code Guide](CLAUDE.md)**: AI-assisted development guide

## 🤝 Contributing

This project follows strict development standards:

1. **TypeScript**: Strict mode with full type safety
2. **Testing**: 95% test coverage requirement
3. **Performance**: Core Web Vitals compliance
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Code Quality**: ESLint + Prettier + Husky pre-commit hooks

See [Development Standards](docs/magic-photo-editor-dev-standards.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe**: Google's ML framework for real-time perception
- **Next.js**: React framework for production applications
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Motion library for React

---

**Built with ❤️ by [metavision9988](https://github.com/metavision9988)**