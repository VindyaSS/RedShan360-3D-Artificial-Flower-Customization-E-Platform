# 🎨 RedShan360 Component Breakdown & Refactoring Guide

## Current Implementation
The entire page is built as a **single component** (`guestUserDashboard.jsx`) for simplicity and quick delivery.

**Size**: ~450 lines | **No dependencies**: No prop drilling needed

---

## 📦 Optional: Breaking Into Smaller Components

If you want to refactor for better maintainability, here's the suggested structure:

```
src/pages/GuestUser/
├── guestUserDashboard.jsx (Main orchestrator)
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── CategoryCard.jsx
│   ├── CategoryGrid.jsx
│   ├── ExperienceBanner.jsx
│   ├── ProductCard.jsx
│   ├── FeaturedProducts.jsx
│   ├── Newsletter.jsx
│   └── Footer.jsx
└── hooks/
    └── useScrollDetection.js
```

---

## 🔧 Component Breakdown

### 1. **Navbar Component**
```jsx
// File: components/Navbar.jsx
export const Navbar = ({ isScrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${...}`}>
      {/* Navigation content */}
    </nav>
  );
};

// Props: isScrolled (boolean)
// State: mobileMenuOpen (boolean)
```

### 2. **Hero Component**
```jsx
// File: components/Hero.jsx
export const Hero = () => {
  return (
    <section className="relative h-screen bg-cover">
      {/* Hero content */}
    </section>
  );
};

// No props needed (static content)
```

### 3. **CategoryCard Component**
```jsx
// File: components/CategoryCard.jsx
export const CategoryCard = ({ name, image }) => {
  return (
    <div className="group relative h-80 rounded-lg overflow-hidden">
      {/* Card content */}
    </div>
  );
};

// Props:
// - name: string (category name)
// - image: string (image URL)
```

### 4. **CategoryGrid Component**
```jsx
// File: components/CategoryGrid.jsx
export const CategoryGrid = ({ categories }) => {
  return (
    <section className="py-24 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(category => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
    </section>
  );
};

// Props:
// - categories: array of { name, image }
```

### 5. **ProductCard Component**
```jsx
// File: components/ProductCard.jsx
export const ProductCard = ({ 
  product, 
  isWishlisted, 
  onWishlistToggle 
}) => {
  return (
    <div className="group bg-white rounded-lg overflow-hidden">
      {/* Product card content */}
    </div>
  );
};

// Props:
// - product: { id, title, subtitle, price, image, badge }
// - isWishlisted: boolean
// - onWishlistToggle: function(id)
```

### 6. **FeaturedProducts Component**
```jsx
// File: components/FeaturedProducts.jsx
export const FeaturedProducts = ({ 
  products, 
  wishlist, 
  onWishlistToggle 
}) => {
  return (
    <section className="py-24 px-4">
      {/* Featured products grid */}
    </section>
  );
};

// Props:
// - products: array
// - wishlist: object (id → boolean)
// - onWishlistToggle: function
```

### 7. **ExperienceBanner Component**
```jsx
// File: components/ExperienceBanner.jsx
export const ExperienceBanner = () => {
  return (
    <section className="py-24 px-4 bg-white">
      {/* 360° visualizer section */}
    </section>
  );
};

// No props needed (static content)
```

### 8. **Newsletter Component**
```jsx
// File: components/Newsletter.jsx
export const Newsletter = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubscribe?.(email);
    setEmail('');
  };

  return (
    <section className="py-24 px-4 bg-white">
      {/* Newsletter form */}
    </section>
  );
};

// Props:
// - onSubscribe: function(email)
// State:
// - email: string
```

### 9. **Footer Component**
```jsx
// File: components/Footer.jsx
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      {/* Footer content */}
    </footer>
  );
};

// No props needed (static content)
```

---

## 🪝 Custom Hook

### useScrollDetection
```jsx
// File: hooks/useScrollDetection.js
export const useScrollDetection = (threshold = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

// Usage:
// const isScrolled = useScrollDetection(50);
```

---

## 📋 Refactored Main Component

```jsx
// File: guestUserDashboard.jsx (refactored)
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ExperienceBanner } from './components/ExperienceBanner';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { useScrollDetection } from './hooks/useScrollDetection';

const GuestUserDashboard = () => {
  const isScrolled = useScrollDetection();
  const [wishlist, setWishlist] = useState({});

  const categories = [...];
  const products = [...];

  const toggleWishlist = (id) => {
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNewsletterSubscribe = (email) => {
    console.log('Subscribe:', email);
    // TODO: Connect to API
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <Navbar isScrolled={isScrolled} />
      <Hero />
      <CategoryGrid categories={categories} />
      <ExperienceBanner />
      <FeaturedProducts
        products={products}
        wishlist={wishlist}
        onWishlistToggle={toggleWishlist}
      />
      <Newsletter onSubscribe={handleNewsletterSubscribe} />
      <Footer />
    </div>
  );
};

export default GuestUserDashboard;
```

---

## 🎯 Benefits of Refactoring

✅ **Reusability**: Components can be used elsewhere
✅ **Maintainability**: Easier to find and update specific sections
✅ **Testing**: Smaller components are easier to test
✅ **Performance**: Can lazy-load components if needed
✅ **Team Collaboration**: Multiple developers can work on different components

---

## ⚡ When to Refactor

**Refactor when:**
- You need to reuse components in other pages
- The component file gets too large (> 500 lines)
- You want to add unit tests
- Multiple team members are working on it

**Keep as-is when:**
- The page is used only once
- You want quick iteration
- Team prefers monolithic components
- File size is manageable (currently ~450 lines)

---

## 📊 File Size Comparison

| Approach | Main File | Total Files |
|----------|-----------|-------------|
| **Current** | 450 lines | 1 file |
| **Refactored** | 80 lines | 10 files |

**Current approach is lighter** for a single-page use case.
**Refactored approach is better** for scalability.

---

## 🔄 State Management

### Current (useState only)
```jsx
const [isScrolled, setIsScrolled] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [wishlist, setWishlist] = useState({});
```

### If you scale to Redux/Context:
```jsx
// Store
const initialState = {
  ui: {
    isScrolled: false,
    mobileMenuOpen: false,
  },
  wishlist: {},
  cart: {},
};

// Then pass via Context or Redux
```

---

## 🚀 Migration Steps (if needed)

1. **Create component files** in `components/` folder
2. **Extract each section** from original component
3. **Define props** for each component
4. **Update main component** to use new components
5. **Test** each section independently
6. **Add tests** for each component
7. **Optimize** imports and exports

---

## 💡 Pro Tips

### 1. Keep Styling Consistent
Use Tailwind classes consistently across all components.

### 2. Prop Naming
Use descriptive prop names:
```jsx
✅ onWishlistToggle
❌ onToggle

✅ isLoading
❌ loading
```

### 3. Component Composition
```jsx
// ✅ Good: Composable
<FeaturedProducts>
  {products.map(p => <ProductCard {...p} />)}
</FeaturedProducts>

// ❌ Avoid: Tightly coupled
<FeaturedProducts products={products} />
```

### 4. Document Props
```jsx
/**
 * ProductCard Component
 * 
 * @param {Object} product - Product data
 * @param {number} product.id - Product ID
 * @param {string} product.title - Product title
 * @param {boolean} isWishlisted - Is product in wishlist
 * @param {Function} onWishlistToggle - Wishlist toggle handler
 */
export const ProductCard = ({ 
  product, 
  isWishlisted, 
  onWishlistToggle 
}) => {
  // ...
};
```

---

## 📚 Resources

- [React Components Guide](https://react.dev/learn/your-first-component)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Component Composition Patterns](https://react.dev/learn/passing-props-to-a-component)

---

## ✨ Next: Component Library

Once refactored, you could create:
- Storybook for component documentation
- Component library for reuse across projects
- Visual regression testing
- Automated component documentation

---

**Decision**: Keep as-is for now, refactor only if needed! 🚀
