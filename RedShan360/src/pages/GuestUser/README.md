# RedShan360 Guest User Dashboard

## Overview
A modern, luxury e-commerce home page for RedShan360 - a high-end artificial flower brand. Built with React and Tailwind CSS with a minimalist luxury design aesthetic.

## Design System
- **Theme**: Luxury minimalist
- **Primary Color**: #e8b4b8 (Soft Rose)
- **Surface Color**: #fcf9f8 (Cream)
- **Text Color**: Charcoal/Gray
- **Typography**: 
  - Headlines: Playfair Display (serif)
  - UI Text: System sans-serif
- **Styling**: Rounded-lg (8px) corners, soft shadows, generous whitespace

## Components & Sections

### 1. Navigation Bar (TopNavBar)
- **Type**: Sticky navigation
- **Behavior**: Transparent on scroll, becomes solid white on scroll down
- **Elements**:
  - Brand title "RedShan360"
  - Navigation links: Home, Shop, Customization, About, Contact
  - Icons: Search, Wishlist, Cart (via lucide-react)
  - Responsive mobile menu

### 2. Hero Section
- **Layout**: Full-bleed background image
- **Content**:
  - Large serif headline: "Everlasting Elegance"
  - Descriptive subtitle
  - Two CTA buttons:
    - "Shop Now" (solid rose background)
    - "Customize Bouquet" (glassmorphism effect)

### 3. Category Grid (Shop by Variety)
- **Layout**: 4 vertical cards (responsive grid)
- **Categories**: Roses, Lilies, Peonies, Orchids
- **Features**:
  - High-quality image backgrounds
  - Gradient text overlays
  - Scale-up hover effect
  - Smooth transitions

### 4. Experience Banner (Beauty From Every Angle)
- **Layout**: Split-screen (left/right)
- **Left Section**: 
  - Interactive 360° visualizer placeholder
  - Play icon overlay
  - Hover effects
- **Right Section**:
  - Descriptive text
  - Key features list with bullet points
  - "Explore 360° View" CTA button

### 5. Featured Arrangements
- **Layout**: 3-column grid (responsive)
- **Card Elements**:
  - Product image with hover zoom
  - "Bestseller" badge (on first card)
  - Floating heart icon for wishlist (with state toggle)
  - Product title & subtitle
  - Price display
  - 5-star rating
  - "Add to Cart" button

### 6. Newsletter Section (Join the Inner Circle)
- **Layout**: Centered
- **Elements**:
  - Email input field
  - "Subscribe Now" button
  - Privacy disclaimer

### 7. Footer
- **Layout**: 4-column responsive grid
- **Sections**:
  - About RedShan360
  - Collections (Roses, Lilies, Peonies, Orchids)
  - Company (About, Blog, Careers, Press)
  - Support (Contact, FAQ, Shipping, Returns)
- **Bottom**: Social media icons + copyright

## Technical Details

### Dependencies
- **React**: ^19.2.6
- **Tailwind CSS**: ^3.4.1
- **lucide-react**: ^0.263.1 (with --legacy-peer-deps)
- **Autoprefixer**: ^10.4.16
- **PostCSS**: ^8.4.31

### File Structure
```
src/pages/GuestUser/
├── guestUserDashboard.jsx    # Main component
└── (No separate CSS - all styles via Tailwind)
```

### Configuration Files
- **tailwind.config.js**: Custom theme with rose color, Playfair Display font
- **postcss.config.js**: PostCSS with Tailwind and Autoprefixer
- **src/index.css**: Tailwind directives + Google Fonts import

## Features

### Interactivity
- Scroll-based navbar transparency toggle
- Mobile-responsive hamburger menu
- Wishlist toggle with heart fill animation
- Hover effects on cards (scale, shadow, color)
- Smooth transitions (300ms for most elements)

### Responsive Design
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Grid adjusts: 1 → 2 → 3-4 columns based on screen size
- Touch-friendly button/icon sizes

### Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Clear visual feedback on interactive elements
- High contrast text on backgrounds

## Usage

### Import & Routing
```jsx
import GuestUserDashboard from './pages/GuestUser/guestUserDashboard';

// In your router:
<Route path="/" element={<GuestUserDashboard />} />
```

### Customization Tips
1. **Replace Images**: Update URLs in the `categories` and `products` arrays
2. **Modify Colors**: Update `#e8b4b8` references or modify `tailwind.config.js`
3. **Change Content**: Edit text/labels in component arrays or JSX
4. **Add Functionality**: 
   - Connect "Shop Now" to shop page
   - Integrate actual cart functionality
   - Link wishlist to user account
   - Connect newsletter to backend

## Performance Optimizations
- Lazy loading images (consider adding `loading="lazy"`)
- CSS-in-JS via Tailwind (no runtime CSS)
- Minimal JavaScript for animations (pure CSS transitions)
- Icon library (lucide-react) is tree-shakeable

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CSS Grid and Flexbox support required

## Notes
- All images use Unsplash placeholders - replace with actual product images
- Wishlist state is component-local - integrate with Redux/Context for persistence
- Cart functionality is UI-only - needs backend integration
- Newsletter form requires API endpoint integration

## Future Enhancements
- Add product filtering functionality
- Implement 360° image viewer
- Add shopping cart persistence
- Create wishlist saved items feature
- Add product quick-view modal
- Implement product search
- Add customer testimonials section
- Create size/variant selector

---

**Created**: June 2024
**Framework**: React + Tailwind CSS
**Design Inspiration**: Luxury minimalism
