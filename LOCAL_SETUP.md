# 로컬 개발 환경 설정 가이드

## 1단계: Node.js 설치 확인

PowerShell에서 다음 명령어로 Node.js가 설치되어 있는지 확인하세요:

```powershell
node --version
npm --version
```

Node.js가 설치되어 있지 않다면 [nodejs.org](https://nodejs.org)에서 다운로드하세요.
(권장 버전: Node.js 18 이상)

## 2단계: 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```powershell
npm install
```

이 명령어는 `package.json`에 정의된 모든 패키지를 설치합니다.

## 3단계: 환경 변수 설정 (선택사항)

결제 기능을 테스트하려면 Stripe 키가 필요하지만, **홈페이지 레이아웃만 확인하려면 생략 가능**합니다.

환경 변수를 설정하려면:

1. 프로젝트 루트에 `.env.local` 파일 생성
2. 다음 내용 추가:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:5000
```

**참고**: Stripe 키 없이도 홈페이지는 정상적으로 표시되지만, 결제 버튼은 작동하지 않습니다.

## 4단계: 개발 서버 실행

다음 명령어로 개발 서버를 시작하세요:

```powershell
npm run dev
```

서버가 시작되면 다음과 같은 메시지가 표시됩니다:

```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:5000
  - ready started server on 0.0.0.0:5000
```

## 5단계: 브라우저에서 확인

브라우저를 열고 다음 주소로 접속하세요:

**http://localhost:5000**

## 개발 팁

### 핫 리로드
- 파일을 수정하면 자동으로 브라우저가 새로고침됩니다
- 서버를 중지하려면 `Ctrl + C`를 누르세요

### 프로덕션 빌드 테스트
실제 배포 환경과 동일하게 테스트하려면:

```powershell
npm run build
npm start
```

이렇게 하면 프로덕션 모드로 빌드되어 실행됩니다.

### 포트 변경
기본 포트는 5000번입니다. 다른 포트를 사용하려면:

```powershell
npm run dev -- -p 3000
```

## 문제 해결

### 포트가 이미 사용 중인 경우
다른 포트를 사용하거나, 3000번 포트를 사용하는 프로세스를 종료하세요.

### 모듈을 찾을 수 없는 오류
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### 빌드 오류
TypeScript 오류가 발생하면:
```powershell
npm run lint
```

## 다음 단계

로컬에서 확인이 완료되면:
1. 변경사항을 Git에 커밋
2. GitHub에 푸시
3. Vercel에 배포
