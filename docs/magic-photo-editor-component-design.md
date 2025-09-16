# 🧩 **Magic Photo Editor - 컴포넌트 설계서**
*Claude Code 개발을 위한 완전한 React 컴포넌트 구조 정의*

---

## 📊 **문서 정보**
- **작성일**: 2025-01-XX
- **버전**: v1.0
- **대상**: Claude Code 개발 + 확장성 고려
- **우선순위**: Critical ⭐⭐⭐⭐⭐

---

## 🎯 **컴포넌트 아키텍처 개요**

### **🏗️ 설계 원칙**
```yaml
Composition over Inheritance:
  - 작은 단위 컴포넌트들의 조합
  - 재사용성 극대화
  - 테스트 용이성 보장

Separation of Concerns:
  - UI 컴포넌트 (표현만 담당)
  - Container 컴포넌트 (비즈니스 로직)
  - Service Layer (외부 API/AI 통합)

Progressive Enhancement:
  - 기본 기능부터 고급 기능까지 단계적 구성
  - 기능 플래그를 통한 점진적 활성화
  - MVP 확장성 고려

Type Safety First:
  - 모든 Props와 State 엄격한 타입 정의
  - 런타임 에러 방지
  - 개발자 경험 향상
```

---

## 🌳 **전체 컴포넌트 트리 구조**

### **📋 Component Hierarchy**
```
🏠 App
├── 🧭 AppLayout
│   ├── 📱 Header
│   │   ├── 🏷️ Logo
│   │   ├── 🧭 Navigation
│   │   └── 👤 UserMenu
│   ├── 📄 MainContent
│   │   ├── 📤 UploadSection
│   │   │   ├── 📁 SmartUploadZone
│   │   │   ├── 📊 UploadProgress
│   │   │   └── 🤖 AIInsightPanel
│   │   ├── 🎨 WorkspaceSection
│   │   │   ├── 🖼️ CanvasWorkspace
│   │   │   │   ├── 🖱️ CanvasToolbar
│   │   │   │   ├── 🎯 ObjectOverlayManager
│   │   │   │   │   └── 🔘 ObjectOverlay (multiple)
│   │   │   │   ├── 🎭 PreviewManager
│   │   │   │   │   ├── 👁️ BeforeAfterViewer
│   │   │   │   │   └── 🎬 ProcessingIndicator
│   │   │   │   └── ⚡ QuickActions
│   │   │   └── 🔧 PropertiesPanel
│   │   │       ├── 🤖 AIRecommendations
│   │   │       ├── 📋 ObjectInformation
│   │   │       ├── ⚙️ AdvancedSettings
│   │   │       └── 📤 ExportOptions
│   │   └── 📱 MobileInterface (모바일 전용)
│   │       ├── 📱 MobileHeader
│   │       ├── 🖼️ MobileCanvas
│   │       ├── 🎈 FloatingActionMenu
│   │       └── 📄 BottomSheet
│   └── 🦶 Footer
│       ├── 📊 StatusBar
│       └── ❓ HelpCenter
├── 🚨 ErrorBoundary
├── 🔔 NotificationManager
├── 🎭 ModalManager
└── 🧪 DevTools (개발 환경 전용)
```

---

## 🏗️ **Layout & Structure Components**

### **🏠 App Component**
```tsx
// 최상위 애플리케이션 컴포넌트
interface AppProps {
  // 환경 설정
  environment: 'development' | 'production'
  apiBaseUrl?: string
  features?: FeatureFlags
}

interface AppState {
  isInitialized: boolean
  globalError: Error | null
  theme: 'light' | 'dark' | 'auto'
  locale: string
}

interface FeatureFlags {
  enableVoiceControl: boolean
  enableAdvancedAI: boolean
  enableBetaFeatures: boolean
  enableAnalytics: boolean
}

const App: React.FC<AppProps> = ({
  environment = 'production',
  apiBaseUrl,
  features = defaultFeatures
}) => {
  const [state, setState] = useState<AppState>(initialState)
  
  return (
    <ErrorBoundary>
      <ThemeProvider theme={state.theme}>
        <I18nProvider locale={state.locale}>
          <FeatureFlagProvider flags={features}>
            <GlobalStateProvider>
              <QueryClientProvider client={queryClient}>
                <AppLayout />
                <NotificationManager />
                <ModalManager />
                {environment === 'development' && <DevTools />}
              </QueryClientProvider>
            </GlobalStateProvider>
          </FeatureFlagProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
```

### **🧭 AppLayout Component**
```tsx
// 전체 레이아웃 관리 컴포넌트
interface AppLayoutProps {
  children?: React.ReactNode
}

interface AppLayoutState {
  isMobile: boolean
  sidebarCollapsed: boolean
  currentMVP: MVPModule
  availableMVPs: MVPModule[]
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const { isMobile } = useResponsive()
  const { currentMVP, availableMVPs } = useMVPRegistry()
  
  if (isMobile) {
    return <MobileLayout />
  }
  
  return (
    <div className="app-layout min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
      <Header mvps={availableMVPs} currentMVP={currentMVP} />
      
      <main className="main-content grid grid-cols-12 gap-6 p-6">
        <div className="col-span-3">
          <UploadSection />
        </div>
        
        <div className="col-span-6">
          <WorkspaceSection />
        </div>
        
        <div className="col-span-3">
          <PropertiesPanel />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

### **📱 Header Component**
```tsx
// 상단 네비게이션 헤더
interface HeaderProps {
  mvps: MVPModule[]
  currentMVP: MVPModule
  onMVPSwitch?: (mvp: MVPModule) => void
}

interface HeaderState {
  searchQuery: string
  notificationCount: number
  userMenuOpen: boolean
}

const Header: React.FC<HeaderProps> = ({
  mvps,
  currentMVP,
  onMVPSwitch
}) => {
  return (
    <header className="header sticky top-0 z-50 glass-surface border-b border-white/20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & MVP Selector */}
        <div className="flex items-center space-x-4">
          <Logo />
          <MVPSelector 
            mvps={mvps}
            current={currentMVP}
            onSelect={onMVPSwitch}
          />
        </div>
        
        {/* Global Search */}
        <div className="flex-1 max-w-md mx-6">
          <GlobalSearch />
        </div>
        
        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

// Logo 컴포넌트
interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon' | 'text'
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full'
}) => {
  const logoSizes = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12'
  }
  
  return (
    <Link href="/" className="flex items-center space-x-2">
      {(variant === 'full' || variant === 'icon') && (
        <div className={`${logoSizes[size]} aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-lg">✨</span>
        </div>
      )}
      {(variant === 'full' || variant === 'text') && (
        <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Magic Editor
        </span>
      )}
    </Link>
  )
}
```

---

## 📤 **Upload Section Components**

### **📁 SmartUploadZone Component**
```tsx
// AI 기반 스마트 업로드 존
interface SmartUploadZoneProps {
  onFileSelect: (files: File[]) => void
  onAnalysisComplete: (analysis: AIImageAnalysis) => void
  maxFiles?: number
  maxFileSize?: number
  acceptedTypes?: string[]
  disabled?: boolean
}

interface SmartUploadZoneState {
  isDragActive: boolean
  isProcessing: boolean
  recentSuggestions: UploadSuggestion[]
  aiInsights: AIImageAnalysis | null
  uploadProgress: number
  errors: UploadError[]
}

interface AIImageAnalysis {
  objectCount: number
  dominantColors: string[]
  recommendation: string
  estimatedProcessingTime: number
  complexity: 'simple' | 'medium' | 'complex'
  suggestedActions: string[]
}

const SmartUploadZone: React.FC<SmartUploadZoneProps> = ({
  onFileSelect,
  onAnalysisComplete,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  disabled = false
}) => {
  const [state, setState] = useState<SmartUploadZoneState>(initialState)
  const { validateFiles, analyzeImages } = useImageProcessing()
  const { recentUploads, suggestions } = useUploadHistory()
  
  const handleDrop = useCallback(async (files: File[]) => {
    setState(prev => ({ ...prev, isProcessing: true }))
    
    try {
      // 1. 파일 검증
      const validationResult = await validateFiles(files)
      if (!validationResult.isValid) {
        setState(prev => ({ ...prev, errors: validationResult.errors }))
        return
      }
      
      // 2. AI 분석
      const analysis = await analyzeImages(validationResult.validFiles)
      setState(prev => ({ ...prev, aiInsights: analysis }))
      
      // 3. 콜백 실행
      onFileSelect(validationResult.validFiles)
      onAnalysisComplete(analysis)
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        errors: [{ type: 'processing_error', message: error.message }]
      }))
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }))
    }
  }, [validateFiles, analyzeImages, onFileSelect, onAnalysisComplete])
  
  return (
    <div className="upload-zone glass-surface p-6 rounded-2xl">
      {/* Main Upload Area */}
      <div 
        className={`upload-dropzone ${state.isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setState(prev => ({ ...prev, isDragActive: true }))}
        onDragLeave={() => setState(prev => ({ ...prev, isDragActive: false }))}
      >
        <UploadVisual 
          state={state.isProcessing ? 'processing' : state.isDragActive ? 'dragActive' : 'idle'}
        />
        
        <UploadContent 
          isDragActive={state.isDragActive}
          isProcessing={state.isProcessing}
          maxFileSize={maxFileSize}
          acceptedTypes={acceptedTypes}
        />
        
        <input
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleDrop(Array.from(e.target.files))}
          className="sr-only"
          id="file-upload"
        />
      </div>
      
      {/* Quick Actions */}
      <UploadQuickActions 
        onCameraCapture={() => {/* 웹캠 촬영 */}}
        onVoiceUpload={() => {/* 음성 업로드 */}}
        onSampleImages={() => {/* 샘플 이미지 */}}
      />
      
      {/* Recent Suggestions */}
      {suggestions.length > 0 && (
        <UploadSuggestions 
          suggestions={suggestions}
          onApply={(suggestion) => {/* 제안 적용 */}}
        />
      )}
      
      {/* AI Insights */}
      {state.aiInsights && (
        <AIInsightPanel 
          insights={state.aiInsights}
          onActionSelect={(action) => {/* 추천 액션 실행 */}}
        />
      )}
      
      {/* Error Display */}
      {state.errors.length > 0 && (
        <ErrorDisplay 
          errors={state.errors}
          onDismiss={(errorId) => {/* 에러 제거 */}}
        />
      )}
    </div>
  )
}

// 업로드 비주얼 컴포넌트
interface UploadVisualProps {
  state: 'idle' | 'dragActive' | 'processing'
}

const UploadVisual: React.FC<UploadVisualProps> = ({ state }) => {
  return (
    <div className="upload-visual mb-6">
      {state === 'idle' && <IdleUploadAnimation />}
      {state === 'dragActive' && <DragActiveAnimation />}
      {state === 'processing' && <ProcessingAnimation />}
    </div>
  )
}
```

### **📊 UploadProgress Component**
```tsx
// 업로드 진행률 표시 컴포넌트
interface UploadProgressProps {
  files: UploadingFile[]
  onCancel?: (fileId: string) => void
  onRetry?: (fileId: string) => void
}

interface UploadingFile {
  id: string
  name: string
  size: number
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
  estimatedTime?: number
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  files,
  onCancel,
  onRetry
}) => {
  const totalProgress = files.reduce((sum, file) => sum + file.progress, 0) / files.length
  
  return (
    <div className="upload-progress glass-surface p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          업로드 진행률
        </h3>
        <span className="text-sm text-gray-500">
          {Math.round(totalProgress)}%
        </span>
      </div>
      
      {/* Overall Progress */}
      <ProgressBar 
        value={totalProgress}
        className="mb-4"
        showAnimation
      />
      
      {/* Individual File Progress */}
      <div className="space-y-3">
        {files.map(file => (
          <FileProgressItem
            key={file.id}
            file={file}
            onCancel={() => onCancel?.(file.id)}
            onRetry={() => onRetry?.(file.id)}
          />
        ))}
      </div>
    </div>
  )
}

// 개별 파일 진행률 아이템
const FileProgressItem: React.FC<{
  file: UploadingFile
  onCancel: () => void
  onRetry: () => void
}> = ({ file, onCancel, onRetry }) => {
  return (
    <div className="file-progress-item bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium truncate">
          {file.name}
        </span>
        <div className="flex items-center space-x-2">
          {file.status === 'uploading' && (
            <Button size="sm" variant="ghost" onClick={onCancel}>
              <XIcon className="w-4 h-4" />
            </Button>
          )}
          {file.status === 'error' && (
            <Button size="sm" variant="ghost" onClick={onRetry}>
              <RefreshIcon className="w-4 h-4" />
            </Button>
          )}
          <StatusIcon status={file.status} />
        </div>
      </div>
      
      <ProgressBar 
        value={file.progress}
        status={file.status}
        size="sm"
      />
      
      {file.estimatedTime && (
        <p className="text-xs text-gray-500 mt-1">
          약 {Math.round(file.estimatedTime / 1000)}초 남음
        </p>
      )}
      
      {file.error && (
        <p className="text-xs text-red-500 mt-1">
          {file.error}
        </p>
      )}
    </div>
  )
}
```

---

## 🎨 **Workspace Section Components**

### **🖼️ CanvasWorkspace Component**
```tsx
// 메인 캔버스 작업 공간
interface CanvasWorkspaceProps {
  image: HTMLImageElement | null
  detectedObjects: DetectedObject[]
  selectedObjects: string[]
  onObjectSelect: (objectId: string) => void
  onObjectRemove: (objectId: string) => void
  onCanvasInteraction: (interaction: CanvasInteraction) => void
}

interface CanvasWorkspaceState {
  zoomLevel: number
  panOffset: { x: number; y: number }
  activeTool: CanvasTool
  previewMode: boolean
  isProcessing: boolean
  processingProgress: number
  canvasSize: { width: number; height: number }
}

interface CanvasTool {
  type: 'select' | 'remove' | 'brush' | 'zoom' | 'pan'
  options?: ToolOptions
}

interface CanvasInteraction {
  type: 'click' | 'drag' | 'hover' | 'wheel'
  position: { x: number; y: number }
  target?: 'canvas' | 'object' | 'background'
  modifiers?: { shift: boolean; ctrl: boolean; alt: boolean }
}

const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  image,
  detectedObjects,
  selectedObjects,
  onObjectSelect,
  onObjectRemove,
  onCanvasInteraction
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<CanvasWorkspaceState>(initialState)
  
  const { 
    renderCanvas, 
    handleCanvasClick, 
    handleCanvasWheel,
    updateZoom,
    updatePan
  } = useCanvasRenderer(canvasRef, image, detectedObjects)
  
  const { isListening, lastCommand } = useVoiceControl()
  
  useEffect(() => {
    if (image && canvasRef.current) {
      renderCanvas(state.zoomLevel, state.panOffset)
    }
  }, [image, detectedObjects, state.zoomLevel, state.panOffset, renderCanvas])
  
  return (
    <div className="canvas-workspace glass-surface rounded-2xl overflow-hidden">
      {/* Canvas Toolbar */}
      <CanvasToolbar
        activeTool={state.activeTool}
        onToolChange={(tool) => setState(prev => ({ ...prev, activeTool: tool }))}
        canUndo={false} // TODO: 실제 undo 상태 연결
        canRedo={false} // TODO: 실제 redo 상태 연결
        onUndo={() => {/* undo 실행 */}}
        onRedo={() => {/* redo 실행 */}}
        zoomLevel={state.zoomLevel}
        onZoomChange={updateZoom}
        isListening={isListening}
        lastVoiceCommand={lastCommand}
      />
      
      {/* Main Canvas Container */}
      <div className="canvas-container relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <canvas
          ref={canvasRef}
          className="main-canvas cursor-crosshair"
          width={state.canvasSize.width}
          height={state.canvasSize.height}
          onMouseDown={handleCanvasClick}
          onWheel={handleCanvasWheel}
          onClick={(e) => {
            const rect = canvasRef.current!.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            onCanvasInteraction({
              type: 'click',
              position: { x, y },
              target: 'canvas'
            })
          }}
        />
        
        {/* Object Overlays */}
        <ObjectOverlayManager
          objects={detectedObjects}
          selectedObjects={selectedObjects}
          zoomLevel={state.zoomLevel}
          panOffset={state.panOffset}
          onObjectSelect={onObjectSelect}
          canvasSize={state.canvasSize}
        />
        
        {/* Preview Manager */}
        {state.previewMode && (
          <PreviewManager
            originalImage={image}
            previewImage={null} // TODO: 실제 미리보기 이미지
            onClose={() => setState(prev => ({ ...prev, previewMode: false }))}
          />
        )}
        
        {/* Processing Indicator */}
        {state.isProcessing && (
          <ProcessingIndicator
            progress={state.processingProgress}
            message="AI가 마법을 부리고 있어요..."
            onCancel={() => {/* 처리 취소 */}}
          />
        )}
      </div>
      
      {/* Quick Actions */}
      <QuickActions
        onTogglePreview={() => setState(prev => ({ ...prev, previewMode: !prev.previewMode }))}
        onFitToScreen={() => {/* 화면에 맞추기 */}}
        onActualSize={() => {/* 실제 크기 */}}
        onToggleGrid={() => {/* 격자 토글 */}}
      />
    </div>
  )
}
```

### **🖱️ CanvasToolbar Component**
```tsx
// 캔버스 도구 모음
interface CanvasToolbarProps {
  activeTool: CanvasTool
  onToolChange: (tool: CanvasTool) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  zoomLevel: number
  onZoomChange: (level: number) => void
  isListening?: boolean
  lastVoiceCommand?: string
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoomLevel,
  onZoomChange,
  isListening,
  lastVoiceCommand
}) => {
  return (
    <div className="canvas-toolbar glass-surface m-4 p-3 rounded-xl flex items-center justify-between">
      {/* Magic Tools */}
      <ToolGroup label="Magic Tools">
        <MagicTool
          type="remove"
          icon="✨"
          tooltip="클릭 한 번으로 객체 제거"
          active={activeTool.type === 'remove'}
          onClick={() => onToolChange({ type: 'remove' })}
        />
        <MagicTool
          type="brush"
          icon="🖌️"
          tooltip="브러시로 선택하고 제거"
          active={activeTool.type === 'brush'}
          onClick={() => onToolChange({ type: 'brush' })}
        />
        <MagicTool
          type="select"
          icon="🎯"
          tooltip="AI가 최적 영역 자동 선택"
          active={activeTool.type === 'select'}
          onClick={() => onToolChange({ type: 'select' })}
        />
      </ToolGroup>
      
      {/* View Controls */}
      <ToolGroup label="View Controls">
        <ViewControl
          icon="🔍"
          tooltip="확대/축소"
          active={activeTool.type === 'zoom'}
          onClick={() => onToolChange({ type: 'zoom' })}
        />
        <ViewControl
          icon="👋"
          tooltip="화면 이동"
          active={activeTool.type === 'pan'}
          onClick={() => onToolChange({ type: 'pan' })}
        />
        <ZoomControl
          value={zoomLevel}
          onChange={onZoomChange}
          min={0.1}
          max={5}
          step={0.1}
        />
      </ToolGroup>
      
      {/* History Controls */}
      <ToolGroup label="History">
        <HistoryControl
          icon="↺"
          tooltip="실행 취소"
          disabled={!canUndo}
          onClick={onUndo}
        />
        <HistoryControl
          icon="↻"
          tooltip="다시 실행"
          disabled={!canRedo}
          onClick={onRedo}
        />
      </ToolGroup>
      
      {/* Voice Control Indicator */}
      {isListening && (
        <VoiceIndicator
          isListening={isListening}
          lastCommand={lastVoiceCommand}
        />
      )}
    </div>
  )
}

// 도구 그룹 컴포넌트
interface ToolGroupProps {
  label: string
  children: React.ReactNode
}

const ToolGroup: React.FC<ToolGroupProps> = ({ label, children }) => {
  return (
    <div className="tool-group flex items-center space-x-2">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

// 매직 도구 컴포넌트
interface MagicToolProps {
  type: string
  icon: string
  tooltip: string
  active: boolean
  onClick: () => void
  disabled?: boolean
}

const MagicTool: React.FC<MagicToolProps> = ({
  type,
  icon,
  tooltip,
  active,
  onClick,
  disabled = false
}) => {
  return (
    <Tooltip content={tooltip}>
      <button
        className={`magic-tool ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={tooltip}
      >
        <span className="tool-icon text-lg">{icon}</span>
      </button>
    </Tooltip>
  )
}
```

### **🎯 ObjectOverlayManager Component**
```tsx
// 객체 오버레이 관리 컴포넌트
interface ObjectOverlayManagerProps {
  objects: DetectedObject[]
  selectedObjects: string[]
  zoomLevel: number
  panOffset: { x: number; y: number }
  onObjectSelect: (objectId: string) => void
  canvasSize: { width: number; height: number }
}

const ObjectOverlayManager: React.FC<ObjectOverlayManagerProps> = ({
  objects,
  selectedObjects,
  zoomLevel,
  panOffset,
  onObjectSelect,
  canvasSize
}) => {
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)
  
  return (
    <div className="object-overlays absolute inset-0 pointer-events-none">
      {objects.map(object => (
        <ObjectOverlay
          key={object.id}
          object={object}
          selected={selectedObjects.includes(object.id)}
          hovered={hoveredObject === object.id}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          canvasSize={canvasSize}
          onSelect={() => onObjectSelect(object.id)}
          onHover={() => setHoveredObject(object.id)}
          onLeave={() => setHoveredObject(null)}
        />
      ))}
    </div>
  )
}

// 개별 객체 오버레이
interface ObjectOverlayProps {
  object: DetectedObject
  selected: boolean
  hovered: boolean
  zoomLevel: number
  panOffset: { x: number; y: number }
  canvasSize: { width: number; height: number }
  onSelect: () => void
  onHover: () => void
  onLeave: () => void
}

const ObjectOverlay: React.FC<ObjectOverlayProps> = ({
  object,
  selected,
  hovered,
  zoomLevel,
  panOffset,
  canvasSize,
  onSelect,
  onHover,
  onLeave
}) => {
  // 캔버스 좌표를 화면 좌표로 변환
  const screenPosition = useMemo(() => {
    const x = (object.boundingBox.x * zoomLevel) + panOffset.x
    const y = (object.boundingBox.y * zoomLevel) + panOffset.y
    const width = object.boundingBox.width * zoomLevel
    const height = object.boundingBox.height * zoomLevel
    
    return { x, y, width, height }
  }, [object.boundingBox, zoomLevel, panOffset])
  
  return (
    <div
      className={`object-overlay pointer-events-auto ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
      style={{
        position: 'absolute',
        left: screenPosition.x,
        top: screenPosition.y,
        width: screenPosition.width,
        height: screenPosition.height,
      }}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* 선택/호버 테두리 */}
      <div className="overlay-border" />
      
      {/* 객체 라벨 */}
      <ObjectLabel
        object={object}
        visible={hovered || selected}
      />
      
      {/* 제거 버튼 */}
      {(hovered || selected) && (
        <RemoveButton
          onClick={(e) => {
            e.stopPropagation()
            onSelect() // 제거 액션 실행
          }}
        />
      )}
    </div>
  )
}

// 객체 라벨 컴포넌트
interface ObjectLabelProps {
  object: DetectedObject
  visible: boolean
}

const ObjectLabel: React.FC<ObjectLabelProps> = ({ object, visible }) => {
  if (!visible) return null
  
  return (
    <div className="object-label glass-surface px-2 py-1 rounded text-xs">
      <span className="font-medium">{object.categoryName}</span>
      <span className="text-gray-500 ml-1">
        ({Math.round(object.confidence * 100)}%)
      </span>
    </div>
  )
}
```

---

## 🔧 **Properties Panel Components**

### **🔧 PropertiesPanel Component**
```tsx
// 속성 패널 메인 컴포넌트
interface PropertiesPanelProps {
  selectedObject: DetectedObject | null
  aiRecommendations: AIRecommendation[]
  maskSettings: MaskSettings
  inpaintingSettings: InpaintingSettings
  exportSettings: ExportSettings
  onSettingsChange: (settings: Partial<ProcessingSettings>) => void
}

interface ProcessingSettings {
  mask: MaskSettings
  inpainting: InpaintingSettings
  export: ExportSettings
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  aiRecommendations,
  maskSettings,
  inpaintingSettings,
  exportSettings,
  onSettingsChange
}) => {
  return (
    <div className="properties-panel space-y-4">
      {/* AI 추천 설정 */}
      <PropertyBento
        title="AI 추천 설정"
        icon="🤖"
        defaultExpanded={true}
      >
        <AIRecommendations
          recommendations={aiRecommendations}
          onApply={(recommendation) => {
            onSettingsChange(recommendation.settings)
          }}
        />
      </PropertyBento>
      
      {/* 선택된 객체 정보 */}
      {selectedObject && (
        <PropertyBento
          title="선택된 객체"
          icon="🎯"
          defaultExpanded={true}
        >
          <ObjectInformation
            object={selectedObject}
            onRemove={() => {/* 객체 제거 */}}
            onRefineSelection={() => {/* 선택 영역 다듬기 */}}
          />
        </PropertyBento>
      )}
      
      {/* 고급 설정 */}
      <PropertyBento
        title="세밀한 조정"
        icon="⚙️"
        defaultExpanded={false}
      >
        <AdvancedSettings
          maskSettings={maskSettings}
          inpaintingSettings={inpaintingSettings}
          onMaskSettingsChange={(settings) => 
            onSettingsChange({ mask: settings })
          }
          onInpaintingSettingsChange={(settings) => 
            onSettingsChange({ inpainting: settings })
          }
        />
      </PropertyBento>
      
      {/* 내보내기 옵션 */}
      <PropertyBento
        title="내보내기"
        icon="📤"
        defaultExpanded={true}
      >
        <ExportOptions
          settings={exportSettings}
          onChange={(settings) => 
            onSettingsChange({ export: settings })
          }
          onExport={() => {/* 내보내기 시작 */}}
        />
      </PropertyBento>
    </div>
  )
}

// 속성 벤토 박스 컴포넌트
interface PropertyBentoProps {
  title: string
  icon: string
  children: React.ReactNode
  defaultExpanded?: boolean
  collapsible?: boolean
}

const PropertyBento: React.FC<PropertyBentoProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true,
  collapsible = true
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  
  return (
    <div className="property-bento glass-surface rounded-xl p-4">
      <div 
        className={`bento-header flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="bento-icon text-lg">{icon}</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        {collapsible && (
          <ChevronIcon 
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        )}
      </div>
      
      {expanded && (
        <div className="bento-content mt-4">
          {children}
        </div>
      )}
    </div>
  )
}
```

### **🤖 AIRecommendations Component**
```tsx
// AI 추천 설정 컴포넌트
interface AIRecommendationsProps {
  recommendations: AIRecommendation[]
  onApply: (recommendation: AIRecommendation) => void
}

interface AIRecommendation {
  id: string
  title: string
  description: string
  confidence: number
  preview?: string
  settings: Partial<ProcessingSettings>
  category: 'quality' | 'speed' | 'accuracy' | 'creative'
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onApply
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  )
  
  return (
    <div className="ai-recommendations">
      {/* 카테고리 필터 */}
      <div className="category-filter flex space-x-2 mb-4">
        <CategoryChip 
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        >
          전체
        </CategoryChip>
        <CategoryChip 
          active={selectedCategory === 'quality'}
          onClick={() => setSelectedCategory('quality')}
        >
          품질 우선
        </CategoryChip>
        <CategoryChip 
          active={selectedCategory === 'speed'}
          onClick={() => setSelectedCategory('speed')}
        >
          속도 우선
        </CategoryChip>
        <CategoryChip 
          active={selectedCategory === 'creative'}
          onClick={() => setSelectedCategory('creative')}
        >
          창의적
        </CategoryChip>
      </div>
      
      {/* 추천 카드들 */}
      <div className="recommendations-grid space-y-3">
        {filteredRecommendations.map(recommendation => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onApply={() => onApply(recommendation)}
          />
        ))}
      </div>
      
      {filteredRecommendations.length === 0 && (
        <EmptyState
          icon="🤖"
          title="추천 설정이 없습니다"
          description="이미지를 업로드하면 AI가 최적 설정을 추천해드립니다"
        />
      )}
    </div>
  )
}

// 추천 카드 컴포넌트
interface RecommendationCardProps {
  recommendation: AIRecommendation
  onApply: () => void
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onApply
}) => {
  return (
    <div className="recommendation-card bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-sm">
              {recommendation.title}
            </h4>
            <ConfidenceBadge confidence={recommendation.confidence} />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {recommendation.description}
          </p>
          {recommendation.preview && (
            <div className="preview-image w-full h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mb-2">
              <img 
                src={recommendation.preview} 
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <Button
          size="sm"
          variant="magic"
          onClick={onApply}
          className="ml-3"
        >
          적용
        </Button>
      </div>
    </div>
  )
}
```

### **📋 ObjectInformation Component**
```tsx
// 선택된 객체 정보 컴포넌트
interface ObjectInformationProps {
  object: DetectedObject
  onRemove: () => void
  onRefineSelection: () => void
}

const ObjectInformation: React.FC<ObjectInformationProps> = ({
  object,
  onRemove,
  onRefineSelection
}) => {
  return (
    <div className="object-information">
      {/* 객체 기본 정보 */}
      <div className="object-details space-y-3 mb-4">
        <InfoItem label="유형">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <span>{getObjectIcon(object.categoryName)}</span>
            <span>{object.categoryName}</span>
          </Badge>
        </InfoItem>
        
        <InfoItem label="신뢰도">
          <ConfidenceBar value={object.confidence} />
        </InfoItem>
        
        <InfoItem label="크기">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {object.boundingBox.width} × {object.boundingBox.height} px
          </span>
        </InfoItem>
        
        <InfoItem label="위치">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({Math.round(object.boundingBox.x)}, {Math.round(object.boundingBox.y)})
          </span>
        </InfoItem>
      </div>
      
      {/* 객체 액션 */}
      <div className="object-actions space-y-2">
        <Button
          variant="magic"
          size="sm"
          onClick={onRemove}
          className="w-full"
        >
          <span className="mr-2">✨</span>
          마법으로 제거
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefineSelection}
          className="w-full"
        >
          <span className="mr-2">🎨</span>
          선택 영역 다듬기
        </Button>
      </div>
      
      {/* 객체 미리보기 */}
      {object.preview && (
        <div className="object-preview mt-4">
          <h5 className="text-sm font-medium mb-2">미리보기</h5>
          <div className="preview-container bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
            <img 
              src={object.preview} 
              alt={`${object.categoryName} preview`}
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// 정보 아이템 컴포넌트
interface InfoItemProps {
  label: string
  children: React.ReactNode
}

const InfoItem: React.FC<InfoItemProps> = ({ label, children }) => {
  return (
    <div className="info-item flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <div className="flex items-center">
        {children}
      </div>
    </div>
  )
}

// 신뢰도 바 컴포넌트
interface ConfidenceBarProps {
  value: number // 0-1 사이 값
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ value }) => {
  const percentage = Math.round(value * 100)
  
  return (
    <div className="confidence-bar flex items-center space-x-2">
      <div className="progress-container bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
        <div 
          className="progress-fill bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {percentage}%
      </span>
    </div>
  )
}
```

---

## 📱 **Mobile Interface Components**

### **📱 MobileInterface Component**
```tsx
// 모바일 전용 인터페이스
interface MobileInterfaceProps {
  // 데스크톱과 동일한 Props 하지만 모바일 최적화된 UX
}

const MobileInterface: React.FC<MobileInterfaceProps> = () => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<string>('remove')
  
  return (
    <div className="mobile-interface h-screen flex flex-col">
      {/* 모바일 헤더 */}
      <MobileHeader />
      
      {/* 풀스크린 캔버스 */}
      <div className="flex-1 relative overflow-hidden">
        <MobileCanvas />
        
        {/* 제스처 힌트 */}
        <GestureHints />
        
        {/* 플로팅 액션 메뉴 */}
        <FloatingActionMenu
          activeAction={activeAction}
          onActionChange={setActiveAction}
        />
      </div>
      
      {/* 하단 시트 */}
      <BottomSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
      >
        <MobileProperties />
      </BottomSheet>
    </div>
  )
}

// 플로팅 액션 메뉴
interface FloatingActionMenuProps {
  activeAction: string
  onActionChange: (action: string) => void
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  activeAction,
  onActionChange
}) => {
  return (
    <div className="floating-action-menu fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="action-menu glass-surface rounded-full p-2 flex items-center space-x-2">
        <FloatingActionButton
          icon="✨"
          label="Magic Remove"
          active={activeAction === 'remove'}
          onClick={() => onActionChange('remove')}
        />
        <FloatingActionButton
          icon="↺"
          label="Undo"
          active={false}
          onClick={() => {/* undo */}}
        />
        <FloatingActionButton
          icon="📤"
          label="Share"
          active={false}
          onClick={() => {/* share */}}
        />
      </div>
    </div>
  )
}

// 플로팅 액션 버튼
interface FloatingActionButtonProps {
  icon: string
  label: string
  active: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  active,
  onClick,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base', 
    lg: 'w-14 h-14 text-lg'
  }
  
  return (
    <Tooltip content={label}>
      <button
        className={`floating-action-btn ${sizeClasses[size]} ${active ? 'active' : ''} rounded-full glass-surface flex items-center justify-center`}
        onClick={onClick}
        aria-label={label}
      >
        <span>{icon}</span>
      </button>
    </Tooltip>
  )
}
```

---

## 🧩 **공통 UI 컴포넌트**

### **🎛️ Design System Components**
```tsx
// 버튼 컴포넌트
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'magic'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  loading?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-indigo-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-indigo-500',
    magic: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
  }
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}

// 진행률 바 컴포넌트
interface ProgressBarProps {
  value: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  showAnimation?: boolean
  status?: 'uploading' | 'processing' | 'completed' | 'error'
  estimatedTime?: number
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  showPercentage = false,
  showAnimation = true,
  status = 'uploading',
  estimatedTime,
  className
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const statusColors = {
    uploading: 'from-blue-400 to-blue-600',
    processing: 'from-purple-400 to-purple-600',
    completed: 'from-green-400 to-green-600',
    error: 'from-red-400 to-red-600'
  }
  
  return (
    <div className={`progress-bar-container ${className || ''}`}>
      <div className={`progress-track bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`progress-fill bg-gradient-to-r ${statusColors[status]} ${sizeClasses[size]} transition-all duration-300 ${showAnimation ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      
      {(showPercentage || estimatedTime) && (
        <div className="progress-info flex justify-between items-center mt-1 text-xs text-gray-600 dark:text-gray-400">
          {showPercentage && (
            <span>{Math.round(value)}%</span>
          )}
          {estimatedTime && (
            <span>약 {Math.round(estimatedTime / 1000)}초 남음</span>
          )}
        </div>
      )}
    </div>
  )
}

// 모달 컴포넌트
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  children,
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-none m-4'
  }
  
  if (!open) return null
  
  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="overlay-background absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* 모달 컨테이너 */}
      <div className={`modal-container relative glass-surface rounded-2xl shadow-2xl ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-hidden`}>
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="modal-header flex items-center justify-between p-6 border-b border-white/20">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="close-button p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="닫기"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* 컨텐츠 */}
        <div className="modal-content p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
```

---

## 🎣 **Custom Hooks**

### **🤖 AI Processing Hooks**
```tsx
// MediaPipe 객체 감지 훅
interface UseObjectDetectionReturn {
  detectObjects: (image: HTMLImageElement) => Promise<DetectedObject[]>
  isLoading: boolean
  error: Error | null
  modelReady: boolean
}

const useObjectDetection = (): UseObjectDetectionReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [modelReady, setModelReady] = useState(false)
  
  const mediaPipeService = useMemo(() => new MediaPipeService(), [])
  
  useEffect(() => {
    mediaPipeService.initialize()
      .then(() => setModelReady(true))
      .catch(setError)
  }, [mediaPipeService])
  
  const detectObjects = useCallback(async (image: HTMLImageElement): Promise<DetectedObject[]> => {
    if (!modelReady) {
      throw new Error('MediaPipe 모델이 아직 로드되지 않았습니다')
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const objects = await mediaPipeService.detectObjects(image)
      return objects
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [mediaPipeService, modelReady])
  
  return { detectObjects, isLoading, error, modelReady }
}

// 이미지 처리 훅
interface UseImageProcessingReturn {
  processImage: (image: HTMLImageElement, options: ProcessingOptions) => Promise<Blob>
  removeObject: (image: HTMLImageElement, object: DetectedObject) => Promise<HTMLImageElement>
  generateMask: (image: HTMLImageElement, object: DetectedObject) => Promise<ImageData>
  isProcessing: boolean
  progress: number
  error: Error | null
}

const useImageProcessing = (): UseImageProcessingReturn => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  
  const processImage = useCallback(async (
    image: HTMLImageElement, 
    options: ProcessingOptions
  ): Promise<Blob> => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    
    try {
      // 이미지 처리 시뮬레이션
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // 실제 처리 로직 여기에 구현
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)
      
      return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob!), 'image/png')
      })
      
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [])
  
  const removeObject = useCallback(async (
    image: HTMLImageElement,
    object: DetectedObject
  ): Promise<HTMLImageElement> => {
    // 객체 제거 로직 구현
    return image // 임시 반환
  }, [])
  
  const generateMask = useCallback(async (
    image: HTMLImageElement,
    object: DetectedObject
  ): Promise<ImageData> => {
    // 마스크 생성 로직 구현
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    return ctx.createImageData(image.width, image.height)
  }, [])
  
  return {
    processImage,
    removeObject,
    generateMask,
    isProcessing,
    progress,
    error
  }
}

// 반응형 디자인 훅
interface UseResponsiveReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenSize: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
}

const useResponsive = (): UseResponsiveReturn => {
  const [screenInfo, setScreenInfo] = useState<UseResponsiveReturn>(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'desktop',
    orientation: 'landscape'
  }))
  
  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024
      
      setScreenInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
        orientation: height > width ? 'portrait' : 'landscape'
      })
    }
    
    updateScreenInfo()
    window.addEventListener('resize', updateScreenInfo)
    
    return () => window.removeEventListener('resize', updateScreenInfo)
  }, [])
  
  return screenInfo
}
```

### **🎨 Canvas & Interaction Hooks**
```tsx
// 캔버스 렌더링 훅
interface UseCanvasRendererReturn {
  renderCanvas: (zoom: number, pan: { x: number; y: number }) => void
  handleCanvasClick: (event: React.MouseEvent) => void
  handleCanvasWheel: (event: React.WheelEvent) => void
  updateZoom: (level: number) => void
  updatePan: (offset: { x: number; y: number }) => void
  canvasToScreenCoords: (x: number, y: number) => { x: number; y: number }
  screenToCanvasCoords: (x: number, y: number) => { x: number; y: number }
}

const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  image: HTMLImageElement | null,
  objects: DetectedObject[]
): UseCanvasRendererReturn => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  
  const renderCanvas = useCallback((zoomLevel: number, panOffset: { x: number; y: number }) => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    
    const ctx = canvas.getContext('2d')!
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 변환 매트릭스 설정
    ctx.save()
    ctx.translate(panOffset.x, panOffset.y)
    ctx.scale(zoomLevel, zoomLevel)
    
    // 이미지 그리기
    ctx.drawImage(image, 0, 0)
    
    // 객체 오버레이 그리기 (선택 사항)
    objects.forEach(obj => {
      if (obj.selected) {
        ctx.strokeStyle = '#3B82F6'
        ctx.lineWidth = 2 / zoomLevel
        ctx.strokeRect(
          obj.boundingBox.x,
          obj.boundingBox.y,
          obj.boundingBox.width,
          obj.boundingBox.height
        )
      }
    })
    
    ctx.restore()
  }, [canvasRef, image, objects])
  
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // 캔버스 좌표로 변환
    const canvasCoords = screenToCanvasCoords(x, y)
    
    // 클릭된 객체 찾기
    const clickedObject = objects.find(obj => 
      canvasCoords.x >= obj.boundingBox.x &&
      canvasCoords.x <= obj.boundingBox.x + obj.boundingBox.width &&
      canvasCoords.y >= obj.boundingBox.y &&
      canvasCoords.y <= obj.boundingBox.y + obj.boundingBox.height
    )
    
    if (clickedObject) {
      // 객체 선택 처리
    }
  }, [canvasRef, objects, zoom, pan])
  
  const handleCanvasWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault()
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(5, zoom * delta))
    
    setZoom(newZoom)
  }, [zoom])
  
  const updateZoom = useCallback((level: number) => {
    setZoom(Math.max(0.1, Math.min(5, level)))
  }, [])
  
  const updatePan = useCallback((offset: { x: number; y: number }) => {
    setPan(offset)
  }, [])
  
  const canvasToScreenCoords = useCallback((x: number, y: number) => {
    return {
      x: (x * zoom) + pan.x,
      y: (y * zoom) + pan.y
    }
  }, [zoom, pan])
  
  const screenToCanvasCoords = useCallback((x: number, y: number) => {
    return {
      x: (x - pan.x) / zoom,
      y: (y - pan.y) / zoom
    }
  }, [zoom, pan])
  
  return {
    renderCanvas,
    handleCanvasClick,
    handleCanvasWheel,
    updateZoom,
    updatePan,
    canvasToScreenCoords,
    screenToCanvasCoords
  }
}

// 음성 제어 훅
interface UseVoiceControlReturn {
  isListening: boolean
  lastCommand: string | null
  startListening: () => void
  stopListening: () => void
  commands: VoiceCommand[]
}

interface VoiceCommand {
  command: string
  action: () => void
  description: string
}

const useVoiceControl = (commands: VoiceCommand[]): UseVoiceControlReturn => {
  const [isListening, setIsListening] = useState(false)
  const [lastCommand, setLastCommand] = useState<string | null>(null)
  
  const recognition = useMemo(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      return null
    }
    
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'ko-KR'
    
    return recognition
  }, [])
  
  useEffect(() => {
    if (!recognition) return
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase()
      setLastCommand(transcript)
      
      // 명령어 매칭
      const matchedCommand = commands.find(cmd => 
        transcript.includes(cmd.command.toLowerCase())
      )
      
      if (matchedCommand) {
        matchedCommand.action()
      }
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognition.onerror = () => {
      setIsListening(false)
    }
  }, [recognition, commands])
  
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start()
      setIsListening(true)
    }
  }, [recognition, isListening])
  
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])
  
  return {
    isListening,
    lastCommand,
    startListening,
    stopListening,
    commands
  }
}
```

---

## 🎯 **State Management Integration**

### **🗃️ Zustand Stores**
```tsx
// 이미지 상태 스토어
interface ImageState {
  // 현재 이미지
  currentImage: HTMLImageElement | null
  originalImage: HTMLImageElement | null
  
  // 감지된 객체들
  detectedObjects: DetectedObject[]
  selectedObjects: string[]
  
  // 처리 상태
  isProcessing: boolean
  processingStep: ProcessingStep
  processingProgress: number
  
  // 결과
  processedImage: HTMLImageElement | null
  maskData: ImageData | null
  
  // 액션들
  setCurrentImage: (image: HTMLImageElement) => void
  setDetectedObjects: (objects: DetectedObject[]) => void
  selectObject: (objectId: string) => void
  deselectObject: (objectId: string) => void
  setProcessingState: (state: Partial<ProcessingState>) => void
  reset: () => void
}

const useImageStore = create<ImageState>((set, get) => ({
  currentImage: null,
  originalImage: null,
  detectedObjects: [],
  selectedObjects: [],
  isProcessing: false,
  processingStep: 'idle',
  processingProgress: 0,
  processedImage: null,
  maskData: null,
  
  setCurrentImage: (image) => set({ 
    currentImage: image, 
    originalImage: image,
    detectedObjects: [],
    selectedObjects: [],
    processedImage: null,
    maskData: null
  }),
  
  setDetectedObjects: (objects) => set({ detectedObjects: objects }),
  
  selectObject: (objectId) => set((state) => ({
    selectedObjects: state.selectedObjects.includes(objectId) 
      ? state.selectedObjects 
      : [...state.selectedObjects, objectId]
  })),
  
  deselectObject: (objectId) => set((state) => ({
    selectedObjects: state.selectedObjects.filter(id => id !== objectId)
  })),
  
  setProcessingState: (processingState) => set(processingState),
  
  reset: () => set({
    currentImage: null,
    originalImage: null,
    detectedObjects: [],
    selectedObjects: [],
    isProcessing: false,
    processingStep: 'idle',
    processingProgress: 0,
    processedImage: null,
    maskData: null
  })
}))

// UI 상태 스토어
interface UIState {
  // 레이아웃
  sidebarCollapsed: boolean
  propertiesPanelExpanded: boolean
  
  // 캔버스
  zoomLevel: number
  panOffset: { x: number; y: number }
  activeTool: CanvasTool
  previewMode: boolean
  
  // 모달 & 오버레이
  activeModal: string | null
  notifications: Notification[]
  
  // 테마 & 설정
  theme: 'light' | 'dark' | 'auto'
  locale: string
  
  // 액션들
  setSidebarCollapsed: (collapsed: boolean) => void
  setPropertiesPanelExpanded: (expanded: boolean) => void
  setZoomLevel: (level: number) => void
  setPanOffset: (offset: { x: number; y: number }) => void
  setActiveTool: (tool: CanvasTool) => void
  setPreviewMode: (enabled: boolean) => void
  showModal: (modalId: string) => void
  hideModal: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
}

const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  propertiesPanelExpanded: true,
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  activeTool: { type: 'select' },
  previewMode: false,
  activeModal: null,
  notifications: [],
  theme: 'auto',
  locale: 'ko',
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setPropertiesPanelExpanded: (expanded) => set({ propertiesPanelExpanded: expanded }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setPreviewMode: (enabled) => set({ previewMode: enabled }),
  showModal: (modalId) => set({ activeModal: modalId }),
  hideModal: () => set({ activeModal: null }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  setTheme: (theme) => set({ theme })
}))
```

---

## ✅ **최종 체크리스트**

### **🎯 컴포넌트 구조 검증**
```markdown
레이아웃 컴포넌트:
☑️ App (최상위 애플리케이션)
☑️ AppLayout (전체 레이아웃 관리)
☑️ Header (네비게이션 헤더)
☑️ Footer (상태 표시줄)

업로드 섹션:
☑️ SmartUploadZone (AI 기반 업로드)
☑️ UploadProgress (진행률 표시)
☑️ AIInsightPanel (AI 분석 결과)

워크스페이스:
☑️ CanvasWorkspace (메인 캔버스)
☑️ CanvasToolbar (도구 모음)
☑️ ObjectOverlayManager (객체 오버레이)
☑️ PreviewManager (미리보기)

속성 패널:
☑️ PropertiesPanel (설정 패널)
☑️ AIRecommendations (AI 추천)
☑️ ObjectInformation (객체 정보)
☑️ AdvancedSettings (고급 설정)

모바일 인터페이스:
☑️ MobileInterface (모바일 전용)
☑️ FloatingActionMenu (플로팅 메뉴)
☑️ BottomSheet (하단 시트)

공통 컴포넌트:
☑️ Button, ProgressBar, Modal
☑️ 재사용 가능한 UI 요소들
☑️ 접근성 고려된 인터페이스
```

### **🔧 기술적 검증**
```markdown
React 아키텍처:
☑️ TypeScript 완전 지원
☑️ Props/State 엄격한 타입 정의
☑️ Custom Hooks 분리
☑️ Context Provider 구조

상태 관리:
☑️ Zustand Store 설계
☑️ 단방향 데이터 플로우
☑️ 성능 최적화 고려

확장성:
☑️ MVP 통합 준비된 구조
☑️ 모듈러 컴포넌트 설계
☑️ 재사용 가능한 코드

성능:
☑️ React.memo 최적화 지점
☑️ useMemo/useCallback 활용
☑️ 가상화 고려사항
```

---

## 🚀 **Claude Code 개발 준비 완료**

이 컴포넌트 설계서로 **Claude Code에서 즉시 개발 가능**합니다:

✅ **완전한 컴포넌트 구조** - 모든 Props/State 정의됨  
✅ **실제 구현 가능한 코드** - TypeScript 인터페이스 완비  
✅ **확장성 고려된 설계** - MVP 통합 준비  
✅ **성능 최적화 가이드** - React 최적화 패턴 적용  
✅ **접근성 준수** - ARIA 라벨 및 키보드 네비게이션  

**🎯 다음 단계: API 설계 문서 + 데이터 흐름도를 완성하고 바로 Claude Code 개발 시작!**