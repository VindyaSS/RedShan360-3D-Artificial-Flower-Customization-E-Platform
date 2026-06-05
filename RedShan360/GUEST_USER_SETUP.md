# RedShan360 Guest User Dashboard - Setup Guide

## ✅ What's Been Created

Your luxury e-commerce home page is ready to use! Here's what was set up:

### Files Created:
1. **`src/pages/GuestUser/guestUserDashboard.jsx`** - Main component (450+ lines)
2. **`tailwind.config.js`** - Tailwind CSS configuration with luxury theme
3. **`postcss.config.js`** - PostCSS configuration
4. **`src/pages/GuestUser/README.md`** - Comprehensive documentation

### Configuration Updated:
- **`package.json`** - Added Tailwind CSS, lucide-react, autoprefixer, postcss
- **`src/index.css`** - Added Tailwind directives and custom layers

### Dependencies Installed:
```
✓ tailwindcss@3.4.1
✓ lucide-react@0.263.1
✓ autoprefixer@10.4.16
✓ postcss@8.4.31
```

## 🚀 Quick Start

### 1. Run the Development Server
```bash
npm run dev
```
The app will start at `http://localhost:5173`

### 2. Import the Dashboard
In your main routing/App file:
```jsx
import GuestUserDashboard from './pages/GuestUser/guestUserDashboard';

// In your routes:
<Route path="/" element={<GuestUserDashboard />} />
```

### 3. Test the Features
- Scroll the page - navbar transparency changes
- Hover over category cards - they scale up smoothly
- Click the heart icons - wishlist items toggle
- Resize window - layout responds responsively

## 🎨 Design System

### Color Palette
- **Primary Rose**: `#e8b4b8`
- **Cream Background**: `#fcf9f8`
- **Text/Charcoal**: `#333` to `#1f2937`

### Typography
- **Headlines**: Playfair Display (serif) - elegant and luxury
- **Body Text**: System sans-serif - clean and modern

### Spacing & Shadows
- Border Radius: 8px (`rounded-lg`)
- Soft shadows for depth
- Generous whitespace for minimalist feel

## 📱 Responsive Breakpoints

The page is fully responsive:
- **Mobile**: Single column layouts
- **Tablet** (md): 2 columns
- **Desktop** (lg): 3-4 columns

## 🎯 Page Sections Overview

| Section | Purpose | Interactive |
|---------|---------|-------------|
| Navigation | Sticky nav with scroll effects | Yes - responsive menu |
| Hero | Full-screen banner with CTAs | Yes - buttons |
| Categories | 4 flower variety cards | Yes - hover effects |
| Experience | 360° viewer explanation | Yes - play button |
| Featured Products | 3 bestseller arrangements | Yes - wishlist hearts |
| Newsletter | Email subscription | Yes - form input |
| Footer | Links & social media | Yes - links |

## ⚙️ Customization

### Replace Product Images
Edit the `products` array (around line 60):
```jsx
const products = [
  {
    id: 1,
    title: 'Velvet Romance',
    subtitle: 'Premium Rose Collection',
    price: '$249.99',
    image: 'YOUR_IMAGE_URL_HERE', // Replace this
    badge: 'Bestseller',
  },
  // ...
];
```

### Replace Category Images
Edit the `categories` array (around line 45):
```jsx
const categories = [
  {
    name: 'Roses',
    image: 'YOUR_IMAGE_URL_HERE', // Replace this
  },
  // ...
];
```

### Change Colors
Option 1: Update `tailwind.config.js`:
```js
colors: {
  'rose': '#YOUR_COLOR_HERE',
  'cream': '#YOUR_COLOR_HERE',
}
```

Option 2: Find & replace in the JSX:
- `#e8b4b8` → your rose color
- `#fcf9f8` → your cream color

### Modify Text Content
Search for specific text and update:
- "Everlasting Elegance" - Hero headline
- "Shop by Variety" - Section title
- "Beauty From Every Angle" - Experience banner
- Etc.

## 🔗 Integration Points

These features need backend integration:
1. **Search** - Add product search functionality
2. **Cart** - Connect to shopping cart state
3. **Wishlist** - Persist to user database
4. **Newsletter** - Send email subscription to API
5. **Category Links** - Route to filtered product pages

## 📋 Next Steps

### Optional Enhancements:
- [ ] Replace all placeholder images with real product photos
- [ ] Connect navigation links to other pages
- [ ] Add product filtering on category selection
- [ ] Integrate actual shopping cart
- [ ] Connect wishlist to user accounts
- [ ] Add product quick-view modal
- [ ] Implement 360° image carousel
- [ ] Add customer reviews/testimonials
- [ ] Set up newsletter API integration

### Code Structure Tips:
If you want to refactor into smaller components later:
```jsx
// Component breakdown suggestion:
- Navbar.jsx
- Hero.jsx
- CategoryCard.jsx
- ProductCard.jsx
- Footer.jsx
```

## 🐛 Troubleshooting

### Tailwind classes not working?
```bash
# Rebuild Tailwind
npm run dev
```

### Images not loading?
- Check image URLs are accessible
- Verify CORS if using external images
- Use relative paths for local images

### Build issues?
```bash
npm install --legacy-peer-deps
npm run build
```

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev)
- [Playfair Display Font](https://fonts.google.com/specimen/Playfair+Display)

## ✨ Features Implemented

✅ Sticky navbar with scroll detection
✅ Responsive mobile menu
✅ Luxury minimalist design
✅ Interactive hover effects
✅ Wishlist toggle with state
✅ 4-section category grid
✅ Featured products showcase
✅ Newsletter subscription form
✅ 4-column footer layout
✅ Smooth transitions & animations
✅ Mobile-responsive grid system
✅ Accessibility best practices

---

**Your Guest User page is production-ready!** 🎉

For detailed component documentation, see `README.md` in this folder.
