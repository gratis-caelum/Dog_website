<template>
  <div class="product-detail" v-if="product">
    <div class="product-detail-container">
      <div class="product-image-section">
        <div class="product-main-image">
          {{ product.image }}
        </div>
        <div v-if="product.badge" class="product-badge">{{ product.badge }}</div>
      </div>
      
      <div class="product-info-section">
        <div class="product-brand">[{{ product.brand }}]</div>
        <h1 class="product-title">{{ product.name }}</h1>
        
        <div class="product-rating">
          <span class="stars">{{ getStarDisplay(product.rating) }}</span>
          <span class="review-count">({{ product.reviewCount.toLocaleString() }}개 리뷰)</span>
        </div>
        
        <div class="product-price">
          <span class="current-price">{{ formatPrice(product.price) }}원</span>
          <span v-if="product.originalPrice" class="original-price">
            {{ formatPrice(product.originalPrice) }}원
          </span>
          <span v-if="product.discountRate > 0" class="discount-rate">
            {{ product.discountRate }}% 할인
          </span>
        </div>
        
        <div class="product-description" v-if="product.description">
          <h3>상품설명</h3>
          <p>{{ product.description }}</p>
        </div>
        
        <div class="product-stock" :class="{ 'out-of-stock': !product.inStock }">
          {{ product.inStock ? '재고 있음' : '품절' }}
        </div>
        
        <div class="product-actions">
          <div class="quantity-selector">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <span class="quantity">{{ quantity }}</span>
            <button @click="increaseQuantity">+</button>
          </div>
          
          <div class="action-buttons">
            <button
              class="wishlist-btn"
              :class="{ active: isInWishlist }"
              @click="toggleWishlist"
            >
              {{ isInWishlist ? '♥ 찜 해제' : '♡ 찜하기' }}
            </button>
            
            <button
              class="add-to-cart-btn"
              :disabled="!product.inStock || isAddingToCart"
              @click="addToCart"
            >
              {{ cartButtonText }}
            </button>
          </div>
        </div>
        
        <div class="total-price">
          <strong>총 금액: {{ formatPrice(product.price * quantity) }}원</strong>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else-if="loading" class="loading">
    상품 정보를 불러오는 중...
  </div>
  
  <div v-else class="error">
    상품을 찾을 수 없습니다.
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/counter'
import type { Product } from '@/types'

interface Props {
  id?: string | number
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref<boolean>(false)
const quantity = ref<number>(1)
const isAddingToCart = ref<boolean>(false)

const productId = computed((): number => {
  const id = props.id || route.params.id
  return typeof id === 'string' ? parseInt(id) : Number(id)
})

const isInWishlist = computed((): boolean => {
  return product.value ? productStore.isInWishlist(product.value.id) : false
})

const cartButtonText = computed((): string => {
  if (!product.value?.inStock) return '품절'
  return isAddingToCart.value ? '장바구니에 담는 중...' : '장바구니 담기'
})

const formatPrice = (price: number): string => {
  return price.toLocaleString()
}

const getStarDisplay = (rating: number): string => {
  return '⭐'.repeat(rating)
}

const increaseQuantity = (): void => {
  quantity.value++
}

const decreaseQuantity = (): void => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const toggleWishlist = (): void => {
  if (product.value) {
    productStore.toggleWishlist(product.value.id)
  }
}

const addToCart = async (): Promise<void> => {
  if (!product.value || !product.value.inStock) return
  
  isAddingToCart.value = true
  
  try {
    // 지정한 수량만큼 장바구니에 추가
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(product.value)
    }
    
    // 성공 메시지 표시 후 잠시 대기
    setTimeout(() => {
      isAddingToCart.value = false
    }, 1000)
    
  } catch (error) {
    console.error('장바구니 추가 오류:', error)
    isAddingToCart.value = false
  }
}

const loadProduct = async (): Promise<void> => {
  loading.value = true
  
  try {
    const result = await productStore.getProductById(productId.value)
    product.value = result
  } catch (error) {
    console.error('상품 로드 오류:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.product-image-section {
  position: relative;
}

.product-main-image {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 120px;
  border: 1px solid #e9ecef;
}

.product-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #ff4444;
  color: white;
  padding: 8px 12px;
  border-radius: 16px;
  font-weight: bold;
  font-size: 14px;
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-brand {
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

.product-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
}

.original-price {
  font-size: 20px;
  text-decoration: line-through;
  color: #999;
}

.discount-rate {
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.product-description h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.product-description p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.product-stock {
  font-weight: bold;
  color: #28a745;
}

.product-stock.out-of-stock {
  color: #dc3545;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 120px;
}

.quantity-selector button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.quantity-selector button:hover:not(:disabled) {
  background: #f8f9fa;
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 18px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.wishlist-btn, .add-to-cart-btn {
  padding: 12px 24px;
  border: 2px solid;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.2s ease;
  flex: 1;
}

.wishlist-btn {
  border-color: #ff4444;
  color: #ff4444;
  background: white;
}

.wishlist-btn.active {
  background: #ff4444;
  color: white;
}

.wishlist-btn:hover {
  background: #ff4444;
  color: white;
}

.add-to-cart-btn {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.total-price {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  border: 2px solid #007bff;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .product-detail-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .product-main-image {
    height: 300px;
    font-size: 80px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>