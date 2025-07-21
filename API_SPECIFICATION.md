# DOGPANG API 명세서

**프로젝트**: 반려견 용품 쇼핑몰 DOGPANG  
**버전**: 1.0.0  
**최종 업데이트**: 2024년 12월

## 목차
1. [개요](#개요)
2. [Frontend API](#frontend-api)
3. [Backend API](#backend-api)
4. [AI ChatBot API](#ai-chatbot-api)
5. [통합 워크플로우](#통합-워크플로우)
6. [보안 및 인증](#보안-및-인증)
7. [에러 처리](#에러-처리)

---

## 개요

DOGPANG은 다음 3개의 주요 컴포넌트로 구성됩니다:
- **Frontend**: Vue 3 + TypeScript 기반 사용자 인터페이스
- **Backend**: RESTful API 서버 (Python/Node.js 예상)
- **AI ChatBot**: 반려동물 상담 및 상품 추천 AI 서비스

---

## Frontend API

### 1. 상품 관리 (Products)

#### 1.1 상품 검색
```typescript
// Frontend Service: productApi.search()
POST /api/products/search
Content-Type: application/json

Request Body:
{
  "query": string,           // 검색 키워드
  "category": string,        // 카테고리 ID
  "sort": "popular" | "price_low" | "price_high" | "newest" | "reviews",
  "price_range": "all" | "under10k" | "10k-30k" | "30k-50k" | "over50k",
  "brand": string,           // 브랜드명
  "page": number,            // 페이지 번호 (기본값: 1)
  "limit": number            // 페이지당 상품 수 (기본값: 20)
}

Response:
{
  "success": boolean,
  "data": Product[],
  "total": number,           // 전체 상품 수
  "page": number,
  "limit": number,
  "message": string
}
```

#### 1.2 상품 상세 조회
```typescript
// Frontend Service: productApi.getById()
GET /api/products/:id

Response:
{
  "success": boolean,
  "data": {
    "id": number,
    "name": string,
    "brand": string,
    "price": number,
    "originalPrice": number,
    "discountRate": number,
    "rating": number,
    "reviewCount": number,
    "image": string,
    "badge": string,
    "category": string,
    "description": string,
    "inStock": boolean,
    "images": string[],       // 추가 상품 이미지
    "specifications": object, // 상품 상세 스펙
    "reviews": Review[]       // 최근 리뷰 5개
  }
}
```

#### 1.3 카테고리별 상품
```typescript
// Frontend Service: productApi.getByCategory()
GET /api/products/category/:category?page=1&limit=20

Response:
{
  "success": boolean,
  "data": Product[],
  "total": number,
  "page": number,
  "limit": number
}
```

### 2. 장바구니 관리 (Cart)

#### 2.1 장바구니 조회
```typescript
// Frontend Service: cartApi.get()
GET /api/cart
Authorization: Bearer {token}

Response:
{
  "success": boolean,
  "data": CartItem[]
}
```

#### 2.2 장바구니에 상품 추가
```typescript
// Frontend Service: cartApi.addItem()
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "product_id": number,
  "quantity": number
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "cart_item_id": number,
    "total_items": number,
    "total_price": number
  }
}
```

---

## Backend API

### 1. 사용자 인증 및 관리

#### 1.1 회원가입
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": string,
  "password": string,
  "name": string,
  "phone": string,
  "marketing_consent": boolean
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "user_id": number,
    "email": string,
    "name": string,
    "access_token": string,
    "refresh_token": string,
    "expires_in": number
  }
}
```

#### 1.2 로그인
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": string,
  "password": string,
  "remember_me": boolean
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "user_id": number,
    "email": string,
    "name": string,
    "access_token": string,
    "refresh_token": string,
    "expires_in": number
  }
}
```

### 2. 주문 관리

#### 2.1 주문 생성
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "cart_items": number[],    // 장바구니 아이템 ID 배열
  "shipping_address": {
    "name": string,
    "phone": string,
    "zip_code": string,
    "address1": string,
    "address2": string
  },
  "payment_method": "card" | "bank_transfer" | "virtual_account",
  "delivery_request": string
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "order_id": string,
    "total_amount": number,
    "payment_url": string,    // 결제 페이지 URL
    "estimated_delivery": string
  }
}
```

### 3. 상품 관리 (관리자)

#### 3.1 상품 등록
```http
POST /api/admin/products
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Request Body:
{
  "name": string,
  "brand": string,
  "category": string,
  "price": number,
  "original_price": number,
  "description": string,
  "specifications": object,
  "stock_quantity": number,
  "images": File[]           // 상품 이미지 파일들
}

Response:
{
  "success": boolean,
  "message": string,
  "data": {
    "product_id": number,
    "name": string,
    "status": "active" | "inactive"
  }
}
```

---

## AI ChatBot API

### 1. 챗봇 대화

#### 1.1 채팅 세션 시작
```http
POST /api/chatbot/sessions
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "user_id": number,
  "context": {
    "current_page": string,   // 현재 페이지 정보
    "cart_items": CartItem[], // 현재 장바구니 상품
    "viewed_products": number[] // 최근 본 상품 ID
  }
}

Response:
{
  "success": boolean,
  "data": {
    "session_id": string,
    "welcome_message": string,
    "suggested_questions": string[]
  }
}
```

#### 1.2 메시지 전송
```http
POST /api/chatbot/message
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "session_id": string,
  "message": string,
  "message_type": "text" | "image" | "voice",
  "attachments": {
    "current_product_id": number, // 현재 보고 있는 상품 ID
    "image": string              // Base64 인코딩된 이미지 (선택사항)
  }
}

Response:
{
  "success": boolean,
  "data": {
    "response": string,
    "response_type": "text" | "product_info" | "general_help",
    "products": Product[],    // 관련 상품 (해당하는 경우)
    "quick_replies": string[], // 빠른 답변 버튼
    "helpful_info": {        // 도움 정보 (해당하는 경우)
      "title": string,
      "content": string,
      "links": string[]
    }
  }
}
```

### 2. 상품 문의

#### 2.1 상품 관련 질문
```http
POST /api/chatbot/product-inquiry
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "session_id": string,
  "product_id": number,     // 문의할 상품 ID
  "question": string,       // 사용자 질문
  "question_type": "spec" | "usage" | "delivery" | "general"
}

Response:
{
  "success": boolean,
  "data": {
    "answer": string,
    "related_products": Product[], // 관련 상품 (선택사항)
    "helpful_links": {      // 도움이 될 수 있는 링크
      "user_manual": string,
      "size_guide": string,
      "care_instructions": string
    }
  }
}
```

---

## 통합 워크플로우

### 1. 사용자 쇼핑 여정

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant AI as AI ChatBot
    
    F->>B: 1. 상품 검색 요청
    B->>F: 2. 상품 목록 응답
    F->>AI: 3. 챗봇 세션 시작 (컨텍스트 포함)
    AI->>F: 4. 환영 메시지 + 추천 질문
    F->>AI: 5. "이 상품에 대해 자세히 알려줘"
    AI->>B: 6. 상품 정보 요청
    B->>AI: 7. 상품 상세 정보
    AI->>F: 8. 상품 설명 + 관련 정보
    F->>B: 11. 선택한 상품 장바구니 추가
    B->>F: 12. 장바구니 업데이트 확인
```

### 2. AI 챗봇 상담 플로우

1. **상담 세션 초기화**
   - Frontend에서 사용자 컨텍스트 (현재 페이지, 장바구니 등) 수집
   - AI 챗봇 세션 시작 및 환영 메시지 표시

2. **상품 문의 처리**
   - 사용자 질문 분석 및 카테고리 분류
   - Backend에서 관련 상품 정보 조회
   - 적절한 답변 생성 및 관련 상품 제안

3. **일반 상담 지원**
   - 주문, 배송, 교환/반품 관련 문의 처리
   - FAQ 기반 자동 응답 제공
   - 필요시 고객센터 연결 안내

---

## 보안 및 인증

### 1. JWT 토큰 기반 인증
```javascript
// Frontend에서 API 호출 시 헤더 설정
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

### 2. API 키 기반 인증 (AI 서비스)
```javascript
// AI API 호출 시
headers: {
  'X-API-Key': 'your-ai-api-key',
  'Authorization': `Bearer ${accessToken}`
}
```

### 3. CORS 설정
```javascript
// Backend CORS 설정
{
  origin: ['https://dogpang.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}
```

---

## 에러 처리

### 1. 표준 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "요청하신 상품을 찾을 수 없습니다.",
    "details": {
      "product_id": 12345,
      "timestamp": "2024-12-22T10:30:00Z"
    }
  }
}
```

### 2. HTTP 상태 코드
- `200`: 성공
- `201`: 리소스 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `429`: 요청 한도 초과
- `500`: 서버 내부 오류

### 3. Frontend 에러 처리
```typescript
// Frontend에서 API 에러 처리 예시
try {
  const response = await productApi.search(filters);
  return response.data;
} catch (error) {
  if (error.response?.status === 404) {
    showToast('상품을 찾을 수 없습니다.');
  } else if (error.response?.status === 500) {
    showToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } else {
    showToast('알 수 없는 오류가 발생했습니다.');
  }
  throw error;
}
```

---

## 개발 환경 설정

### 1. Frontend 환경변수
```env
# .env.development
VITE_API_URL=http://localhost:8000/api
VITE_CHATBOT_API_URL=http://localhost:8001/api
VITE_ENABLE_DEV_TOOLS=true
```

### 2. Backend 환경변수
```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/dogpang
JWT_SECRET=your-jwt-secret
AI_SERVICE_URL=http://ai-service:8001
REDIS_URL=redis://localhost:6379
```

### 3. AI 서비스 환경변수
```env
# .env
MODEL_PATH=/models/dogpang-recommendation-model
OPENAI_API_KEY=your-openai-api-key
BACKEND_API_URL=http://backend:8000
```

---

## API 버전 관리

모든 API는 `/api/v1/` 형식으로 버전을 명시하며, 하위 호환성을 유지하면서 새로운 기능을 추가합니다.

```http
# 현재 버전
GET /api/v1/products

# 향후 버전 (새로운 기능 추가시)
GET /api/v2/products
```

이 API 명세서는 DOGPANG 프로젝트의 전체 아키텍처를 포괄하며, Frontend, Backend, AI ChatBot 간의 통합을 통해 기본적인 쇼핑몰 기능과 고객 상담 서비스를 제공합니다.