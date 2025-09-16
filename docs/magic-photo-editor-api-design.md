# 🔧 **Magic Photo Editor - API 설계 문서**
*Claude Code 개발을 위한 완전한 함수, 클래스, 인터페이스 명세*

---

## 📊 **문서 정보**
- **작성일**: 2025-09-16
- **버전**: v1.0
- **대상**: Claude Code 개발
- **우선순위**: Critical ⭐⭐⭐⭐⭐

---

## 🎯 **목적 및 범위**
이 문서는 Magic Photo Editor의 모든 API 인터페이스를 정의하여 Claude Code에서 일관성 있고 타입 안전한 개발을 가능하게 합니다. 모든 함수, 클래스, 인터페이스의 시그니처와 동작을 상세히 명세합니다.

---

## 🧩 **1. 핵심 타입 정의**

### **🖼️ 이미지 관련 타입**
```typescript
// 기본 이미지 정보
interface ImageInfo {
  readonly id: string
  readonly fileName: string
  readonly mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/heic' | 'image/bmp'
  readonly size: number        // bytes
  readonly width: number       // pixels
  readonly height: number      // pixels
  readonly aspectRatio: number // width/height
  readonly colorSpace?: 'srgb' | 'p3' | 'rec2020'
  readonly hasAlpha: boolean
  readonly createdAt: Date
  readonly lastModified: Date
}

// 처리 옵션
interface ProcessingOptions {
  readonly quality: number          // 0-100, 압축 품질
  readonly format: 'avif' | 'webp' | 'png' | 'jpeg'
  readonly transparent: boolean     // 투명 배경 유지 여부
  readonly featherRadius: number    // 0-20, 가장자리 부드럽게 처리
  readonly preserveMetadata: boolean // EXIF 데이터 보존
  readonly maxWidth?: number        // 최대 너비 제한
  readonly maxHeight?: number       // 최대 높이 제한
  readonly backgroundFill?: string  // 배경 제거시 채울 색상 (hex)
}

// 바운딩 박스
interface BoundingBox {
  readonly x: number        // 0-1, 상대 좌표
  readonly y: number        // 0-1, 상대 좌표
  readonly width: number    // 0-1, 상대 크기
  readonly height: number   // 0-1, 상대 크기
  readonly rotation?: number // 0-360, 회전 각도
}

// 감지된 객체
interface DetectedObject {
  readonly id: string
  readonly categoryName: string
  readonly displayName: string      // 한국어 표시명
  readonly confidence: number       // 0-1, 신뢰도
  readonly boundingBox: BoundingBox
  readonly mask?: ImageData         // 세밀한 마스크 정보
  readonly pixelCount: number       // 객체 픽셀 수
  readonly isRemovable: boolean     // 제거 가능 여부
  readonly removalDifficulty: 'easy' | 'medium' | 'hard' // 제거 난이도
}
```

### **⚡ 처리 상태 관련 타입**
```typescript
// 처리 작업
interface ProcessingJob {
  readonly id: string
  readonly type: 'object-removal' | 'background-removal' | 'smart-crop' | 'batch-process'
  readonly status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  readonly progress: number         // 0-100, 진행률
  readonly startedAt: Date
  readonly estimatedCompletion?: Date
  readonly completedAt?: Date
  readonly error?: ProcessingError
  readonly inputImage: ImageInfo
  readonly outputImage?: ImageInfo
  readonly processingOptions: ProcessingOptions
  readonly metadata: ProcessingMetadata
}

// 처리 메타데이터
interface ProcessingMetadata {
  readonly processingTime: number   // milliseconds
  readonly memoryUsage: number      // MB
  readonly cpuUsage: number        // 0-100%
  readonly gpuAccelerated: boolean
  readonly modelVersion: string
  readonly processingMethod: string
  readonly qualityScore: number    // 0-100, 결과 품질 점수
}

// 처리 결과
interface ProcessingResult {
  readonly success: boolean
  readonly originalImage: ImageInfo
  readonly processedImage?: ImageInfo
  readonly downloadUrl?: string     // 임시 다운로드 URL
  readonly previewUrl?: string      // 미리보기 URL
  readonly metadata: ProcessingMetadata
  readonly suggestions: ProcessingSuggestion[]
}

// AI 제안사항
interface ProcessingSuggestion {
  readonly type: 'quality-improvement' | 'alternative-method' | 'post-processing'
  readonly title: string
  readonly description: string
  readonly confidence: number       // 0-1
  readonly actionable: boolean      // 자동 적용 가능 여부
  readonly estimatedImprovement: number // 0-100, 예상 개선도
}
```

### **❌ 에러 관련 타입**
```typescript
// 에러 코드
enum ErrorCode {
  // 파일 관련
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  CORRUPTED_FILE = 'CORRUPTED_FILE',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  
  // MediaPipe 관련
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  MODEL_NOT_INITIALIZED = 'MODEL_NOT_INITIALIZED',
  INFERENCE_FAILED = 'INFERENCE_FAILED',
  
  // 처리 관련
  PROCESSING_TIMEOUT = 'PROCESSING_TIMEOUT',
  MEMORY_EXHAUSTED = 'MEMORY_EXHAUSTED',
  GPU_NOT_AVAILABLE = 'GPU_NOT_AVAILABLE',
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
  
  // 네트워크 관련
  NETWORK_ERROR = 'NETWORK_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // 시스템 관련
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  WEBGL_NOT_AVAILABLE = 'WEBGL_NOT_AVAILABLE'
}

// 처리 에러
class ProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly recoverable: boolean = false,
    public readonly retryable: boolean = false,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = 'ProcessingError'
  }
}

// 검증 결과
interface ValidationResult {
  readonly valid: boolean
  readonly errors: ValidationError[]
  readonly warnings: ValidationWarning[]
}

interface ValidationError {
  readonly code: ErrorCode
  readonly message: string
  readonly field?: string
  readonly value?: unknown
}

interface ValidationWarning {
  readonly message: string
  readonly recommendation?: string
}
```

---

## 🤖 **2. AI 서비스 API**

### **🎯 MediaPipe 통합 서비스**
```typescript
class MediaPipeService {
  private modelCache = new Map<string, any>()
  private isInitialized = false
  private initializationPromise?: Promise<void>

  /**
   * MediaPipe 서비스 초기화
   * GPU 가속 가능 여부 확인 및 최적 백엔드 선택
   */
  async initialize(options?: MediaPipeInitOptions): Promise<void>

  /**
   * 이미지에서 객체 감지 수행
   * @param image - 분석할 이미지 엘리먼트
   * @param options - 감지 옵션
   * @returns 감지된 객체 배열
   */
  async detectObjects(
    image: HTMLImageElement,
    options?: ObjectDetectionOptions
  ): Promise<DetectedObject[]>

  /**
   * 특정 객체에 대한 정밀한 마스크 생성
   * @param image - 원본 이미지
   * @param object - 대상 객체
   * @returns 마스크 데이터
   */
  async generateMask(
    image: HTMLImageElement,
    object: DetectedObject
  ): Promise<ImageData>

  /**
   * 배경 제거를 위한 전체 마스크 생성
   * @param image - 원본 이미지
   * @returns 전경/배경 분리 마스크
   */
  async generateBackgroundMask(image: HTMLImageElement): Promise<ImageData>

  /**
   * 스마트 크롭 영역 제안
   * @param image - 원본 이미지
   * @param aspectRatio - 목표 비율 (선택사항)
   * @returns 추천 크롭 영역들
   */
  async suggestCropRegions(
    image: HTMLImageElement,
    aspectRatio?: number
  ): Promise<BoundingBox[]>

  /**
   * 리소스 정리
   */
  cleanup(): void

  /**
   * 현재 상태 확인
   */
  getStatus(): MediaPipeStatus
}

interface MediaPipeInitOptions {
  readonly enableGPU: boolean
  readonly modelPath?: string
  readonly wasmPath?: string
  readonly numThreads?: number
}

interface ObjectDetectionOptions {
  readonly minConfidence: number    // 0-1, 최소 신뢰도
  readonly maxResults: number       // 최대 결과 수
  readonly filterCategories?: string[] // 특정 카테고리만 감지
}

interface MediaPipeStatus {
  readonly initialized: boolean
  readonly gpuEnabled: boolean
  readonly modelLoaded: boolean
  readonly processingCapacity: 'low' | 'medium' | 'high'
  readonly memoryUsage: number     // MB
}
```

### **🖼️ 이미지 처리 서비스**
```typescript
class ImageProcessingService {
  private worker?: Worker
  private canvas?: HTMLCanvasElement
  private context?: CanvasRenderingContext2D

  /**
   * 서비스 초기화
   */
  async initialize(): Promise<void>

  /**
   * 객체 제거 처리
   * @param image - 원본 이미지
   * @param mask - 제거할 영역 마스크
   * @param options - 처리 옵션
   * @returns 처리된 이미지
   */
  async removeObject(
    image: HTMLImageElement,
    mask: ImageData,
    options: ProcessingOptions
  ): Promise<HTMLImageElement>

  /**
   * 배경 제거 처리
   * @param image - 원본 이미지
   * @param mask - 전경 마스크
   * @param options - 처리 옵션
   * @returns 배경이 제거된 이미지
   */
  async removeBackground(
    image: HTMLImageElement,
    mask: ImageData,
    options: ProcessingOptions
  ): Promise<HTMLImageElement>

  /**
   * 스마트 크롭 처리
   * @param image - 원본 이미지
   * @param cropRegion - 크롭 영역
   * @param options - 처리 옵션
   * @returns 크롭된 이미지
   */
  async smartCrop(
    image: HTMLImageElement,
    cropRegion: BoundingBox,
    options: ProcessingOptions
  ): Promise<HTMLImageElement>

  /**
   * 이미지 포맷 변환 및 최적화
   * @param image - 변환할 이미지
   * @param options - 내보내기 옵션
   * @returns 최적화된 이미지 Blob
   */
  async exportAsFormat(
    image: HTMLImageElement,
    options: ProcessingOptions
  ): Promise<Blob>

  /**
   * 배치 처리
   * @param images - 처리할 이미지들
   * @param operation - 수행할 작업
   * @param options - 처리 옵션
   * @returns 처리 작업 ID
   */
  async batchProcess(
    images: HTMLImageElement[],
    operation: BatchOperation,
    options: ProcessingOptions
  ): Promise<string>

  /**
   * 처리 진행상황 조회
   * @param jobId - 작업 ID
   * @returns 현재 진행상황
   */
  async getJobStatus(jobId: string): Promise<ProcessingJob>

  /**
   * 처리 취소
   * @param jobId - 취소할 작업 ID
   */
  async cancelJob(jobId: string): Promise<void>

  /**
   * 리소스 정리
   */
  cleanup(): void
}

type BatchOperation = 'remove-objects' | 'remove-backgrounds' | 'smart-crop' | 'format-conversion'
```

---

## 🎣 **3. React 훅 API**

### **📤 파일 업로드 훅**
```typescript
interface UseFileUploadResult {
  // 상태
  files: File[]
  uploadProgress: Record<string, number>
  isUploading: boolean
  dragActive: boolean
  errors: ValidationError[]

  // 액션
  selectFiles: (files: FileList | File[]) => Promise<void>
  removeFile: (index: number) => void
  clearFiles: () => void
  uploadFiles: () => Promise<ImageInfo[]>

  // 이벤트 핸들러
  handleDrop: (event: DragEvent) => void
  handleDragOver: (event: DragEvent) => void
  handleDragEnter: (event: DragEvent) => void
  handleDragLeave: (event: DragEvent) => void
}

function useFileUpload(options?: FileUploadOptions): UseFileUploadResult

interface FileUploadOptions {
  readonly maxFiles: number
  readonly maxFileSize: number      // bytes
  readonly acceptedTypes: string[]
  readonly autoUpload: boolean
  readonly validateOnSelect: boolean
}
```

### **🤖 객체 감지 훅**
```typescript
interface UseObjectDetectionResult {
  // 상태
  detectedObjects: DetectedObject[]
  selectedObject: DetectedObject | null
  isDetecting: boolean
  isGeneratingMask: boolean
  error: ProcessingError | null

  // 액션
  detectObjects: (image: HTMLImageElement) => Promise<DetectedObject[]>
  selectObject: (objectId: string) => void
  deselectObject: () => void
  generateMask: (object: DetectedObject) => Promise<ImageData>
  retryDetection: () => Promise<void>

  // 유틸
  getObjectsByCategory: (category: string) => DetectedObject[]
  getBoundingBoxPixels: (object: DetectedObject, imageWidth: number, imageHeight: number) => BoundingBoxPixels
}

function useObjectDetection(image?: HTMLImageElement): UseObjectDetectionResult

interface BoundingBoxPixels {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
```

### **⚡ 이미지 처리 훅**
```typescript
interface UseImageProcessingResult {
  // 상태
  currentJob: ProcessingJob | null
  jobs: ProcessingJob[]
  processingQueue: string[]
  isProcessing: boolean
  progress: number
  error: ProcessingError | null

  // 액션
  processImage: (
    image: HTMLImageElement,
    operation: ProcessingOperation,
    options?: ProcessingOptions
  ) => Promise<ProcessingResult>
  
  batchProcess: (
    images: HTMLImageElement[],
    operation: BatchOperation,
    options?: ProcessingOptions
  ) => Promise<string>

  cancelProcessing: (jobId?: string) => Promise<void>
  retryProcessing: (jobId: string) => Promise<void>
  clearHistory: () => void

  // 유틸
  getJobById: (jobId: string) => ProcessingJob | undefined
  downloadResult: (jobId: string) => Promise<void>
}

function useImageProcessing(): UseImageProcessingResult

type ProcessingOperation = 'remove-object' | 'remove-background' | 'smart-crop'
```

### **💾 상태 관리 훅**
```typescript
interface UseAppStateResult {
  // 전역 상태
  currentImage: ImageInfo | null
  detectedObjects: DetectedObject[]
  selectedObject: DetectedObject | null
  processingHistory: ProcessingJob[]
  userPreferences: UserPreferences

  // 액션
  setCurrentImage: (image: ImageInfo | null) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  addToHistory: (job: ProcessingJob) => void
  clearHistory: () => void

  // 유틸
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}

function useAppState(): UseAppStateResult

interface UserPreferences {
  readonly defaultFormat: 'avif' | 'webp' | 'png' | 'jpeg'
  readonly defaultQuality: number
  readonly autoSave: boolean
  readonly showTutorials: boolean
  readonly language: 'ko' | 'en'
  readonly theme: 'light' | 'dark' | 'auto'
}
```

---

## 🛠️ **4. 유틸리티 함수**

### **✅ 검증 함수**
```typescript
/**
 * 이미지 파일 검증
 * @param file - 검증할 파일
 * @returns 검증 결과
 */
function validateImageFile(file: File): ValidationResult

/**
 * 처리 옵션 검증
 * @param options - 검증할 옵션
 * @returns 검증 결과
 */
function validateProcessingOptions(options: ProcessingOptions): ValidationResult

/**
 * 이미지 크기 검증
 * @param width - 너비
 * @param height - 높이
 * @param maxSize - 최대 크기 제한
 * @returns 검증 결과
 */
function validateImageDimensions(
  width: number,
  height: number,
  maxSize?: { width: number; height: number }
): ValidationResult

/**
 * 브라우저 지원 여부 검증
 * @returns 지원 기능 목록
 */
function validateBrowserSupport(): BrowserSupport

interface BrowserSupport {
  readonly webgl: boolean
  readonly webgl2: boolean
  readonly webAssembly: boolean
  readonly offscreenCanvas: boolean
  readonly webWorkers: boolean
  readonly fileSystem: boolean
}
```

### **🔄 변환 함수**
```typescript
/**
 * File을 HTMLImageElement로 변환
 * @param file - 변환할 파일
 * @returns 이미지 엘리먼트
 */
function fileToImage(file: File): Promise<HTMLImageElement>

/**
 * HTMLImageElement를 Canvas로 변환
 * @param image - 변환할 이미지
 * @param options - 변환 옵션
 * @returns 캔버스 엘리먼트
 */
function imageToCanvas(
  image: HTMLImageElement,
  options?: CanvasOptions
): HTMLCanvasElement

/**
 * Canvas를 Blob으로 변환
 * @param canvas - 변환할 캔버스
 * @param options - 출력 옵션
 * @returns 이미지 Blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  options: ProcessingOptions
): Promise<Blob>

/**
 * 상대 좌표를 픽셀 좌표로 변환
 * @param boundingBox - 상대 좌표 박스
 * @param imageWidth - 이미지 너비
 * @param imageHeight - 이미지 높이
 * @returns 픽셀 좌표 박스
 */
function relativeToPixelCoords(
  boundingBox: BoundingBox,
  imageWidth: number,
  imageHeight: number
): BoundingBoxPixels

interface CanvasOptions {
  readonly width?: number
  readonly height?: number
  readonly maintainAspectRatio: boolean
}
```

### **📁 파일 관리 함수**
```typescript
/**
 * Blob을 파일로 다운로드
 * @param blob - 다운로드할 데이터
 * @param filename - 파일명
 */
function downloadBlob(blob: Blob, filename: string): void

/**
 * 이미지 파일명 생성
 * @param originalName - 원본 파일명
 * @param suffix - 접미사
 * @param format - 출력 포맷
 * @returns 새로운 파일명
 */
function generateFileName(
  originalName: string,
  suffix: string,
  format: string
): string

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 변환
 * @param bytes - 바이트 수
 * @returns 포맷된 크기 문자열
 */
function formatFileSize(bytes: number): string

/**
 * MIME 타입에서 파일 확장자 추출
 * @param mimeType - MIME 타입
 * @returns 파일 확장자
 */
function getExtensionFromMimeType(mimeType: string): string
```

### **⚡ 성능 유틸리티**
```typescript
/**
 * 이미지 리사이징 (성능 최적화)
 * @param image - 원본 이미지
 * @param maxWidth - 최대 너비
 * @param maxHeight - 최대 높이
 * @returns 리사이즈된 이미지
 */
function resizeImage(
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): Promise<HTMLImageElement>

/**
 * 메모리 사용량 모니터링
 * @returns 현재 메모리 사용 정보
 */
function getMemoryUsage(): MemoryInfo | null

/**
 * 성능 측정 래퍼
 * @param name - 측정할 작업명
 * @param fn - 측정할 함수
 * @returns 함수 결과와 실행 시간
 */
async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }>

interface MemoryInfo {
  readonly used: number        // MB
  readonly total: number       // MB
  readonly limit: number       // MB
}
```

---

## 🎨 **5. React 컴포넌트 Props 인터페이스**

### **📤 업로드 컴포넌트**
```typescript
interface SmartUploadZoneProps {
  readonly onFilesSelected: (files: File[]) => void
  readonly onFilesDropped: (files: File[]) => void
  readonly maxFiles?: number
  readonly maxFileSize?: number
  readonly acceptedTypes?: string[]
  readonly disabled?: boolean
  readonly className?: string
  readonly children?: React.ReactNode
}

interface UploadProgressProps {
  readonly files: Array<{
    file: File
    progress: number
    status: 'uploading' | 'completed' | 'error'
    error?: string
  }>
  readonly onCancel?: (fileIndex: number) => void
  readonly onRetry?: (fileIndex: number) => void
  readonly showDetails?: boolean
  readonly className?: string
}
```

### **🎨 캔버스 컴포넌트**
```typescript
interface CanvasWorkspaceProps {
  readonly image: HTMLImageElement | null
  readonly detectedObjects: DetectedObject[]
  readonly selectedObject: DetectedObject | null
  readonly onObjectSelect: (objectId: string) => void
  readonly onObjectDeselect: () => void
  readonly showOverlays: boolean
  readonly zoom: number
  readonly pan: { x: number; y: number }
  readonly onZoomChange: (zoom: number) => void
  readonly onPanChange: (pan: { x: number; y: number }) => void
  readonly className?: string
}

interface ObjectOverlayProps {
  readonly object: DetectedObject
  readonly isSelected: boolean
  readonly onClick: () => void
  readonly onHover?: () => void
  readonly onDoubleClick?: () => void
  readonly showLabel?: boolean
  readonly showConfidence?: boolean
  readonly className?: string
}
```

### **🔧 속성 패널 컴포넌트**
```typescript
interface PropertiesPanelProps {
  readonly selectedObject: DetectedObject | null
  readonly processingOptions: ProcessingOptions
  readonly onOptionsChange: (options: Partial<ProcessingOptions>) => void
  readonly onStartProcessing: () => void
  readonly isProcessing: boolean
  readonly canProcess: boolean
  readonly className?: string
}

interface AIRecommendationsProps {
  readonly suggestions: ProcessingSuggestion[]
  readonly onApplySuggestion: (suggestion: ProcessingSuggestion) => void
  readonly loading: boolean
  readonly className?: string
}
```

---

## 📊 **6. 상태 관리 (Zustand Store)**

### **🗂️ 전역 상태 인터페이스**
```typescript
interface AppState {
  // 현재 상태
  currentImage: ImageInfo | null
  detectedObjects: DetectedObject[]
  selectedObject: DetectedObject | null
  processingJobs: Record<string, ProcessingJob>
  
  // UI 상태
  isLoading: boolean
  error: ProcessingError | null
  showTutorial: boolean
  
  // 사용자 설정
  userPreferences: UserPreferences
  
  // 히스토리
  history: ProcessingJob[]
  historyIndex: number
}

interface AppActions {
  // 이미지 관리
  setCurrentImage: (image: ImageInfo | null) => void
  updateImageInfo: (imageId: string, updates: Partial<ImageInfo>) => void
  
  // 객체 관리
  setDetectedObjects: (objects: DetectedObject[]) => void
  addDetectedObject: (object: DetectedObject) => void
  updateDetectedObject: (objectId: string, updates: Partial<DetectedObject>) => void
  selectObject: (objectId: string) => void
  deselectObject: () => void
  
  // 처리 작업 관리
  addProcessingJob: (job: ProcessingJob) => void
  updateProcessingJob: (jobId: string, updates: Partial<ProcessingJob>) => void
  removeProcessingJob: (jobId: string) => void
  
  // 에러 관리
  setError: (error: ProcessingError | null) => void
  clearError: () => void
  
  // 사용자 설정
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  
  // 히스토리 관리
  addToHistory: (job: ProcessingJob) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
  
  // UI 상태
  setLoading: (loading: boolean) => void
  setShowTutorial: (show: boolean) => void
}

// Zustand Store
const useAppStore = create<AppState & AppActions>()
```

---

## ✅ **체크리스트**

### **🔴 Critical 구현 사항**
- [x] 핵심 타입 정의 완료 (ImageInfo, DetectedObject, ProcessingOptions)
- [x] MediaPipeService 인터페이스 정의
- [x] ImageProcessingService 인터페이스 정의
- [x] React 훅 인터페이스 정의 (useFileUpload, useObjectDetection, useImageProcessing)
- [x] 에러 처리 시스템 정의 (ProcessingError, ErrorCode)

### **🟡 Important 구현 사항**
- [x] 유틸리티 함수 시그니처 정의
- [x] React 컴포넌트 Props 인터페이스 정의
- [x] Zustand Store 상태/액션 인터페이스 정의
- [x] 성능 최적화 유틸리티 정의
- [x] 브라우저 호환성 검증 인터페이스

### **🟢 Helpful 구현 사항**
- [x] TypeScript 엄격 모드 지원
- [x] JSDoc 주석으로 문서화
- [x] 확장 가능한 인터페이스 설계
- [x] MVP 확장성 고려
- [x] 테스트 용이성 고려

---

## 🚀 **Claude Code 개발 준비 완료**

이 API 설계 문서로 **Claude Code에서 즉시 개발 가능**합니다:

✅ **완전한 타입 정의** - 모든 인터페이스와 함수 시그니처 완비  
✅ **에러 처리 체계** - 예외 상황 대응 방안 포함  
✅ **React 통합** - 훅과 컴포넌트 Props 인터페이스 정의  
✅ **상태 관리** - Zustand Store 완전 설계  
✅ **성능 최적화** - 메모리/CPU 효율적 설계  
✅ **확장성** - MVP 통합 고려된 모듈러 구조  

**🎯 다음 단계: 이 API 명세를 바탕으로 Claude Code에서 실제 구현 시작!**