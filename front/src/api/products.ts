import type { Product, SearchFilters, ApiResponse, CartItem } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// 개발 단계에서는 mock 데이터 사용
const USE_MOCK = true

export const productApi = {
  // 상품 검색
  search: async (filters: Partial<SearchFilters>): Promise<ApiResponse<Product[]>> => {
    if (USE_MOCK) {
      // Mock 응답
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [],
            success: true,
            message: '상품을 성공적으로 조회했습니다.'
          })
        }, 500)
      })
    }
    
    const response = await fetch(`${API_BASE_URL}/products/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: filters.query || '',
        category: filters.category || '',
        sort: filters.sort || 'popular',
        price_range: filters.priceRange || 'all',
        brand: filters.brand || 'all'
      })
    })
    
    if (!response.ok) {
      throw new Error('상품 검색에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 상품 상세 조회
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (id > 0) {
            resolve({
              data: {} as Product,
              success: true,
              message: '상품을 성공적으로 조회했습니다.'
            })
          } else {
            reject(new Error('상품을 찾을 수 없습니다.'))
          }
        }, 300)
      })
    }
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    
    if (!response.ok) {
      throw new Error('상품 조회에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 카테고리별 상품
  getByCategory: async (
    category: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}?page=${page}&limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('카테고리별 상품 조회에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 베스트셀러 상품
  getBestsellers: async (limit: number = 10): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/bestsellers?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('베스트셀러 상품 조회에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 신상품
  getNew: async (limit: number = 10): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/new?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('신상품 조회에 실패했습니다.')
    }
    
    return response.json()
  }
}

export const cartApi = {
  // 장바구니 조회
  get: async (): Promise<ApiResponse<CartItem[]>> => {
    const response = await fetch(`${API_BASE_URL}/cart`)
    
    if (!response.ok) {
      throw new Error('장바구니 조회에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 장바구니에 상품 추가
  addItem: async (productId: number, quantity: number = 1): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        quantity
      })
    })
    
    if (!response.ok) {
      throw new Error('장바구니에 상품 추가에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 장바구니 상품 수량 변경
  updateQuantity: async (itemId: number, quantity: number): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity })
    })
    
    if (!response.ok) {
      throw new Error('장바구니 상품 수량 변경에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 장바구니 상품 삭제
  removeItem: async (itemId: number): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('장바구니 상품 삭제에 실패했습니다.')
    }
    
    return response.json()
  },
  
  // 장바구니 비우기
  clear: async (): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('장바구니 비우기에 실패했습니다.')
    }
    
    return response.json()
  }
}