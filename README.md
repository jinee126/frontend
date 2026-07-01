# keymanage

# Description

## 1. Naming Convention

### 변수
- 소문자로 시작하는 camelCase 형태로 작성한다.
- boolean 변수는 접두사로 is를 사용한다.
- 배열 변수는 복수형을 사용한다.

### 상수
- 대문자로 작성하는 SCREAMING_SNAKE_CASE 사용한다.
- ex) AUTOEVER_REACT

### 함수
- 함수선언식 사용해서 구현한다.
- 컴포넌트 외의 함수는 소문자로 시작하며 카멜케이스 형태로 작성한다.
- method의 행위를 유추할 수 있는 동사를 포함한다. (ex. getName())
- API 연동의 경우 http method + action + 설명으로 명칭을 정한다.
- Boolean 타입의 응답을 반환하는 함수는 접두사로 is를 사용한다.
- 이벤트 함수는 handle을 접두사로 사용하고 이름만으로 의미를 알 수 있게 구성한다. (ex. handleClick)

### 폴더
- 파일 및 폴더명의 경우 kebab-case 형태로 작성한다.
- 라우팅 될 페이지 파일은 접미사로 page 사용한다.

## Directory

```txt
keymanage
├── public/           # 빌드 시 그대로 서빙되는 정적 파일
├── src/
│   ├── api/          # API 호출 로직 (HTTP client, endpoint 함수)
│   ├── assets/       # 이미지, 아이콘, 폰트 등 정적 리소스
│   ├── components/   # 재사용 가능한 UI 컴포넌트
│   ├── config/       # 환경/런타임 설정 값
│   ├── constants/    # 전역 상수 (SCREAMING_SNAKE_CASE)
│   ├── hooks/        # 공용 커스텀 훅
│   ├── layout/       # 레이아웃 컴포넌트 (Header, Sidebar 등)
│   ├── pages/        # 라우트 단위 페이지 컴포넌트
│   ├── queries/      # React Query 훅 (데이터 패칭/캐싱)
│   ├── schema/       # 데이터/폼 검증 스키마 (zod schema)
│   ├── stores/       # 전역 상태 관리
│   ├── styles/       # 전역 스타일, theme, reset
│   ├── types/        # TypeScript 타입 정의
│   └── utils/        # 유틸리티 함수
```
