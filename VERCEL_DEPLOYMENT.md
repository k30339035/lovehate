# Vercel 자동 배포 가이드

## 자동 배포 설정

### 1. GitHub 저장소 준비

1. GitHub에 저장소 생성 (예: `lovehate-games`)
2. 로컬 프로젝트를 Git에 커밋하고 푸시:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/lovehate-games.git
git push -u origin main
```

### 2. Vercel 계정 생성 및 연결

1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" 클릭 → GitHub 계정으로 로그인
3. "Add New Project" 클릭
4. GitHub 저장소 선택
5. "Import" 클릭

### 3. 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다. 다음 설정을 확인하세요:

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정)
- **Output Directory**: `.next` (자동 설정)
- **Install Command**: `npm install` (자동 설정)

### 4. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 추가하세요:

**Settings > Environment Variables**에서 추가:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pycfplcegifwgempwrwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Next.js
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**참고**: 
- 프로덕션 환경에는 `pk_live_`, `sk_live_` 키 사용
- 개발 환경에는 `pk_test_`, `sk_test_` 키 사용
- 각 환경별로 변수를 설정할 수 있습니다 (Production, Preview, Development)

### 5. 배포

"Deploy" 버튼을 클릭하면 자동으로 배포가 시작됩니다.

## 자동 배포 작동 방식

### Git Push 시 자동 배포

1. **main 브랜치에 푸시** → 프로덕션 배포
2. **다른 브랜치에 푸시** → Preview 배포 (임시 URL 생성)
3. **Pull Request 생성** → Preview 배포

### 배포 프로세스

```
Git Push → Vercel 감지 → 빌드 시작 → 환경 변수 주입 → 배포 → 완료
```

## 배포 후 확인

### 1. 배포 상태 확인

- Vercel 대시보드 > Deployments에서 배포 상태 확인
- 빌드 로그 확인 가능

### 2. 도메인 확인

배포 완료 후 다음 URL로 접속:
- 프로덕션: `https://your-project.vercel.app`
- Preview: `https://your-project-git-branch.vercel.app`

### 3. 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드 > Settings > Domains
2. "Add Domain" 클릭
3. 도메인 입력 (예: `lovehate-games.com`)
4. DNS 설정 안내에 따라 도메인 제공자에서 설정

## 환경 변수 관리

### 프로덕션 vs 개발

- **Production**: 실제 서비스용 (라이브 키 사용)
- **Preview**: PR/브랜치용 (테스트 키 사용 가능)
- **Development**: 로컬 개발용 (`.env.local` 사용)

### 환경 변수 업데이트

1. Vercel 대시보드 > Settings > Environment Variables
2. 변수 수정 또는 추가
3. "Redeploy" 클릭하여 재배포

## Stripe 웹훅 설정

배포 후 Stripe 웹훅을 설정하세요:

1. Stripe 대시보드 > 개발자 > 웹훅
2. "Add endpoint" 클릭
3. 엔드포인트 URL 입력: `https://your-project.vercel.app/api/webhook`
4. 이벤트 선택:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. 웹훅 시크릿 복사
6. Vercel 환경 변수에 `STRIPE_WEBHOOK_SECRET` 추가

## 문제 해결

### 빌드 실패

1. **환경 변수 확인**: 모든 필수 환경 변수가 설정되었는지 확인
2. **빌드 로그 확인**: Vercel 대시보드에서 빌드 로그 확인
3. **로컬 빌드 테스트**: `npm run build`로 로컬에서 빌드 테스트

### 환경 변수 누락

- `.env.local`은 Git에 커밋되지 않음
- Vercel 대시보드에서 직접 설정해야 함

### 배포 속도

- 첫 배포: 2-3분 소요
- 이후 배포: 변경사항에 따라 1-2분 소요
- Vercel은 자동으로 캐싱하여 빌드 속도 향상

## CI/CD 워크플로우

```
개발 → Git Commit → Git Push → Vercel 자동 감지 → 빌드 → 배포 → 완료
```

**자동화된 프로세스**:
- 코드 변경 시 자동 배포
- 빌드 실패 시 알림
- Preview 배포로 테스트 가능
- 프로덕션 배포 전 검토 가능

## 추가 팁

### 1. 배포 알림 설정

- Vercel 대시보드 > Settings > Notifications
- 이메일 또는 Slack 알림 설정

### 2. 성능 모니터링

- Vercel 대시보드 > Analytics
- 페이지뷰, 성능 메트릭 확인

### 3. 롤백

- 배포 실패 시 이전 버전으로 자동 롤백
- 수동 롤백: Deployments > 이전 배포 선택 > "Promote to Production"
