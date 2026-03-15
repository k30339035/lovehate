# Vercel 배포 (단순 가이드)

매일 배포 = **코드 수정 → 푸시** 하면 끝입니다. Vercel이 자동으로 빌드·배포합니다.

---

## 한 번만 해두기 (최초 1회)

### 1. GitHub에 코드 올리기

- GitHub에 저장소 만든 뒤, 이 프로젝트를 `main` 브랜치로 푸시해 두기.

### 2. Vercel에 프로젝트 연결

1. [vercel.com](https://vercel.com) → GitHub으로 로그인
2. **Add New** → **Project** → 연결한 GitHub 저장소 선택
3. **Deploy** (설정은 기본값 그대로 두면 됨)

### 3. 환경 변수 넣기

Vercel 프로젝트 **Settings** → **Environment Variables** 에서  
로컬 `.env.local` 에 쓰는 값들을 그대로 복사해서 넣기.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- (Stripe 쓰면) `NEXT_PUBLIC_STRIPE_*`, `STRIPE_*` 등

저장 후 **Deployments** 에서 **Redeploy** 한 번 해 주기.

---

## 매일 배포하는 방법

수정한 뒤 아래만 하면 됩니다.

```bash
git add .
git commit -m "오늘 작업 내용"
git push
```

**끝.**  
`main` 브랜치에 푸시되면 Vercel이 알아서 빌드하고 배포합니다 (1~2분 정도).

- 배포 결과: Vercel 대시보드 **Deployments** 에서 확인
- 사이트 주소: `https://프로젝트이름.vercel.app`

---

## 문제 생겼을 때

- **빌드 실패** → Vercel **Deployments** 에서 해당 배포 클릭 → **Building** 로그 확인 (에러 메시지 보임)
- **환경 변수** 바꿨으면 **Settings** → **Environment Variables** 에서 수정 후 **Redeploy**

---

## 요약

| 할 일           | 언제        |
|----------------|-------------|
| GitHub 푸시    | **매일** (수정 후) |
| Vercel 설정/환경변수 | **최초 1회** |

매일은 **수정 → 커밋 → 푸시** 만 하면 됩니다.
