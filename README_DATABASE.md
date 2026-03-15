# 데이터베이스 및 회원가입 시스템

## 데이터 저장 위치

회원가입 및 결제 정보는 **Supabase PostgreSQL 데이터베이스**에 저장됩니다.

### 저장되는 데이터

1. **사용자 정보** (`users` 테이블)
   - 이메일
   - 이름
   - 가입일시

2. **구독 정보** (`subscriptions` 테이블)
   - Stripe 고객 ID
   - Stripe 구독 ID
   - 플랜 이름
   - 구독 상태 (active, cancelled, expired)
   - 구독 기간

3. **결제 이력** (`payments` 테이블)
   - 결제 금액
   - 결제 상태
   - 결제일시

4. **포인트 정보** (`user_points`, `point_logs` 테이블)
   - 누적 포인트
   - 포인트 증감 로그 (승리 보상 등)

## 데이터 흐름

### 1. 회원가입
```
사용자 → POST /api/auth/register → Supabase users 테이블 저장
```

### 2. 결제 프로세스
```
1. 사용자가 결제 버튼 클릭
2. POST /api/create-checkout-session (이메일 포함)
3. Stripe 결제 페이지로 리다이렉트
4. 결제 완료 → Stripe 웹훅 → POST /api/webhook
5. 웹훅에서 Supabase에 구독 정보 저장
```

### 3. 구독 확인
```
GET /api/auth/check-subscription?email=user@example.com
→ Supabase에서 구독 정보 조회
```

### 4. SelectRobot 승리 포인트 처리
```
1. 사용자가 SelectRobot 게임 승리
2. POST /api/game/selectrobot/win (email, name?, points?)
3. users upsert (최소 정보)
4. user_points 누적 + point_logs 기록
```

## 설정 방법

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속
2. 무료 계정 생성
3. 새 프로젝트 생성

### 2. 데이터베이스 테이블 생성

Supabase 대시보드 > SQL Editor에서 `DATABASE_SETUP.md`의 SQL 실행

### 3. 환경 변수 설정

`.env.local` 파일에 추가:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**키 위치**: Supabase 대시보드 > Settings > API

### 4. 패키지 설치

```bash
npm install @supabase/supabase-js
```

## API 엔드포인트

### 회원가입
```typescript
POST /api/auth/register
Body: { email: string, name?: string }
```

### 구독 확인
```typescript
GET /api/auth/check-subscription?email=user@example.com
```

### 승리 포인트 지급
```typescript
POST /api/game/selectrobot/win
Body: { email: string, name?: string, points?: number }
```

### 포인트 조회
```typescript
GET /api/game/points?email=user@example.com
```

### 결제 세션 생성
```typescript
POST /api/create-checkout-session
Body: { priceId: string, planName: string, email: string }
```

## 보안 고려사항

1. **서비스 롤 키**: 서버 사이드에서만 사용 (환경 변수에 저장)
2. **익명 키**: 클라이언트 사이드에서 사용 (공개 가능)
3. **Row Level Security (RLS)**: 필요시 Supabase에서 활성화

## 데이터 확인 방법

Supabase 대시보드 > Table Editor에서 데이터 확인 가능
