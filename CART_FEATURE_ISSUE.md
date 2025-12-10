# Feature Request: Shopping Cart Management

## Description

Add shopping cart functionality to the Album Viewer application, allowing users to add albums to a cart, view cart contents, and remove items. This feature will enhance the user experience by providing a familiar e-commerce pattern for managing album selections before potential checkout.

## User Story

**As a** user browsing the album collection  
**I want to** add and remove albums to/from a shopping cart  
**So that** I can manage my album selections and see what I plan to purchase

## Current Behavior

- Users can view, add, edit, and delete albums from the main collection
- No cart functionality exists
- No way to temporarily select multiple albums for purchase

## Proposed Behavior

- Users can add albums to a persistent shopping cart
- Cart icon in header displays current item count (badge)
- Clicking cart icon opens a cart panel/modal showing cart contents
- Users can remove items from cart in the cart view
- Cart state persists across page refreshes (localStorage)
- Cart operates independently from the main album collection

---

## Implementation Details

### 1. Cart State Management

**Location**: `album-viewer/src/stores/cart.ts` (new file)

Create a cart store using Vue's Composition API with the following:

```typescript
interface CartItem {
  album: Album
  quantity: number  // Default: 1 (can be extended later for quantity management)
  addedAt: Date
}
```

**Features**:
- `cartItems: Ref<CartItem[]>` - reactive cart state
- `totalItems: ComputedRef<number>` - total number of items in cart
- `totalPrice: ComputedRef<number>` - sum of all album prices
- `addToCart(album: Album)` - add album to cart (check for duplicates)
- `removeFromCart(albumId: number)` - remove item from cart
- `clearCart()` - empty entire cart
- `isInCart(albumId: number)` - check if album already in cart
- localStorage persistence (save/load on mount)

### 2. Cart Icon with Badge (Header Component)

**Location**: Update `album-viewer/src/App.vue`

Add cart icon next to the "Add New Album" button in the header:

```vue
<div class="header-actions">
  <LanguageSelector />
  <button class="cart-button" @click="toggleCart" :aria-label="$t('cart.viewCart')">
    🛒
    <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
  </button>
  <button class="add-album-btn" @click="openAddModal">
    {{ $t('app.addAlbum') }}
  </button>
</div>
```

**Styling Requirements**:
- Cart icon should be visible and clickable
- Badge should be circular, positioned top-right of icon
- Badge displays item count (max display: "99+")
- Responsive: stacks properly on mobile

### 3. Add to Cart Button (Album Card)

**Location**: Update `album-viewer/src/components/AlbumCard.vue`

Add "Add to Cart" button to each album card:

```vue
<div class="album-actions">
  <button 
    class="btn btn-add-cart" 
    @click="handleAddToCart" 
    :disabled="isInCart(album.id)"
    :title="isInCart(album.id) ? $t('cart.alreadyInCart') : $t('cart.addToCart')"
  >
    <svg><!-- Cart icon --></svg>
    {{ isInCart(album.id) ? $t('cart.inCart') : $t('cart.addToCart') }}
  </button>
  <button class="btn btn-edit" @click="handleEdit" :title="$t('albumCard.edit')">
    <!-- existing edit button -->
  </button>
  <button class="btn btn-delete" @click="handleDelete" :title="$t('albumCard.delete')">
    <!-- existing delete button -->
  </button>
</div>
```

**Behavior**:
- Button disabled if album already in cart
- Visual feedback on hover/disabled state
- Emit event to parent or use cart store directly
- Show success feedback (optional: toast notification)

### 4. Cart Panel/Modal Component

**Location**: `album-viewer/src/components/CartPanel.vue` (new file)

Create a slide-in panel or modal to display cart contents:

**Structure**:
```vue
<template>
  <div v-if="show" class="cart-overlay" @click.self="handleClose">
    <div class="cart-panel">
      <!-- Header -->
      <div class="cart-header">
        <h2>🛒 {{ $t('cart.title') }}</h2>
        <button class="close-button" @click="handleClose">&times;</button>
      </div>

      <!-- Empty State -->
      <div v-if="cartItems.length === 0" class="cart-empty">
        <p>{{ $t('cart.empty') }}</p>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div v-for="item in cartItems" :key="item.album.id" class="cart-item">
          <img :src="item.album.image_url" :alt="item.album.title" />
          <div class="cart-item-info">
            <h3>{{ item.album.title }}</h3>
            <p>{{ item.album.artist }}</p>
            <p class="price">${{ item.album.price.toFixed(2) }}</p>
          </div>
          <button 
            class="btn-remove" 
            @click="handleRemove(item.album.id)"
            :title="$t('cart.remove')"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Footer with Total -->
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>{{ $t('cart.total') }}:</span>
          <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="btn btn-primary btn-checkout">
          {{ $t('cart.checkout') }}
        </button>
        <button class="btn btn-secondary" @click="handleClearCart">
          {{ $t('cart.clear') }}
        </button>
      </div>
    </div>
  </div>
</template>
```

**Features**:
- Slide-in from right side (or modal center)
- List all cart items with thumbnail, title, artist, price
- Remove button for each item
- Display total price
- "Clear Cart" button
- "Checkout" button (placeholder for future functionality)
- Click outside to close
- Responsive design

### 5. Internationalization (i18n)

**Location**: Update `album-viewer/src/locales/*.json`

Add translation keys for all three languages:

```json
{
  "cart": {
    "title": "Shopping Cart",
    "viewCart": "View shopping cart",
    "addToCart": "Add to Cart",
    "inCart": "In Cart",
    "alreadyInCart": "Already in cart",
    "remove": "Remove from cart",
    "empty": "Your cart is empty. Start adding some albums!",
    "total": "Total",
    "checkout": "Proceed to Checkout",
    "clear": "Clear Cart",
    "itemCount": "{count} item | {count} items",
    "addedToCart": "Added to cart!",
    "removedFromCart": "Removed from cart"
  }
}
```

**French (fr.json)**:
```json
{
  "cart": {
    "title": "Panier",
    "viewCart": "Voir le panier",
    "addToCart": "Ajouter au Panier",
    "inCart": "Dans le Panier",
    "alreadyInCart": "Déjà dans le panier",
    "remove": "Retirer du panier",
    "empty": "Votre panier est vide. Commencez à ajouter des albums!",
    "total": "Total",
    "checkout": "Passer à la Caisse",
    "clear": "Vider le Panier",
    "itemCount": "{count} article | {count} articles",
    "addedToCart": "Ajouté au panier!",
    "removedFromCart": "Retiré du panier"
  }
}
```

**German (de.json)**:
```json
{
  "cart": {
    "title": "Warenkorb",
    "viewCart": "Warenkorb anzeigen",
    "addToCart": "In den Warenkorb",
    "inCart": "Im Warenkorb",
    "alreadyInCart": "Bereits im Warenkorb",
    "remove": "Aus Warenkorb entfernen",
    "empty": "Ihr Warenkorb ist leer. Fügen Sie Alben hinzu!",
    "total": "Gesamt",
    "checkout": "Zur Kasse",
    "clear": "Warenkorb Leeren",
    "itemCount": "{count} Artikel",
    "addedToCart": "Zum Warenkorb hinzugefügt!",
    "removedFromCart": "Aus Warenkorb entfernt"
  }
}
```

### 6. Styling Guidelines

**Theme**: Match existing design system (purple/blue gradient theme)

**Cart Badge**:
- Background: `#f56565` (red)
- Text: white
- Border-radius: 50%
- Position: absolute, top-right of cart icon
- Size: 18px x 18px
- Font-size: 11px, bold

**Cart Panel**:
- Width: 400px (desktop), 100% (mobile)
- Background: white
- Box-shadow: -2px 0 10px rgba(0,0,0,0.1)
- Animation: slide-in from right (0.3s ease)
- z-index: 1000

**Cart Items**:
- Display: flex, gap: 1rem
- Thumbnail: 60px x 60px
- Hover effect on remove button
- Border-bottom between items

### 7. Testing Requirements

**Unit Tests** (`album-viewer/tests/cart.test.ts`):
- ✅ Add album to cart
- ✅ Remove album from cart
- ✅ Prevent duplicate albums
- ✅ Calculate total price correctly
- ✅ Calculate total item count
- ✅ Clear cart functionality
- ✅ localStorage persistence (save/load)

**Component Tests**:
- ✅ CartPanel renders correctly
- ✅ Cart badge displays correct count
- ✅ Add to cart button disables when in cart
- ✅ Remove button works in cart panel
- ✅ Empty state displays when cart is empty

**Integration Tests**:
- ✅ Add album from card → appears in cart panel
- ✅ Remove from cart → button re-enables on card
- ✅ Cart persists after page refresh

---

## Acceptance Criteria

### Must Have (MVP)

- [ ] **AC1**: Cart icon with item count badge appears in the header next to "Add New Album" button
- [ ] **AC2**: Badge displays "0" or is hidden when cart is empty, shows correct count when items added
- [ ] **AC3**: "Add to Cart" button appears on each album card below the album image
- [ ] **AC4**: Clicking "Add to Cart" adds the album to the cart and updates the badge count
- [ ] **AC5**: "Add to Cart" button is disabled and shows "In Cart" text when album is already in cart
- [ ] **AC6**: Clicking cart icon opens a cart panel/modal displaying all cart items
- [ ] **AC7**: Cart panel shows album thumbnail, title, artist, and price for each item
- [ ] **AC8**: Each cart item has a remove button that removes it from the cart
- [ ] **AC9**: Cart panel displays total price of all items
- [ ] **AC10**: Cart panel shows empty state message when no items in cart
- [ ] **AC11**: Cart state persists across page refreshes (localStorage)
- [ ] **AC12**: Clicking outside cart panel or close button closes the panel
- [ ] **AC13**: All cart UI elements are translated in English, French, and German
- [ ] **AC14**: Cart functionality works correctly after language switching

### Should Have (Nice to Have)

- [ ] Visual feedback (toast notification) when adding/removing items
- [ ] "Clear Cart" button to remove all items at once
- [ ] Smooth animations for cart panel open/close
- [ ] Hover effects on cart icon and buttons
- [ ] Badge shows "99+" for counts over 99
- [ ] Keyboard accessibility (Esc to close, focus management)

### Could Have (Future Enhancements)

- [ ] Quantity management (increase/decrease quantity per item)
- [ ] "Checkout" button functionality with order summary
- [ ] Recent items indicator (items added in last 5 seconds)
- [ ] Drag and drop to reorder items
- [ ] Share cart functionality
- [ ] Cart expiration (auto-clear after X days)

---

## Technical Considerations

### State Management
- Use Vue Composition API with composables for cart logic
- Centralized cart store that can be imported by any component
- Avoid prop drilling by using provide/inject if needed

### Performance
- Cart operations should be instantaneous (no API calls for now)
- localStorage updates should be debounced (wait 500ms after last change)
- Use Vue's reactivity system efficiently (computed properties)

### Accessibility
- ARIA labels on cart button and badge
- Keyboard navigation support (Tab, Enter, Esc)
- Screen reader announcements for cart updates
- Focus trap when cart panel is open

### Browser Compatibility
- localStorage fallback for older browsers
- CSS Grid/Flexbox for layout (widely supported)
- Test on Chrome, Firefox, Safari, Edge

### Edge Cases
- Handle localStorage quota exceeded
- Handle corrupted localStorage data (parse errors)
- Prevent adding albums that no longer exist in main collection
- Handle concurrent tab updates (storage event listener)

---

## Files to Create/Modify

### New Files
```
album-viewer/
  src/
    stores/
      cart.ts                    # Cart state management
    components/
      CartPanel.vue              # Cart display modal/panel
    tests/
      cart.test.ts               # Cart store tests
      CartPanel.test.ts          # Cart panel component tests
```

### Modified Files
```
album-viewer/
  src/
    App.vue                      # Add cart icon + badge, integrate CartPanel
    components/
      AlbumCard.vue              # Add "Add to Cart" button
    locales/
      en.json                    # Add cart translations
      fr.json                    # Add cart translations
      de.json                    # Add cart translations
```

---

## Dependencies

No new dependencies required. Uses existing:
- Vue 3 Composition API
- TypeScript
- Vue I18n (already integrated)
- Vitest (for testing)
- localStorage Web API

---

## Mockups/Wireframes

### Header with Cart Badge
```
┌─────────────────────────────────────────────────────┐
│  🎵 Album Collection                                │
│  Browse and manage your music collection            │
│                                  🌐 EN  🛒③  [+Add] │
└─────────────────────────────────────────────────────┘
```

### Album Card with Cart Button
```
┌──────────────────┐
│                  │
│  [Album Image]   │
│                  │
├──────────────────┤
│ Album Title      │
│ Artist Name      │
│ $19.99           │
├──────────────────┤
│ [🛒 Add to Cart] │
│ [✏️ Edit]        │
│ [🗑️ Delete]      │
└──────────────────┘
```

### Cart Panel
```
┌────────────────────────────────┐
│ 🛒 Shopping Cart           [×] │
├────────────────────────────────┤
│ ┌────┬─────────────────┬────┐ │
│ │[🖼️]│ Album 1         │[🗑️]│ │
│ │    │ Artist 1        │    │ │
│ │    │ $19.99          │    │ │
│ └────┴─────────────────┴────┘ │
│ ┌────┬─────────────────┬────┐ │
│ │[🖼️]│ Album 2         │[🗑️]│ │
│ │    │ Artist 2        │    │ │
│ │    │ $24.99          │    │ │
│ └────┴─────────────────┴────┘ │
├────────────────────────────────┤
│ Total:              $44.98     │
│ [   Proceed to Checkout   ]   │
│ [      Clear Cart         ]   │
└────────────────────────────────┘
```

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Component tests written and passing
- [ ] Manual testing completed across all languages
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility requirements met (WCAG AA)
- [ ] Documentation updated (README if needed)
- [ ] No console errors or warnings
- [ ] Works in Chrome, Firefox, Safari, Edge

---

## Priority

**Medium-High** - Enhances user experience with standard e-commerce functionality

## Labels

`enhancement`, `frontend`, `vue`, `cart`, `user-experience`, `i18n`

## Estimated Effort

**3-5 hours** (depending on familiarity with Vue Composition API)

- Cart store implementation: 1 hour
- UI components (CartPanel, buttons, badge): 2 hours
- Styling and responsive design: 1 hour
- Testing: 1 hour
- i18n translations: 30 minutes

---

## Related Issues/PRs

None (initial feature request)

## Additional Notes

This feature lays the groundwork for future e-commerce functionality like:
- Checkout process
- Order history
- Payment integration
- Wishlist functionality
- Product recommendations

The cart is client-side only (no backend persistence), making it a good starting point before implementing full order management with the API.
