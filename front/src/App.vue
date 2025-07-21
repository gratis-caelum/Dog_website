<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useCartStore } from '@/stores/counter'
import { useProductStore } from '@/stores/products'

const cartStore = useCartStore()
const productStore = useProductStore()

const cartCount = computed(() => cartStore.count)

const handleSearch = (query: string) => {
  productStore.searchProducts({ query })
}

const handleCategorySelect = (categoryId: string) => {
  productStore.searchProducts({ category: categoryId })
}

const handleToggleMobileNav = () => {
  console.log('Mobile navigation toggled')
}
</script>

<template>
  <div id="app">
    <AppHeader 
      :cartCount="cartCount"
      @search="handleSearch"
      @categorySelect="handleCategorySelect"
      @toggleMobileNav="handleToggleMobileNav"
    />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>DOGPANG</h3>
          <p>반려견을 위한 최고의 쇼핑 경험을 제공합니다.</p>
        </div>
        <div class="footer-section">
          <h4>고객서비스</h4>
          <ul>
            <li><a href="#">고객센터</a></li>
            <li><a href="#">배송안내</a></li>
            <li><a href="#">교환/반품</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>회사정보</h4>
          <ul>
            <li><a href="#">회사소개</a></li>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>연락처</h4>
          <p>📞 1588-1234</p>
          <p>📧 help@dogpang.com</p>
          <p>🕐 평일 9:00-18:00</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 DOGPANG. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  padding: 0;
}

.footer {
  background: #2c3e50;
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 16px;
  color: #3498db;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section ul li a:hover {
  color: white;
}

.footer-section p {
  margin-bottom: 8px;
  color: #bdc3c7;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  text-align: center;
  padding: 20px;
  color: #95a5a6;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
