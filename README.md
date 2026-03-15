# LoveHate 웹 게임 플랫폼

아이들을 위한 교육 웹 게임 플랫폼입니다. 글씨 드론, 로봇 조종, 네비게이션 등 다양한 웹 게임을 브라우저에서 제공합니다. Next.js 14와 Stripe 결제 시스템을 사용합니다.

## 주요 기능

- 🎨 현대적인 반응형 디자인
- 💳 Stripe 결제 시스템 통합
- 📱 모바일 최적화
- 🚀 빠른 로딩 속도 (Next.js 14)
- ✨ 부드러운 애니메이션 (Framer Motion)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 Stripe 키를 입력하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 다음 정보를 입력하세요:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe 공개 키
- `STRIPE_SECRET_KEY`: Stripe 비밀 키
- `STRIPE_WEBHOOK_SECRET`: Stripe 웹훅 시크릿 (선택사항)

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:5000](http://localhost:5000)을 열어 확인하세요.

## 배포

### Vercel (추천)

1. [Vercel](https://vercel.com)에 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포 완료!

### Netlify

1. [Netlify](https://netlify.com)에 계정 생성
2. 저장소 연결
3. 빌드 명령어: `npm run build`
4. 배포 디렉토리: `.next`

### 수동 배포

```bash
npm run build
npm start
```

## Stripe 설정

### 1. Stripe 계정 생성

[Stripe](https://stripe.com)에서 계정을 생성하세요.

### 2. 제품 및 가격 생성

Stripe 대시보드에서 다음 제품을 생성하세요:
- 월간 구독: ₩2,900/월

제품의 Price ID를 `components/Pricing.tsx`의 `priceId`에 입력하세요.

### 3. 웹훅 설정

1. Stripe 대시보드 > 개발자 > 웹훅
2. 엔드포인트 추가: `https://yourdomain.com/api/webhook`
3. 이벤트 선택: `checkout.session.completed`, `customer.subscription.deleted`
4. 웹훅 시크릿을 `.env.local`에 추가

## 파일 구조

```
├── app/
│   ├── api/              # API 라우트
│   │   ├── create-checkout-session/  # 결제 세션 생성
│   │   ├── webhook/                  # Stripe 웹훅
│   │   └── verify-session/           # 결제 확인
│   ├── success/          # 결제 성공 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 홈페이지
│   └── globals.css       # 전역 스타일
├── components/            # React 컴포넌트
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   ├── PaymentButton.tsx
│   ├── Download.tsx      # 웹에서 플레이 섹션
│   └── Footer.tsx
└── public/               # 정적 파일
```

## 웹 게임 플랫폼

- **웹 브라우저**: PC, 스마트폰, 태블릿에서 다운로드 없이 플레이
- **구독제**: 월 2,900원으로 모든 웹 게임 이용

## 호스팅 추천

### 무료 옵션
- **Vercel**: Next.js 최적화, 자동 배포, 무료 플랜 제공
- **Netlify**: 정적 사이트 호스팅, 무료 플랜 제공
- **GitHub Pages**: 무료, 간단한 설정

### 유료 옵션
- **AWS**: 확장성 높음, 사용량 기반 과금
- **Google Cloud**: 안정적, 다양한 서비스
- **Azure**: 엔터프라이즈급 기능

## 라이선스

MIT


