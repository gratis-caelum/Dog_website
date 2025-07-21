<template>
  <div>
    <!-- Header Top -->
    <div class="header-top">
      <div class="header-top-container">
        <div>전국 무료배송 • 당일발송 • 카카오톡 상담</div>
        <div>고객센터 1588-1234</div>
      </div>
    </div>

    <!-- Header Main -->
    <header class="header">
      <div class="header-main">
        <div class="header-container">
          <button class="mobile-menu-btn" @click="emit('toggleMobileNav')">
            ☰
          </button>
          
          <router-link to="/" class="logo">
            <div class="logo-icon">🐕</div>
            <div class="logo-text">DOGPANG</div>
          </router-link>

          <div class="search-container">
            <div class="search-box">
              <input
                type="text"
                class="search-input"
                placeholder="찾고 싶은 상품을 검색해보세요!"
                v-model="searchQuery"
                @keypress.enter="handleSearch"
              >
              <button class="search-btn" @click="handleSearch">검색</button>
            </div>
          </div>

          <div class="header-actions">
            <button class="header-btn">
              <div class="header-btn-icon">🔔</div>
              <div>알림</div>
            </button>
            <button class="header-btn" @click="router.push('/cart')">
              <div class="header-btn-icon">🛒</div>
              <div class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</div>
              <div>장바구니</div>
            </button>
            <button class="header-btn" @click="router.push('/login')">
              <div class="header-btn-icon">👤</div>
              <div>로그인</div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <ul class="nav-menu">
          <li v-for="category in categories" :key="category.id">
            <a href="#" @click.prevent="emit('categorySelect', category.id)">
              <span class="category-icon">{{ category.icon }}</span>
              {{ category.name }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import type { Category } from '@/types'

interface Props {
  cartCount: number
}
const props = defineProps<Props>()

interface Emits {
  search: [query: string]
  toggleMobileNav: []
  categorySelect: [categoryId: string]
}
const emit = defineEmits<Emits>()

const router = useRouter()
const productStore = useProductStore()

const searchQuery = ref<string>('')

const categories = computed(() => productStore.categories)

const handleSearch = (): void => {
  const query = searchQuery.value.trim()
  if (query) {
    emit('search', query)
  }
}
</script>

<style scoped>
.header-top {
  background: #f8f9fa;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #e9ecef;
}

.header-top-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.header-main {
  padding: 16px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  font-size: 24px;
  min-width: 120px;
}

.logo-icon {
  font-size: 28px;
}

.search-container {
  flex: 1;
  max-width: 600px;
}

.search-box {
  display: flex;
  border: 2px solid #007bff;
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

.search-btn:hover {
  background: #0056b3;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.header-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
  transition: color 0.2s ease;
}

.header-btn:hover {
  color: #007bff;
}

.header-btn-icon {
  font-size: 20px;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.nav {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
}

.nav-menu li {
  flex-shrink: 0;
}

.nav-menu a {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.nav-menu a:hover {
  color: #007bff;
  background: #f8f9fa;
}

.category-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .header-container {
    padding: 0 16px;
    gap: 12px;
  }
  
  .logo-text {
    display: none;
  }
  
  .search-container {
    max-width: none;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .header-btn {
    font-size: 12px;
  }
  
  .nav-menu {
    padding: 0 4px;
  }
  
  .nav-menu a {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>