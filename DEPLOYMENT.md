# 배포 가이드

## Vercel 배포 (추천)

### 1. Vercel 계정 생성
- [vercel.com](https://vercel.com)에서 GitHub 계정으로 가입

### 2. 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. 환경 변수 추가:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL`
5. Deploy 클릭

### 3. 커스텀 도메인 설정 (선택사항)
- Vercel 대시보드 > Settings > Domains
- 도메인 추가 및 DNS 설정

## Netlify 배포

### 1. Netlify 계정 생성
- [netlify.com](https://netlify.com)에서 가입

### 2. 프로젝트 배포
1. "Add new site" > "Import an existing project"
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. 환경 변수 추가 (Site settings > Environment variables)
5. Deploy site 클릭

## 수동 배포 (서버)

### 1. 서버 준비
```bash
# Node.js 18+ 설치 확인
node --version

# 프로젝트 클론
git clone your-repo-url
cd lovehate-drone-website

# 의존성 설치
npm install

# 빌드
npm run build
```

### 2. PM2로 실행 (선택사항)
```bash
npm install -g pm2
pm2 start npm --name "lovehate-drone" -- start
pm2 save
pm2 startup
```

### 3. Nginx 설정 (예시)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 환경 변수 설정

배포 환경에서도 `.env.local` 파일을 생성하거나 플랫폼의 환경 변수 설정을 사용하세요.

## SSL 인증서

- Vercel/Netlify: 자동으로 SSL 제공
- 수동 배포: Let's Encrypt 사용
  ```bash
  sudo certbot --nginx -d yourdomain.com
  ```


