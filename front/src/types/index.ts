export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  discountRate: number
  rating: number
  reviewCount: number
  image: string
  badge?: string
  category: string
  description?: string
  inStock: boolean
}

export interface CartItem {
  id: number
  name: string
  brand: string
  price: number
  image: string
  quantity: number
  productId: number
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface SearchFilters {
  query: string
  category: string
  sort: 'popular' | 'price_low' | 'price_high' | 'newest' | 'reviews'
  priceRange: 'all' | 'under10k' | '10k-30k' | '30k-50k' | 'over50k'
  brand: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  total?: number
  page?: number
  limit?: number
}

export interface User {
  id: number
  email: string
  name: string
  phone?: string
  address?: Address
}

export interface Address {
  zipCode: string
  address1: string
  address2?: string
  city: string
  state: string
}