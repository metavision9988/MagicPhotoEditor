# 📋 **Magic Photo Editor - 개발표준 통합 문서**
*개발 체크리스트 + 코딩 컨벤션*

---

## 📊 **문서 정보**
- **작성일**: 2025-09-16
- **버전**: v1.0
- **대상**: Claude Code 개발 + 팀 표준화
- **우선순위**: Important ⭐⭐⭐

---

## 🎯 **통합 문서 개요**
이 문서는 Magic Photo Editor 개발의 일관성과 품질을 보장하기 위한 개발 체크리스트와 코딩 컨벤션을 통합하여 제공합니다. Claude Code 개발 시 단계별 검증과 코드 품질 표준화를 동시에 달성할 수 있도록 설계되었습니다.

---

# 📋 **Part 1: 개발 체크리스트**

## 🚀 **1. 프로젝트 초기 설정**

### **📦 환경 구축 체크리스트**
```markdown
### 🔧 개발 환경 준비
- [ ] Node.js 18.17.0+ 설치 확인
- [ ] npm 9.0+ 또는 yarn 1.22+ 설치 확인
- [ ] Git 2.30+ 설치 및 계정 설정
- [ ] VSCode + 필수 확장프로그램 설치
  - [ ] TypeScript 확장
  - [ ] ESLint 확장
  - [ ] Prettier 확장
  - [ ] Tailwind CSS IntelliSense
  - [ ] Auto Rename Tag
  - [ ] Bracket Pair Colorizer
  - [ ] GitLens
  - [ ] Thunder Client (API 테스트용)

### 📁 프로젝트 구조 생성
- [ ] Next.js 15 프로젝트 초기화
- [ ] TypeScript 설정 완료
- [ ] 필수 디펜던시 설치 확인
  - [ ] @types/react @types/react-dom
  - [ ] zustand (상태 관리)
  - [ ] @headlessui/react (UI 컴포넌트)
  - [ ] framer-motion (애니메이션)
  - [ ] lucide-react (아이콘)
  - [ ] clsx tailwind-merge (클래스 유틸)
- [ ] 개발 도구 설정
  - [ ] ESLint 설정 파일 생성
  - [ ] Prettier 설정 파일 생성
  - [ ] Husky pre-commit 훅 설정
  - [ ] lint-staged 설정

### 🏗️ 폴더 구조 생성
- [ ] /src/components 생성
- [ ] /src/services 생성
- [ ] /src/hooks 생성
- [ ] /src/utils 생성
- [ ] /src/types 생성
- [ ] /src/styles 생성
- [ ] /public/assets 생성
- [ ] /__tests__ 생성
```

### **🔧 설정 파일 체크리스트**
```typescript
// 필수 설정 파일들 확인
const requiredConfigs = {
  eslint: {
    file: '.eslintrc.json',
    content: `{
      "extends": [
        "next/core-web-vitals",
        "@typescript-eslint/recommended"
      ],
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-const": "error",
        "no-console": "warn"
      }
    }`
  },
  
  prettier: {
    file: '.prettierrc',
    content: `{
      "semi": false,
      "trailingComma": "es5",
      "singleQuote": true,
      "printWidth": 80,
      "tabWidth": 2
    }`
  },
  
  tsconfig: {
    file: 'tsconfig.json',
    strictMode: true,
    pathMapping: true
  }
}
```

## 🧱 **2. 컴포넌트 개발 체크리스트**

### **⚛️ React 컴포넌트 개발**
```markdown
### 📝 컴포넌트 생성 전 체크
- [ ] 컴포넌트 책임 명확히 정의
- [ ] Props 인터페이스 설계 완료
- [ ] 재사용 가능성 검토
- [ ] 성능 최적화 필요성 판단

### 🏗️ 컴포넌트 구현 중 체크
- [ ] TypeScript 인터페이스 정의
- [ ] Props 검증 로직 추가
- [ ] 접근성 속성 (ARIA) 추가
- [ ] 에러 바운더리 고려
- [ ] 로딩/에러 상태 처리
- [ ] 메모이제이션 적용 (필요시)

### ✅ 컴포넌트 완성 후 체크
- [ ] Storybook 스토리 작성
- [ ] 유닛 테스트 작성
- [ ] 스크린 리더 테스트
- [ ] 키보드 네비게이션 테스트
- [ ] 다양한 Props 시나리오 테스트
- [ ] 반응형 디자인 확인
```

### **🎣 Custom Hook 개발**
```markdown
### 🪝 Hook 설계 체크
- [ ] Hook 이름이 'use'로 시작
- [ ] 단일 책임 원칙 준수
- [ ] 의존성 배열 최적화
- [ ] 메모리 누수 방지 (cleanup)

### 🧪 Hook 테스트 체크
- [ ] @testing-library/react-hooks 사용
- [ ] 다양한 상태 변화 시나리오 테스트
- [ ] 에러 상황 테스트
- [ ] 성능 테스트 (필요시)
```

## 🤖 **3. AI/MediaPipe 통합 체크리스트**

### **🧠 MediaPipe 서비스 개발**
```markdown
### 📚 모델 통합 준비
- [ ] MediaPipe 라이브러리 설치 확인
- [ ] 필요한 AI 모델 파일 다운로드
- [ ] 모델 로딩 전략 설계
- [ ] 브라우저 호환성 확인

### ⚡ 성능 최적화 체크
- [ ] Web Worker 구현
- [ ] 모델 캐싱 시스템 구현
- [ ] 메모리 사용량 모니터링
- [ ] GPU 가속 활용 (가능시)

### 🚨 에러 처리 체크
- [ ] 모델 로딩 실패 처리
- [ ] 브라우저 미지원 상황 처리
- [ ] 네트워크 오류 처리
- [ ] 메모리 부족 상황 처리
```

## 🎨 **4. UI/UX 구현 체크리스트**

### **🎭 인터페이스 구현**
```markdown
### 🎨 디자인 시스템 적용
- [ ] Tailwind CSS 유틸리티 클래스 사용
- [ ] 디자인 토큰 일관성 유지
- [ ] 색상 접근성 기준 준수 (WCAG 2.1)
- [ ] 폰트 계층 구조 적용

### 📱 반응형 디자인
- [ ] 모바일 우선 접근법
- [ ] 태블릿 해상도 최적화
- [ ] 데스크톱 레이아웃 완성
- [ ] 터치 인터페이스 최적화

### ⚡ 애니메이션 구현
- [ ] Framer Motion 활용
- [ ] 성능 친화적 애니메이션
- [ ] 접근성 고려 (reduced motion)
- [ ] 로딩 상태 애니메이션
```

## 🔧 **5. 서비스/유틸리티 개발 체크리스트**

### **⚙️ 서비스 클래스 개발**
```markdown
### 🏗️ 아키텍처 설계
- [ ] 단일 책임 원칙 적용
- [ ] 의존성 주입 패턴 사용
- [ ] 인터페이스 기반 설계
- [ ] 에러 처리 전략 수립

### 🧪 서비스 테스트
- [ ] 유닛 테스트 작성
- [ ] 모킹 전략 수립
- [ ] 통합 테스트 시나리오
- [ ] 성능 벤치마크
```

## 🚀 **6. 배포 및 최종 체크리스트**

### **📦 빌드 및 최적화**
```markdown
### 🏗️ 프로덕션 빌드
- [ ] Next.js 빌드 에러 없음
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 규칙 모두 통과
- [ ] 번들 사이즈 최적화 확인
- [ ] Core Web Vitals 기준 충족

### 🌍 배포 준비
- [ ] Vercel 배포 설정 완료
- [ ] 환경 변수 설정
- [ ] 도메인 연결 (필요시)
- [ ] HTTPS 인증서 확인
- [ ] 에러 추적 도구 연결 (Sentry)

### ✅ 최종 검증
- [ ] 다양한 브라우저에서 테스트
- [ ] 모바일 디바이스 테스트
- [ ] 네트워크 속도별 테스트
- [ ] 접근성 도구 검증 (axe, Lighthouse)
- [ ] SEO 메타데이터 확인
```

---

# 🎨 **Part 2: 코딩 컨벤션**

## 📝 **1. TypeScript 코딩 표준**

### **🏷️ 타입 정의 컨벤션**
```typescript
// ✅ 올바른 인터페이스 명명
interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'auto'
  readonly language: 'ko' | 'en'
  readonly autoSave: boolean
}

// ✅ 유니온 타입 활용
type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

// ✅ 제네릭 타입 명명
interface ApiResponse<T = unknown> {
  data: T
  status: 'success' | 'error'
  message?: string
}

// ✅ 엄격한 타입 가드
function isProcessingError(error: unknown): error is ProcessingError {
  return error instanceof Error && error.name === 'ProcessingError'
}

// ❌ 피해야 할 패턴
interface BadNaming {
  data: any // any 타입 사용 금지
  info: object // object 타입 대신 구체적 인터페이스
}
```

### **🔧 함수 및 변수 명명 규칙**
```typescript
// ✅ 함수 명명 - 동사 + 명사 조합
const validateImageFile = (file: File): ValidationResult => { }
const generateUniqueId = (): string => { }
const calculateProcessingTime = (start: number, end: number): number => { }

// ✅ 상수 명명 - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const SUPPORTED_IMAGE_FORMATS = ['jpg', 'png', 'webp', 'avif'] as const
const DEFAULT_PROCESSING_OPTIONS: ProcessingOptions = { }

// ✅ 불린 변수 - is/has/can/should 접두사
const isLoading = false
const hasError = false
const canProcess = true
const shouldOptimize = false

// ✅ 이벤트 핸들러 - handle + 이벤트명
const handleFileSelect = (files: FileList) => { }
const handleProcessingComplete = (result: ProcessingResult) => { }
const handleError = (error: Error) => { }

// ❌ 피해야 할 명명
const data = {} // 너무 일반적
const temp = '' // 임시 변수명 사용 금지
const flag = false // 의미 불분명
```

## ⚛️ **2. React 컴포넌트 표준**

### **📋 컴포넌트 구조 템플릿**
```tsx
// ✅ 표준 컴포넌트 구조
import React, { useState, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

// 1. 타입 정의
interface ComponentProps {
  readonly title: string
  readonly isLoading?: boolean
  readonly onAction?: (data: ActionData) => void
  readonly className?: string
}

interface ComponentState {
  isActive: boolean
  error: Error | null
}

// 2. 컴포넌트 정의
export const Component: React.FC<ComponentProps> = ({
  title,
  isLoading = false,
  onAction,
  className
}) => {
  // 3. 상태 정의
  const [state, setState] = useState<ComponentState>({
    isActive: false,
    error: null
  })
  
  // 4. 효과 및 콜백
  useEffect(() => {
    // 부수효과 로직
    return () => {
      // 정리 함수
    }
  }, [])
  
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    onAction?.(actionData)
  }, [onAction])
  
  // 5. 조건부 렌더링
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (state.error) {
    return <ErrorDisplay error={state.error} />
  }
  
  // 6. 메인 렌더링
  return (
    <div 
      className={clsx(
        'component-base-styles',
        state.isActive && 'active-styles',
        className
      )}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <button
        type="button"
        onClick={handleClick}
        className="btn-primary"
        disabled={isLoading}
      >
        Action Button
      </button>
    </div>
  )
}

// 7. displayName 설정 (개발 도구용)
Component.displayName = 'Component'

// 8. 기본값 내보내기
export default Component
```

### **🎣 Custom Hook 표준**
```typescript
// ✅ 표준 Hook 구조
interface UseFeatureOptions {
  enabled?: boolean
  onSuccess?: (data: FeatureData) => void
  onError?: (error: Error) => void
}

interface UseFeatureReturn {
  data: FeatureData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
  reset: () => void
}

export const useFeature = (
  options: UseFeatureOptions = {}
): UseFeatureReturn => {
  const { enabled = true, onSuccess, onError } = options
  
  const [state, setState] = useState<{
    data: FeatureData | null
    isLoading: boolean
    error: Error | null
  }>({
    data: null,
    isLoading: false,
    error: null
  })
  
  const refetch = useCallback(async () => {
    if (!enabled) return
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const data = await fetchFeatureData()
      setState({ data, isLoading: false, error: null })
      onSuccess?.(data)
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      setState(prev => ({ ...prev, isLoading: false, error: errorObj }))
      onError?.(errorObj)
    }
  }, [enabled, onSuccess, onError])
  
  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])
  
  useEffect(() => {
    refetch()
  }, [refetch])
  
  // 정리 함수 (필요시)
  useEffect(() => {
    return () => {
      // 구독 취소, 타이머 정리 등
    }
  }, [])
  
  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
    reset
  }
}
```

## 🗂️ **3. 상태 관리 (Zustand) 표준**

### **🏪 Store 구조 컨벤션**
```typescript
// ✅ 표준 Zustand Store 구조
interface AppState {
  // 상태 정의 (readonly 사용 권장)
  readonly currentImage: ImageInfo | null
  readonly detectedObjects: DetectedObject[]
  readonly isProcessing: boolean
  readonly error: Error | null
}

interface AppActions {
  // 액션 정의 (동사 형태)
  setCurrentImage: (image: ImageInfo | null) => void
  addDetectedObject: (object: DetectedObject) => void
  updateProcessingState: (isProcessing: boolean) => void
  setError: (error: Error | null) => void
  
  // 복합 액션
  resetState: () => void
  processImage: (options: ProcessingOptions) => Promise<void>
}

// Store 생성
const useAppStore = create<AppState & AppActions>((set, get) => ({
  // 초기 상태
  currentImage: null,
  detectedObjects: [],
  isProcessing: false,
  error: null,
  
  // 액션 구현
  setCurrentImage: (image) => set({ currentImage: image }),
  
  addDetectedObject: (object) => set((state) => ({
    detectedObjects: [...state.detectedObjects, object]
  })),
  
  updateProcessingState: (isProcessing) => set({ isProcessing }),
  
  setError: (error) => set({ error }),
  
  resetState: () => set({
    currentImage: null,
    detectedObjects: [],
    isProcessing: false,
    error: null
  }),
  
  processImage: async (options) => {
    const { currentImage } = get()
    if (!currentImage) {
      throw new Error('No image selected')
    }
    
    set({ isProcessing: true, error: null })
    
    try {
      // 처리 로직
      const result = await processImageWithAI(currentImage, options)
      set({ isProcessing: false })
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Processing failed')
      set({ isProcessing: false, error: errorObj })
      throw errorObj
    }
  }
}))

// 타입 안전한 셀렉터
export const selectCurrentImage = (state: AppState & AppActions) => state.currentImage
export const selectIsProcessing = (state: AppState & AppActions) => state.isProcessing
```

## 🎨 **4. 스타일링 (Tailwind CSS) 표준**

### **🏗️ CSS 클래스 조직화**
```tsx
// ✅ clsx를 사용한 조건부 클래스
const buttonClasses = clsx(
  // 기본 스타일
  'px-4 py-2 rounded-lg font-medium transition-colors',
  
  // 변형별 스타일
  {
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
    'bg-transparent text-blue-600 hover:bg-blue-50': variant === 'ghost'
  },
  
  // 상태별 스타일
  {
    'opacity-50 cursor-not-allowed': disabled,
    'ring-2 ring-blue-500': focused
  },
  
  // 크기별 스타일
  {
    'text-sm px-3 py-1.5': size === 'small',
    'text-base px-4 py-2': size === 'medium',
    'text-lg px-6 py-3': size === 'large'
  },
  
  // 추가 클래스
  className
)

// ✅ Tailwind 유틸리티 조합 패턴
const cardStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6'
const inputStyles = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
const buttonPrimaryStyles = 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
```

### **📐 반응형 디자인 표준**
```tsx
// ✅ 모바일 우선 반응형 디자인
<div className={clsx(
  // 모바일 기본값
  'flex flex-col p-4 space-y-4',
  
  // 태블릿 (768px+)
  'md:flex-row md:space-y-0 md:space-x-6 md:p-6',
  
  // 데스크톱 (1024px+)
  'lg:p-8 lg:space-x-8',
  
  // 큰 화면 (1280px+)
  'xl:max-w-7xl xl:mx-auto'
)}>
  {/* 콘텐츠 */}
</div>

// ✅ 컨테이너 크기 표준
const containerSizes = {
  'max-w-sm',    // 384px
  'max-w-md',    // 448px  
  'max-w-lg',    // 512px
  'max-w-xl',    // 576px
  'max-w-2xl',   // 672px
  'max-w-4xl',   // 896px
  'max-w-6xl',   // 1152px
  'max-w-7xl',   // 1280px
} as const
```

## 🔧 **5. 유틸리티 함수 표준**

### **🛠️ 유틸리티 함수 패턴**
```typescript
// ✅ 순수 함수 (Pure Functions)
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// ✅ 타입 가드 함수
export const isValidImageFile = (file: unknown): file is File => {
  return file instanceof File && file.type.startsWith('image/')
}

export const isProcessingResult = (result: unknown): result is ProcessingResult => {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    'processedImage' in result
  )
}

// ✅ 에러 처리 유틸리티
export const createErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unknown error occurred'
}

export const withErrorHandling = async <T>(
  promise: Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await promise
  } catch (error) {
    console.error('Operation failed:', error)
    return fallback
  }
}
```

## 🧪 **6. 테스트 코드 표준**

### **✅ 유닛 테스트 패턴**
```typescript
// ✅ 표준 테스트 구조
describe('validateImageFile', () => {
  describe('when file is valid', () => {
    it('should return success result for JPEG file', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      
      const result = validateImageFile(mockFile)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
    
    it('should return success result for PNG file', () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' })
      
      const result = validateImageFile(mockFile)
      
      expect(result.valid).toBe(true)
    })
  })
  
  describe('when file is invalid', () => {
    it('should return error for unsupported file type', () => {
      const mockFile = new File([''], 'test.txt', { type: 'text/plain' })
      
      const result = validateImageFile(mockFile)
      
      expect(result.valid).toBe(false)
      expect(result.errors[0].code).toBe('INVALID_FORMAT')
    })
    
    it('should return error for file too large', () => {
      const mockFile = new File(['x'.repeat(100 * 1024 * 1024)], 'huge.jpg', { 
        type: 'image/jpeg' 
      })
      
      const result = validateImageFile(mockFile)
      
      expect(result.valid).toBe(false)
      expect(result.errors[0].code).toBe('FILE_TOO_LARGE')
    })
  })
})
```

### **⚛️ React 컴포넌트 테스트**
```typescript
// ✅ React 컴포넌트 테스트 패턴
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUploader } from './ImageUploader'

describe('ImageUploader', () => {
  const defaultProps = {
    onFileSelect: jest.fn(),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['image/jpeg', 'image/png']
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should render upload zone', () => {
    render(<ImageUploader {...defaultProps} />)
    
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /select files/i })).toBeInTheDocument()
  })
  
  it('should handle file selection', async () => {
    const user = userEvent.setup()
    render(<ImageUploader {...defaultProps} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText(/file input/i)
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(defaultProps.onFileSelect).toHaveBeenCalledWith([file])
    })
  })
  
  it('should show error for invalid file', async () => {
    const user = userEvent.setup()
    render(<ImageUploader {...defaultProps} />)
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText(/file input/i)
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()
    })
  })
})
```

## 📝 **7. 주석 및 문서화 표준**

### **📚 JSDoc 주석 컨벤션**
```typescript
/**
 * 이미지 파일의 유효성을 검증합니다.
 * 
 * @param file - 검증할 파일 객체
 * @param options - 검증 옵션
 * @param options.maxSize - 최대 파일 크기 (bytes)
 * @param options.allowedTypes - 허용되는 MIME 타입 목록
 * 
 * @returns 검증 결과 객체
 * @returns result.valid - 검증 성공 여부
 * @returns result.errors - 검증 오류 목록
 * 
 * @example
 * ```typescript
 * const file = new File([''], 'image.jpg', { type: 'image/jpeg' })
 * const result = validateImageFile(file, {
 *   maxSize: 10 * 1024 * 1024, // 10MB
 *   allowedTypes: ['image/jpeg', 'image/png']
 * })
 * 
 * if (result.valid) {
 *   console.log('파일이 유효합니다')
 * } else {
 *   console.error('검증 오류:', result.errors)
 * }
 * ```
 * 
 * @throws {Error} 파일 객체가 null이거나 undefined인 경우
 */
export function validateImageFile(
  file: File,
  options: ValidationOptions
): ValidationResult {
  // 구현 코드
}
```

### **💬 인라인 주석 가이드라인**
```typescript
// ✅ 좋은 주석 - 왜(Why)를 설명
// MediaPipe 모델은 RGB 형식만 지원하므로 RGBA를 RGB로 변환
const rgbData = convertRGBAToRGB(imageData)

// GPU 메모리 부족을 방지하기 위해 이미지 크기 제한
if (image.width * image.height > MAX_PIXELS) {
  image = resizeImage(image, MAX_PIXELS)
}

// TODO: v2에서 WebP 애니메이션 지원 추가 예정
// FIXME: Safari에서 AVIF 지원 확인 필요
// HACK: Chrome 버그 우회를 위한 임시 해결책

// ❌ 나쁜 주석 - 무엇(What)을 반복
// 파일 크기를 확인한다
if (file.size > MAX_SIZE) {
  // 에러를 던진다
  throw new Error('File too large')
}
```

---

## ✅ **개발표준 준수 체크리스트**

### **🔍 코드 리뷰 체크리스트**
```markdown
### 📝 코드 품질
- [ ] TypeScript 엄격 모드 통과
- [ ] ESLint 규칙 모두 준수
- [ ] Prettier 포맷팅 적용
- [ ] JSDoc 주석 작성 (public API)
- [ ] 의미있는 변수/함수명 사용

### ⚛️ React 컴포넌트
- [ ] Props 인터페이스 정의
- [ ] 적절한 메모이제이션 적용
- [ ] 접근성 속성 추가
- [ ] 에러 바운더리 고려
- [ ] 키보드 네비게이션 지원

### 🧪 테스트
- [ ] 유닛 테스트 커버리지 80% 이상
- [ ] 에지 케이스 테스트 포함
- [ ] 모킹 전략 적절히 적용
- [ ] 테스트 이름이 의도를 명확히 표현

### 🚀 성능
- [ ] 불필요한 렌더링 방지
- [ ] 메모리 누수 없음
- [ ] 번들 사이즈 최적화
- [ ] Core Web Vitals 기준 충족

### ♿ 접근성
- [ ] ARIA 라벨 적절히 사용
- [ ] 키보드만으로 조작 가능
- [ ] 색상 대비 기준 충족
- [ ] 스크린 리더 지원
```

### **📋 배포 전 최종 체크리스트**
```markdown
### 🔧 기술적 검증
- [ ] 모든 테스트 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 보안 취약점 스캔 완료
- [ ] 성능 벤치마크 기준 충족
- [ ] 브라우저 호환성 테스트 완료

### 📱 사용자 경험
- [ ] 주요 사용자 시나리오 테스트
- [ ] 모바일 디바이스 테스트
- [ ] 네트워크 속도별 테스트
- [ ] 접근성 도구 검증
- [ ] 사용자 피드백 반영

### 📈 모니터링
- [ ] 에러 추적 도구 설정
- [ ] 성능 모니터링 설정
- [ ] 사용자 분석 도구 설정
- [ ] 알림 시스템 구성
```

---

## 🎯 **Claude Code 개발 최적화 팁**

### **🔥 효율적인 개발 전략**
```markdown
### 📋 단계별 체크리스트 활용
1. 🎯 기능 정의 → 체크리스트 확인
2. 🏗️ 구현 → 코딩 컨벤션 준수
3. 🧪 테스트 → 테스트 표준 적용
4. 🔍 리뷰 → 리뷰 체크리스트 활용
5. 🚀 배포 → 배포 체크리스트 완료

### ⚡ Claude Code 최적화
- 명확한 요구사항 → 구체적인 체크리스트 항목
- 타입 안전성 → TypeScript 엄격 모드
- 일관된 코드 스타일 → 자동화된 린팅
- 체계적인 테스트 → 테스트 템플릿 활용
```

---

## 🚀 **개발 준비 완료!**

이 개발표준 문서로 **Claude Code에서 일관되고 고품질인 개발**이 가능합니다:

✅ **체계적인 진행** - 단계별 체크리스트로 누락 방지  
✅ **일관된 코드** - 표준화된 컨벤션으로 유지보수성 향상  
✅ **높은 품질** - 엄격한 타입 체크와 테스트 기준  
✅ **효율적인 협업** - 명확한 표준으로 팀워크 향상  
✅ **확장성 고려** - MVP 통합을 위한 모듈러 구조  

**🎯 이제 완전한 Magic Photo Editor 문서 세트가 준비되었습니다!**

### **📚 전체 문서 목록**
1. ✅ **기술 명세서** - 아키텍처 및 기술 스택
2. ✅ **컴포넌트 설계서** - React 구조 완전 정의  
3. ✅ **API 설계 문서** - 함수/클래스 인터페이스
4. ✅ **데이터 흐름도** - 상태 관리 및 비동기 처리
5. ✅ **품질보장 문서** - 에러처리 + 테스트 + 성능최적화
6. ✅ **개발표준 문서** - 체크리스트 + 코딩 컨벤션

**🔥 Claude Code에서 바로 개발 시작하세요!** 🚀