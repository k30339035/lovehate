# GitHub 푸시 가이드

## Personal Access Token 생성 방법

### 1. GitHub에서 토큰 생성

1. [GitHub.com](https://github.com) 로그인
2. 우측 상단 프로필 클릭 > **Settings**
3. 좌측 메뉴 하단 **Developer settings**
4. **Personal access tokens** > **Tokens (classic)**
5. **Generate new token** > **Generate new token (classic)** 클릭
6. **Note**: "LoveHate Project" 입력
7. **Expiration**: 원하는 기간 선택 (예: 90 days)
8. **Select scopes**: `repo` 체크박스 선택
9. 하단 **Generate token** 클릭
10. **토큰 복사** (한 번만 표시되므로 반드시 복사!)

### 2. 토큰으로 푸시

터미널에서 다음 명령어 실행:

```bash
git push -u origin main
```

**Username**: `playwithhear` 입력  
**Password**: 복사한 토큰 붙여넣기

---

## 방법 2: SSH 키 사용

### 1. SSH 키 생성 (이미 있다면 생략)

```bash
ssh-keygen -t ed25519 -C "stwo.kim@gmail.com"
```

엔터를 여러 번 눌러 기본값 사용

### 2. SSH 키 복사

```bash
cat ~/.ssh/id_ed25519.pub
```

출력된 내용 전체 복사

### 3. GitHub에 SSH 키 추가

1. GitHub > Settings > **SSH and GPG keys**
2. **New SSH key** 클릭
3. **Title**: "LoveHate Project" 입력
4. **Key**: 복사한 SSH 키 붙여넣기
5. **Add SSH key** 클릭

### 4. 원격 저장소를 SSH로 변경

```bash
git remote set-url origin git@github.com:playwithhear/lovehate.git
git push -u origin main
```

---

## 방법 3: GitHub Desktop 사용

1. [GitHub Desktop](https://desktop.github.com) 다운로드 및 설치
2. GitHub 계정으로 로그인
3. **File** > **Add Local Repository**
4. 프로젝트 폴더 선택: `C:\_proj\lovehate`
5. **Publish repository** 클릭

---

## 저장소 확인

저장소가 존재하는지 확인:
- https://github.com/playwithhear/lovehate

존재하지 않으면:
1. GitHub에서 새 저장소 생성
2. 저장소 이름: `lovehate`
3. Public 또는 Private 선택
4. README, .gitignore, license 추가하지 않기
5. 생성 후 위의 방법 중 하나로 푸시
