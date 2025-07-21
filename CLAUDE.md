# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DOGPANG** - 반려견을 위한 온라인 쇼핑몰 프로젝트

이 프로젝트는 개 용품 전문 e-commerce 웹사이트로, 사료, 간식, 장난감, 용품 등을 판매하는 플랫폼입니다.

## Project Structure

```
dog_website/
├── front/          # Vue 3 + TypeScript 프론트엔드 (메인 개발 영역)
├── backend/        # 백엔드 디렉토리 (향후 개발 예정)
├── ai/            # AI 기능 디렉토리 (향후 개발 예정)
└── CLAUDE.md      # 프로젝트 가이드
```

## Frontend Architecture (front/)

**핵심 기술 스택:**
- Vue 3.5+ with Composition API (`<script setup>`)
- TypeScript for type safety
- Vite for build tooling and development server
- Vue Router 4 for client-side routing
- Pinia for state management
- Vitest for unit testing with jsdom environment

**주요 폴더 구조:**
```
src/
├── types/          # TypeScript 타입 정의
├── stores/         # Pinia 스토어 (counter.ts → 장바구니, products.ts → 상품)
├── components/     # 재사용 가능한 컴포넌트
│   ├── ProductCard.vue     # 상품 카드 컴포넌트
│   └── AppHeader.vue       # 헤더 컴포넌트
├── views/          # 페이지 컴포넌트
├── api/           # API 서비스 레이어
└── router/        # 라우터 설정
```

## Product Categories (상품 카테고리)

현재 지원하는 상품 카테고리:
1. 🥘 사료 (food)
2. 🦴 간식 (treats)  
3. 🎾 장난감 (toys)
4. 🏠 용품 (supplies)
5. 👕 의류 (clothing)
6. 🧻 배변/위생 (hygiene)
7. 💊 건강관리 (health)
8. 🧴 목욕/미용 (grooming)
9. 🎽 산책/이동용 (walking)
10. 💯 100원샵 (sale)

## Key Components

1. **ProductCard.vue**: 상품 표시, 찜하기, 장바구니 담기 기능
2. **AppHeader.vue**: 로고, 검색, 네비게이션, 장바구니 아이콘 포함
3. **Cart Store**: 장바구니 상태 관리 (수량, 가격 계산 등)
4. **Products Store**: 상품 데이터, 찜 목록, 카테고리 관리

## Common Development Commands

`front/` 디렉토리에서 실행:

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크만 실행
npm run type-check

# 유닛 테스트 실행
npm run test:unit

# 린팅 (oxlint + eslint)
npm run lint

# 코드 포맷팅
npm run format

# 빌드 미리보기
npm run preview
```

## Routes Structure

주요 라우트:
- `/` - 홈페이지
- `/product/:id` - 상품 상세 페이지
- `/cart` - 장바구니 페이지
- `/login` - 로그인 페이지
- `/category/:category` - 카테고리별 상품 페이지
- `/about` - 회사소개 페이지

## Development Workflow

1. **메인 개발 영역**: `front/` 디렉토리에서 작업
2. **컴포넌트**: `src/components/`에 재사용 가능한 컴포넌트 생성
3. **페이지**: `src/views/`에 페이지별 컴포넌트 생성
4. **상태 관리**: Pinia 스토어는 `src/stores/`에서 관리
5. **API**: `src/api/`에서 백엔드 통신 로직 관리
6. **타입 정의**: `src/types/index.ts`에서 TypeScript 타입 정의

## Business Logic

- **장바구니**: 상품 추가/삭제/수량 변경, 총 가격 계산
- **찜하기**: 사용자가 관심 상품을 저장할 수 있는 기능
- **상품 검색**: 키워드, 카테고리별 필터링 및 정렬
- **반응형 디자인**: 모바일 대응 UI/UX

## Code Quality

- TypeScript strict mode 활성화
- ESLint + oxlint 이중 린팅 설정
- Prettier를 통한 일관된 코드 포맷팅
- 컴포넌트 기반 아키텍처로 재사용성 극대화