# 여러 Git 저장소에 푸시하기

## 방법 1: 여러 원격 저장소 추가 (권장)

### 저장소 추가

```bash
# 첫 번째 저장소 (기본)
git remote add origin https://github.com/playwithhear/lovehate.git

# 두 번째 저장소 추가
git remote add backup https://github.com/playwithhear/lovehate-backup.git

# 또는 다른 계정의 저장소
git remote add mirror https://github.com/other-account/lovehate.git
```

### 확인

```bash
git remote -v
```

출력 예시:
```
origin    https://github.com/playwithhear/lovehate.git (fetch)
origin    https://github.com/playwithhear/lovehate.git (push)
backup    https://github.com/playwithhear/lovehate-backup.git (fetch)
backup    https://github.com/playwithhear/lovehate-backup.git (push)
```

### 푸시 방법

#### 각각 따로 푸시
```bash
git push origin main
git push backup main
```

#### 한 번에 모두 푸시
```bash
git push --all origin
git push --all backup
```

또는 스크립트로:
```bash
git remote | xargs -I {} git push {} main
```

---

## 방법 2: 하나의 원격에 여러 URL 설정

### 여러 URL 추가

```bash
# 기존 origin에 추가 URL 추가
git remote set-url --add --push origin https://github.com/playwithhear/lovehate.git
git remote set-url --add --push origin https://github.com/playwithhear/lovehate-backup.git
```

### 확인

```bash
git remote -v
```

출력 예시:
```
origin    https://github.com/playwithhear/lovehate.git (fetch)
origin    https://github.com/playwithhear/lovehate.git (push)
origin    https://github.com/playwithhear/lovehate-backup.git (push)
```

### 푸시

```bash
git push origin main
```

이제 한 번의 명령으로 모든 저장소에 푸시됩니다!

---

## 방법 3: Git Alias 사용 (편리함)

### Alias 설정

```bash
# 여러 저장소에 한 번에 푸시하는 alias
git config --global alias.pushall '!git remote | xargs -I {} git push {}'
```

### 사용

```bash
git pushall main
```

---

## 실전 예시

### 시나리오: 메인 저장소 + 백업 저장소

```bash
# 1. 원격 저장소 추가
git remote add origin https://github.com/playwithhear/lovehate.git
git remote add backup https://github.com/playwithhear/lovehate-backup.git

# 2. 코드 변경 후 커밋
git add .
git commit -m "Update features"

# 3. 두 저장소에 모두 푸시
git push origin main
git push backup main
```

### 시나리오: 메인 + 미러 저장소 (자동)

```bash
# 1. origin에 여러 URL 설정
git remote set-url --add --push origin https://github.com/playwithhear/lovehate.git
git remote set-url --add --push origin https://github.com/other-account/lovehate-mirror.git

# 2. 한 번에 푸시
git push origin main
# → 두 저장소에 모두 자동으로 푸시됨!
```

---

## 저장소 제거

```bash
# 원격 저장소 제거
git remote remove backup

# 또는
git remote rm backup
```

---

## 추천 방법

**일반적인 경우**: 방법 1 (여러 원격 저장소)
- 명확하고 관리하기 쉬움
- 각 저장소를 개별적으로 제어 가능

**자동 백업이 필요한 경우**: 방법 2 (하나의 원격에 여러 URL)
- 한 번의 명령으로 모든 저장소에 푸시
- 실수로 하나만 푸시하는 것을 방지
