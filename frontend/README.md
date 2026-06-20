# Payment Brain - Frontend

> **A cognitive intelligence platform for banking and payments**

A production-ready React application implementing the Payment Brain Design System - a banking-grade UI system built on principles of trust, clarity, and calm authority.

---

## 🎨 Design System

This project implements the **Payment Brain Design System** - a complete, production-ready design system for financial applications.

### Brand Pillars
- **Trustworthy Guardian**: Every interaction signals competence and protection
- **Intelligent Advisor**: Pre-emptive intelligence, not reactive processing
- **Calm Authority**: Measured responses, even in fraud/error situations
- **Radical Transparency**: Every decision explained in plain language
- **Invisible Security**: Security works silently, becomes visible only when needed

### Key Features
- ✅ **WCAG 2.1 AA Compliant**: 4.5:1 contrast ratios, proper ARIA attributes
- ✅ **Indian Market**: Native support for ₹1,00,000.00 format (lakhs/crores)
- ✅ **Tabular Numerals**: No balance jumping during real-time updates
- ✅ **Semantic Tokens**: Every color, size, and spacing value has meaning
- ✅ **Touch-Optimized**: 44×44px minimum targets, 8px gaps
- ✅ **Banking-Grade**: Calm error states, proportional friction

### 📖 Documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete implementation details
- **[DESIGN_SYSTEM_RULES.md](DESIGN_SYSTEM_RULES.md)** - Full design system specification
- **[.claude/README.md](.claude/README.md)** - Quick start for Claude Code

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env

# 3. Start development server
npm run dev
```

Application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build with production optimizations
npm run build:prod

# Preview production build
npm run preview
```

---

## 🎯 Tech Stack

### Core
- ⚛️ **React 19** - Latest React with hooks and functional components
- 🔄 **Redux Toolkit** - Modern state management
- 🎨 **Tailwind CSS v3** - Utility-first CSS with custom design tokens
- ⚡ **Vite** - Lightning-fast build tool and dev server

### UI/UX
- 🎨 **Payment Brain Design System** - Complete banking-grade UI system
- 🔤 **Inter Font** - Optimized for screen legibility
- ♿ **WCAG 2.1 AA** - Full accessibility compliance
- 📱 **Responsive** - Mobile-first design, works perfectly on all devices

### Development
- 🔧 **ESLint** - Code quality and consistency
- 📝 **PropTypes** - Runtime type checking
- 🔌 **API Service Layer** - Centralized HTTP client
- 🪝 **Custom Hooks** - Reusable logic (useDebounce, etc.)

---

## 📁 Project Structure

```
frontend/
├── .claude/                          # Claude Code AI instructions
│   ├── README.md                     # Quick start for AI
│   ├── design-system-prompt.md       # Design system rules for AI
│   └── component-template.jsx        # Template for new components
│
├── src/
│   ├── components/                   # Design system components
│   │   ├── Alert.jsx                 # Critical/Warning/Info/Success alerts
│   │   ├── Badge.jsx                 # Status labels, trust badges
│   │   ├── Button.jsx                # Primary/Secondary/Danger/Ghost
│   │   ├── Card.jsx                  # Container with elevation
│   │   ├── Input.jsx                 # Form input with states + amount variant
│   │   ├── Spinner.jsx               # Loading states
│   │   ├── TransactionItem.jsx       # Debit/credit list item
│   │   └── index.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx             # Example: Full dashboard implementation
│   │   └── Home.jsx                  # Example: Landing page
│   │
│   ├── features/                     # Redux slices (domain logic)
│   │   └── example/exampleSlice.js
│   │
│   ├── store/                        # Redux store configuration
│   │   └── index.js
│   │
│   ├── services/                     # API and external services
│   │   └── api.js
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useDebounce.js
│   │
│   ├── utils/                        # Utility functions
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── constants/                    # App constants
│   │   └── index.js
│   │
│   ├── layouts/                      # Layout components
│   │   └── MainLayout.jsx
│   │
│   ├── assets/                       # Static assets
│   │
│   ├── App.jsx                       # Root component
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles + Tailwind
│
├── DESIGN_SYSTEM_RULES.md            # Complete design system spec
├── IMPLEMENTATION_SUMMARY.md         # Implementation details
├── tailwind.config.js                # Design tokens configuration
├── vite.config.js                    # Build configuration
├── .env                              # Environment variables
└── package.json
```

---

## 🎨 Design System Components

### Button
```jsx
<Button
  variant="primary"    // primary | secondary | danger | ghost
  size="md"           // sm | md | lg
  icon={<Icon />}
  onClick={handleClick}
>
  Pay Now
</Button>
```

### Input
```jsx
<Input
  label="Amount"
  name="amount"
  isAmount={true}      // Shows ₹ prefix, tabular numerals
  value={amount}
  onChange={handleChange}
  error={errorMessage}
  required
/>
```

### Alert
```jsx
<Alert
  severity="warning"   // critical | warning | info | success
  title="Unusual Activity Detected"
  message="We noticed a payment of ₹45,000 to a new merchant."
  dismissible
  onDismiss={handleDismiss}
  action={<Button>Review</Button>}
/>
```

### Transaction Item
```jsx
<TransactionItem
  merchantName="Amazon India"
  category="E-commerce"
  rail="UPI"
  time="2 hours ago"
  amount={2500}
  type="debit"        // Shows: ↗ − ₹2,500.00 (red)
  status="success"
  icon="🛒"
  onClick={handleClick}
/>
```

### Card
```jsx
<Card hover elevated>
  <h2 className="text-h2">Card Title</h2>
  <p className="text-body">Card content</p>
</Card>
```

---

## 🎯 Design Tokens

### Colors
```
Primary (Trust Blue):    bg-primary-600 text-primary-600
Success (Green):         bg-success text-success
Warning (Amber):         bg-warning text-warning
Danger (Red):            bg-danger text-danger
Info (Blue):             bg-info text-info
Debit (Red):             text-debit
Credit (Green):          text-credit
Neutral:                 bg-neutral-{50,100,200,400,500,700,900}
```

### Typography
```
text-display-xl  (36px) - Balance hero
text-display-lg  (28px) - Screen titles
text-h1          (22px) - Page headings
text-h2          (18px) - Section headings
text-h3          (16px) - Card titles
text-body-lg     (15px) - Primary body
text-body        (14px) - Secondary body
text-caption     (13px) - Metadata
text-label       (11px) - Form labels
text-numeric-lg  (20px) - Transaction amounts
```

### Spacing (8-Point Grid)
```
space-1  (4px)  - Icon gaps
space-2  (8px)  - Touch target gaps
space-4  (16px) - Form fields
space-6  (24px) - Card padding
space-8  (32px) - Section gaps
space-16 (64px) - Page margins
```

### Border Radius
```
rounded-sm   (4px)  - Badges
rounded-md   (8px)  - Buttons, inputs
rounded-lg   (12px) - Cards
rounded-xl   (16px) - Hero cards
rounded-pill (999px)- Status labels
```

### Elevation
```
shadow-level-0  - Flat
shadow-level-1  - Resting cards
shadow-level-2  - Hover/interactive
shadow-level-3  - Floating elements
shadow-level-4  - Modals
shadow-alert-{warning,danger,success,info}
```

---

## 🔐 Design Principles

### 1. Debit/Credit Display - Triple Signaling
```jsx
// ✓ CORRECT - Color + Icon + Sign Prefix
<span className="text-debit tabular-nums">↗ − ₹12,500.00</span>
<span className="text-credit tabular-nums">↙ + ₹85,000.00</span>

// ✗ WRONG - Color alone (accessibility fail)
<span className="text-red-600">₹12,500.00</span>
```

### 2. Indian Number Format
```jsx
// ✓ CORRECT
₹1,00,000.00  (One lakh)
₹10,00,000.00 (Ten lakh, NOT ₹10L)

// ✗ WRONG
₹100,000.00   (Western format)
₹10L          (Abbreviated)
```

### 3. Tabular Numerals - Always
```jsx
// ✓ CORRECT - Prevents jumping
<span className="tabular-nums">₹1,00,000.00</span>

// ✗ WRONG - Numbers will jump
<span>₹1,00,000.00</span>
```

### 4. Calm Error States
```jsx
// ✓ CORRECT - Calm, helpful
<Alert severity="danger">
  Something went wrong — your money is safe.
  Please try again or contact support.
</Alert>

// ✗ WRONG - Panic-inducing
<Alert severity="danger">
  ERROR! PAYMENT FAILED! TRY AGAIN!
</Alert>
```

---

## 📱 Responsive Breakpoints

```
Mobile:  < 768px  (4 columns, 16px gutters)
Tablet:  768-1024px (8 columns, 24px gutters)
Desktop: > 1024px (12 columns, 32px gutters, 1280px max-width)
```

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- ✅ 4.5:1 contrast for body text
- ✅ 3:1 contrast for UI components
- ✅ 44×44px minimum touch targets
- ✅ 8px gaps between adjacent targets
- ✅ ARIA labels and live regions
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### Best Practices
```jsx
// ARIA labels on icon-only buttons
<button aria-label="Close alert">✕</button>

// Live regions for alerts
<div role="alert" aria-live="assertive">Critical alert</div>

// Accessible form inputs
<Input
  label="Amount"
  name="amount"
  aria-invalid={hasError}
  aria-describedby="amount-error"
/>
```

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run build:prod   # Build with production env
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint errors
```

---

## 🌍 Environment Variables

Create `.env` file (use `.env.example` as template):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

All environment variables must be prefixed with `VITE_` to be accessible:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 📦 Production Optimizations

- ✅ Code splitting (vendor, Redux chunks)
- ✅ Tree-shaking and minification
- ✅ Optimized CSS with Tailwind purge
- ✅ Source maps disabled in production
- ✅ Chunk size warnings configured
- ✅ Path aliases for cleaner imports

---

## 🧪 Working with Claude Code

This project includes AI-friendly documentation:

1. **[.claude/README.md](.claude/README.md)** - Quick start guide
2. **[.claude/design-system-prompt.md](.claude/design-system-prompt.md)** - Design rules
3. **[.claude/component-template.jsx](.claude/component-template.jsx)** - Component template

When creating new components, Claude Code will automatically follow the Payment Brain Design System rules.

---

## 📖 Learn More

- [Payment Brain Design System Rules](DESIGN_SYSTEM_RULES.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 🤝 Contributing

1. Read [DESIGN_SYSTEM_RULES.md](DESIGN_SYSTEM_RULES.md)
2. Create a feature branch
3. Follow design system guidelines
4. Run `npm run lint` before committing
5. Test on mobile and desktop
6. Submit a pull request

---

## 📄 License

MIT

---

## 🎯 Project Status

✅ **Production Ready**

- Complete design system implementation
- All core components built and tested
- Full accessibility compliance (WCAG 2.1 AA)
- Responsive layouts for mobile/tablet/desktop
- Example dashboard implementation
- Comprehensive documentation

---

**Payment Brain Design System v1.0**

*This is a cognitive intelligence platform, not just a UI library. Every pixel reinforces trust.*
