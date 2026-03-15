# 데이터베이스 설정 가이드

## Supabase 설정 (추천)

### 1. Supabase 계정 생성
1. [supabase.com](https://supabase.com) 접속
2. 무료 계정 생성
3. 새 프로젝트 생성

### 2. 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 SQL 실행:

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 구독 테이블
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL, -- active, cancelled, expired
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 결제 이력 테이블
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'krw',
  status TEXT NOT NULL, -- succeeded, failed, pending
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- 포인트 테이블 (SelectRobot 승리 포인트)
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE point_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points_delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_point_logs_user_id ON point_logs(user_id);
```

### 3. Authentication (회원가입/로그인) 활성화

Supabase 대시보드에서 **Authentication > Providers** 로 이동한 뒤:

- **Email** 을 켜기
- (선택) **Confirm email**: 켜면 가입 시 인증 메일 발송 후 로그인, 끄면 바로 로그인

이렇게 하면 `/signup`, `/login` 페이지에서 이메일·비밀번호로 회원가입/로그인이 동작합니다.

### 4. 환경 변수 설정

`.env.local` 파일에 추가:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## MongoDB Atlas 설정 (대안)

### 1. MongoDB Atlas 계정 생성
1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) 접속
2. 무료 클러스터 생성
3. 연결 문자열 복사

### 2. 환경 변수 설정

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Firebase 설정 (대안)

### 1. Firebase 프로젝트 생성
1. [firebase.google.com](https://firebase.google.com) 접속
2. 프로젝트 생성
3. Firestore Database 활성화

### 2. 환경 변수 설정

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_SDK_KEY=...
```
