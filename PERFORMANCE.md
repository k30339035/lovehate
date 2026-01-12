# 성능 최적화 가이드

## 적용된 최적화

### 1. 동적 임포트 (Code Splitting)
- 무거운 컴포넌트를 동적 로딩하여 초기 번들 크기 감소
- Hero, Features, Pricing 등 컴포넌트 분리

### 2. 폰트 최적화
- Google Fonts에 `display: swap` 적용
- 폰트 로딩 중에도 텍스트 표시

### 3. Next.js 설정 최적화
- `compress: true` - Gzip 압축 활성화
- `swcMinify: true` - SWC로 빠른 빌드
- `optimizeCss: true` - CSS 최적화

### 4. 데이터베이스 연결 안전 처리
- 환경 변수가 없어도 에러 없이 동작
- Supabase 연결 실패 시 경고만 출력

### 5. Stripe 지연 로딩
- 결제 버튼 클릭 시에만 Stripe SDK 로드

## 성능 측정

### 목표
- **초기 로딩**: 2초 이내
- **First Contentful Paint (FCP)**: 1초 이내
- **Largest Contentful Paint (LCP)**: 2.5초 이내

### 확인 방법

1. **Chrome DevTools**
   - F12 > Network 탭
   - "Disable cache" 체크
   - 페이지 새로고침
   - 로딩 시간 확인

2. **Lighthouse**
   - F12 > Lighthouse 탭
   - "Performance" 선택
   - "Generate report" 클릭

3. **Next.js 빌드 분석**
   ```bash
   npm run build
   ```
   빌드 후 번들 크기 확인

## 추가 최적화 방법

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 형식 사용
- 적절한 크기로 리사이징

### 캐싱
- 정적 자산 캐싱
- API 응답 캐싱 (적절한 경우)

### CDN 사용
- Vercel 배포 시 자동 CDN 적용
- 정적 파일 CDN 배포

## 문제 해결

### 여전히 느린 경우

1. **네트워크 확인**
   - 인터넷 연결 속도 확인
   - VPN 사용 중인지 확인

2. **환경 변수 확인**
   - `.env.local` 파일이 올바르게 설정되었는지 확인
   - Supabase/Stripe 키가 유효한지 확인

3. **브라우저 캐시**
   - 하드 리프레시: Ctrl + Shift + R
   - 캐시 삭제

4. **개발 모드 vs 프로덕션**
   - 개발 모드는 느릴 수 있음
   - `npm run build && npm start`로 프로덕션 모드 테스트
