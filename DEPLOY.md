# LoveHate 서비스 배포 가이드

lovehate를 실제 서비스로 올리기 위해 필요한 단계입니다. **Supabase**(DB + 선택적으로 Auth)와 **Stripe**(결제), **호스팅**(예: Vercel)을 연동해야 합니다.

---

## 1. Supabase 설정

### 1.1 프로젝트 생성

1. [Supabase](https://supabase.com) 로그인 후 **New project** 생성
2. 리전 선택(예: Northeast Asia (Seoul))
3. 데이터베이스 비밀번호 저장해 두기

### 1.2 테이블 생성

Supabase 대시보드 → **SQL Editor**에서 아래 쿼리 실행.

```sql
-- 사용자 테이블 (Stripe 결제 시 이메일 기준 생성/조회)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 구독 테이블
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 (서비스 롤은 RLS 우회 가능, 익명 접근은 막기)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 서버에서만 접근하므로 기본 정책: 아무도 select 불가 (API가 service_role로 접근)
CREATE POLICY "No direct access" ON users FOR ALL USING (false);
CREATE POLICY "No direct access" ON subscriptions FOR ALL USING (false);
```

### 1.3 API 키 확인

- **Project Settings** → **API**
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role** 키 → `SUPABASE_SERVICE_ROLE_KEY` (절대 클라이언트에 노출 금지)

---

## 2. Stripe 설정

### 2.1 상품/가격 생성

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Products** → **Add product**
2. 이름 예: "LoveHate 월간 구독", 가격 ₩2,900, **Recurring** 월간
3. 생성된 **Price ID**(`price_xxxx`) 복사

### 2.2 웹훅 설정

1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: 배포 후 URL 사용  
   예: `https://your-domain.com/api/webhook`
3. **Listen to**: 다음 이벤트 선택
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Signing secret** (`whsec_xxxx`) 복사 → `STRIPE_WEBHOOK_SECRET`

### 2.3 키 확인

- **Developers** → **API keys**
  - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - **Secret key** → `STRIPE_SECRET_KEY`

---

## 3. 환경 변수 정리

로컬: `.env.local`  
배포(예: Vercel): 프로젝트 **Settings** → **Environment Variables**

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role 키 (서버 전용) | `eyJ...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 공개 키 | `pk_live_...` 또는 `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe 비밀 키 | `sk_live_...` 또는 `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | 웹훅 서명 비밀 | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_ID` | 월간 구독 Stripe Price ID (선택, 아래 참고) | `price_xxxx` |
| `NEXT_PUBLIC_SUBWAY_GAME_URL` | 지하철 게임(subway) 배포 URL (lovehate에서 링크로 연결) | `https://subway-xxx.vercel.app` |

---

## 4. 코드에서 Price ID 사용 (선택)

현재 `Pricing.tsx`에서 `priceId: 'monthly_subscription'`처럼 하드코딩되어 있으면, Stripe 실제 Price ID로 바꿔야 합니다. 환경 변수로 두는 것을 권장합니다.

- **옵션 A**: `.env.local`에  
  `NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxx`  
  설정 후, `Pricing.tsx`의 `priceId`를  
  `process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'monthly_subscription'`  
  같이 사용
- **옵션 B**: 서버 API에서만 `STRIPE_PRICE_ID`를 읽고, 클라이언트에는 세션 생성 API만 호출하도록 구성

(원하면 이 부분은 실제 코드 수정 예시로 반영해 드릴 수 있습니다.)

---

## 5. 호스팅 배포 (Vercel 예시)

### 5.1 Vercel 배포

1. [Vercel](https://vercel.com) 로그인 후 **Add New** → **Project**
2. GitHub/GitLab 등에서 `lovehate` 저장소 연결 또는 **Import**로 로컬 폴더 업로드
3. **Root Directory**: `lovehate` (모노레포인 경우)
4. **Framework Preset**: Next.js
5. **Environment Variables**: 위 3번의 변수 모두 입력 (Production / Preview 구분해서 넣어도 됨)
6. **Deploy** 후 배포 URL 확인 (예: `https://lovehate-xxx.vercel.app`)

### 5.2 Stripe 웹훅 URL 업데이트

- 배포 URL이 정해지면 Stripe **Webhooks**에서  
  **Endpoint URL**을 `https://배포도메인/api/webhook` 로 설정/수정

### 5.3 (선택) 커스텀 도메인

- Vercel 프로젝트 **Settings** → **Domains**에서 도메인 추가 후 DNS 설정

---

## 6. 배포 후 확인

1. **사이트 접속**  
   - 메인, 가격, 구독하기 버튼 동작 확인
2. **테스트 결제**  
   - Stripe **Test mode**로 한 번 결제 후  
     Supabase **Table Editor**에서 `users`, `subscriptions` 행 생성 여부 확인
3. **웹훅**  
   - Stripe **Webhooks** → 해당 엔드포인트 → **Recent deliveries**에서 성공(200) 여부 확인

---

## 요약 체크리스트

- [ ] Supabase 프로젝트 생성 및 `users`, `subscriptions` 테이블 생성
- [ ] Supabase URL + anon key + service_role key 환경 변수 설정
- [ ] Stripe 상품/가격 생성 후 Price ID 확인
- [ ] Stripe 웹훅 등록 (배포 URL 기준) 및 signing secret 설정
- [ ] Stripe Publishable key / Secret key 환경 변수 설정
- [ ] `priceId`를 실제 Stripe Price ID로 변경(또는 env 사용)
- [ ] Vercel(또는 사용할 호스팅)에 환경 변수 입력 후 배포
- [ ] 배포 URL로 Stripe 웹훅 URL 최종 반영
- [ ] 테스트 결제 한 번 진행 후 DB·웹훅 확인

이 순서대로 진행하면 lovehate를 Supabase + Stripe로 서비스 가능한 상태로 올릴 수 있습니다.
