<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="page-title">장바구니</h1>
      
      <div v-if="cartItems.length > 0" class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              {{ item.image }}
            </div>
            
            <div class="item-info">
              <div class="item-brand">[{{ item.brand }}]</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">{{ formatPrice(item.price) }}원</div>
            </div>
            
            <div class="item-quantity">
              <button 
                class="quantity-btn" 
                @click="decreaseQuantity(item.id)"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button 
                class="quantity-btn" 
                @click="increaseQuantity(item.id)"
              >
                +
              </button>
            </div>
            
            <div class="item-total">
              {{ formatPrice(item.price * item.quantity) }}원
            </div>
            
            <button 
              class="remove-btn" 
              @click="removeItem(item.id)"
              title="상품 삭제"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-row">
            <span>상품금액</span>
            <span>{{ formatPrice(totalPrice) }}원</span>
          </div>
          <div class="summary-row">
            <span>배송비</span>
            <span>{{ formatPrice(shippingFee) }}원</span>
          </div>
          <div class="summary-row total">
            <span>총 결제금액</span>
            <span>{{ formatPrice(finalTotal) }}원</span>
          </div>
          
          <div class="cart-actions">
            <button class="clear-cart-btn" @click="clearCart">
              장바구니 비우기
            </button>
            <button class="checkout-btn" @click="checkout">
              주문하기 ({{ cartCount }}개)
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>장바구니가 비어있습니다</h2>
        <p>원하는 상품을 장바구니에 담아보세요!</p>
        <button class="continue-shopping-btn" @click="goToHome">
          쇼핑 계속하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/counter'
import type { CartItem } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

const cartItems = computed(() => cartStore.items)
const cartCount = computed((): number => cartStore.count)
const totalPrice = computed((): number => cartStore.totalPrice)

const shippingFee = computed((): number => {
  // 30,000원 이상 무료배송
  return totalPrice.value >= 30000 ? 0 : 3000
})

const finalTotal = computed((): number => {
  return totalPrice.value + shippingFee.value
})

const formatPrice = (price: number): string => {
  return price.toLocaleString()
}

const increaseQuantity = (itemId: number): void => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    cartStore.updateQuantity(itemId, item.quantity + 1)
  }
}

const decreaseQuantity = (itemId: number): void => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(itemId, item.quantity - 1)
  }
}

const removeItem = (itemId: number): void => {
  if (confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) {
    cartStore.removeItem(itemId)
  }
}

const clearCart = (): void => {
  if (confirm('장바구니를 모두 비우시겠습니까?')) {
    cartStore.clearCart()
  }
}

const checkout = (): void => {
  // 주문 페이지로 이동 (향후 구현)
  alert(`총 ${cartCount.value}개 상품을 ${formatPrice(finalTotal.value)}원에 주문합니다.`)
}

const goToHome = (): void => {
  router.push('/')
}
</script>

<style scoped>
.cart-page {
  min-height: 80vh;
  background: #f8f9fa;
  padding: 20px 0;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  align-items: start;
}

.cart-items {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 40px;
  gap: 16px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 1px solid #e9ecef;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-brand {
  color: #666;
  font-size: 14px;
}

.item-name {
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.item-price {
  color: #007bff;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.quantity-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #007bff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.item-total {
  font-weight: bold;
  color: #007bff;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #f8f9fa;
}

.cart-summary {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-of-type {
  border-bottom: none;
}

.summary-row.total {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  border-top: 2px solid #007bff;
  margin-top: 10px;
  padding-top: 15px;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.clear-cart-btn, .checkout-btn, .continue-shopping-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.2s ease;
}

.clear-cart-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.clear-cart-btn:hover {
  background: #e9ecef;
}

.checkout-btn {
  background: #007bff;
  color: white;
}

.checkout-btn:hover {
  background: #0056b3;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-cart h2 {
  color: #333;
  margin-bottom: 10px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 30px;
}

.continue-shopping-btn {
  background: #007bff;
  color: white;
}

.continue-shopping-btn:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr 80px;
    gap: 12px;
  }
  
  .item-total {
    grid-column: 2;
    text-align: left;
    margin-top: 8px;
  }
  
  .remove-btn {
    grid-column: 3;
    grid-row: 1;
  }
  
  .item-quantity {
    grid-column: 2;
    justify-content: flex-start;
    margin-top: 8px;
  }
}
</style>