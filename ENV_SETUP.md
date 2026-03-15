# 환경 변수 설정 가이드

## Stripe 키 발급 방법

1. [Stripe 대시보드](https://dashboard.stripe.com)에 로그인
2. 개발자 > API 키 메뉴로 이동
3. 테스트 키 복사 (개발용) 또는 라이브 키 (운영용)

## 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Supabase (데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:5000
```

**Supabase 키 위치**: Supabase 대시보드 > Settings > API

### 비밀번호 재설정(이메일) 리다이렉트 URL

비밀번호 찾기 후 이메일 링크가 정상 동작하려면 Supabase 대시보드에서 리다이렉트 URL을 등록하세요.

- **Authentication > URL Configuration > Redirect URLs** 에 다음을 추가:
  - 개발: `http://localhost:3000/reset-password` (또는 사용 중인 포트)
  - 운영: `https://yourdomain.com/reset-password`

## Stripe 제품 및 가격 설정

1. Stripe 대시보드 > 제품 메뉴
2. 제품 추가:
   - **프리미엄 월간**: ₩9,900/월 (구독)
   - **연간 구독**: ₩99,000/년 (구독)
3. 각 제품의 Price ID를 복사
4. `components/Pricing.tsx` 파일의 `priceId`에 입력

## 웹훅 설정

1. Stripe 대시보드 > 개발자 > 웹훅
2. 엔드포인트 추가: `https://yourdomain.com/api/webhook`
3. 이벤트 선택:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. 웹훅 시크릿을 `.env.local`에 추가


