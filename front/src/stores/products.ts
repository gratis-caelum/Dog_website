import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import type { Product, Category, SearchFilters, ApiResponse } from '@/types'

export const useProductStore = defineStore('products', () => {
  const wishlist = ref<Set<number>>(new Set())
  const products = ref<Product[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  const categories = ref<Category[]>([
    { id: 'food', name: '사료', icon: '🥘' },
    { id: 'treats', name: '간식', icon: '🦴' },
    { id: 'toys', name: '장난감', icon: '🎾' },
    { id: 'supplies', name: '용품', icon: '🏠' },
    { id: 'clothing', name: '의류', icon: '👕' },
    { id: 'hygiene', name: '배변/위생', icon: '🧻' },
    { id: 'health', name: '건강관리', icon: '💊' },
    { id: 'grooming', name: '목욕/미용', icon: '🧴' },
    { id: 'walking', name: '산책/이동용', icon: '🎽' },
    { id: 'sale', name: '100원샵', icon: '💯' }
  ])
  
  const searchProducts = async (filters: Partial<SearchFilters>): Promise<Product[]> => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: API 연결 후 실제 구현
      const mockProducts = getMockProducts(filters)
      products.value = mockProducts
      return mockProducts
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
      console.error('Search products error:', err)
      return getMockProducts(filters)
    } finally {
      loading.value = false
    }
  }
  
  const getProductById = async (id: number): Promise<Product | null> => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: API 연결 후 실제 구현
      const mockProducts = getMockProducts({})
      const product = mockProducts.find(p => p.id === id) || null
      return product
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch product'
      console.error('Get product error:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  const toggleWishlist = (productId: number): void => {
    if (wishlist.value.has(productId)) {
      wishlist.value.delete(productId)
    } else {
      wishlist.value.add(productId)
    }
  }
  
  const isInWishlist = (productId: number): boolean => {
    return wishlist.value.has(productId)
  }
  
  // 개발용 목 데이터
  const getMockProducts = (filters: Partial<SearchFilters>): Product[] => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: '미니 어덜트 8kg 소형견 성견용 사료',
        brand: '로얄캐닌',
        price: 89900,
        originalPrice: 120000,
        discountRate: 25,
        rating: 5,
        reviewCount: 1234,
        image: '🥘',
        badge: 'BEST',
        category: 'food',
        inStock: true
      },
      {
        id: 2,
        name: '오리지널 티니 30개입 덴탈츄',
        brand: '그리니즈',
        price: 24900,
        originalPrice: 33000,
        discountRate: 25,
        rating: 5,
        reviewCount: 892,
        image: '🦴',
        badge: '25%',
        category: 'treats',
        inStock: true
      },
      {
        id: 3,
        name: '터그 로프 놀이 장난감 (소형)',
        brand: '콩',
        price: 12900,
        discountRate: 0,
        rating: 5,
        reviewCount: 567,
        image: '🎾',
        category: 'toys',
        inStock: true
      },
      {
        id: 4,
        name: '프리미엄 방석 하우스 (중형)',
        brand: '펫디아',
        price: 45900,
        originalPrice: 59000,
        discountRate: 22,
        rating: 5,
        reviewCount: 234,
        image: '🏠',
        badge: 'NEW',
        category: 'supplies',
        inStock: true
      }
    ]
    
    // 필터 적용
    let filtered = [...mockProducts]
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      )
    }
    
    // 정렬 적용
    switch (filters.sort) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.reverse()
        break
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default: // popular
        break
    }
    
    return filtered
  }
  
  return {
    wishlist: readonly(wishlist),
    products: readonly(products),
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    searchProducts,
    getProductById,
    toggleWishlist,
    isInWishlist
  }
})