# Payment Brain Design System - Quick Start

## 🚀 Get Started in 3 Minutes

### 1. Install & Run
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the dashboard

---

## 🎨 Design System at a Glance

### Core Principles
✅ **Trustworthy Guardian** - Every interaction signals competence and protection  
✅ **Calm Authority** - No panic colors, measured responses  
✅ **Radical Transparency** - Explain every decision  
✅ **Proportional Friction** - Friction scales with risk  
✅ **Invisible Security** - Security works silently  

---

## 📦 Components Quick Reference

### Button
```jsx
<Button variant="primary" size="md">Pay Now</Button>
```
Variants: `primary` | `secondary` | `danger` | `ghost`

### Input
```jsx
<Input label="Amount" name="amount" isAmount={true} />
```
Shows ₹ prefix, tabular numerals

### Alert
```jsx
<Alert severity="warning" message="Clear explanation" />
```
Severity: `critical` | `warning` | `info` | `success`

### Transaction
```jsx
<TransactionItem amount={2500} type="debit" status="success" />
```
Shows: ↗ − ₹2,500.00 (red) for debit

### Card
```jsx
<Card hover elevated>Content</Card>
```
Elevation levels 1-2, 12px radius

---

## 🎯 Golden Rules

### 1. Color = Design Token
```jsx
✅ bg-primary-600 text-danger
❌ bg-blue-600 text-red-600
```

### 2. Amount = Tabular + Indian Format
```jsx
✅ <span className="tabular-nums">₹1,00,000.00</span>
❌ <span>₹100,000.00</span>
```

### 3. Debit/Credit = Color + Icon + Sign
```jsx
✅ <span className="text-debit">↗ − ₹2,500.00</span>
❌ <span className="text-red-600">₹2,500.00</span>
```

### 4. Spacing = 8-Point Grid
```jsx
✅ p-6 gap-4 mb-8
❌ p-5 gap-3 mb-7
```

### 5. Errors = Calm Language
```jsx
✅ "Something went wrong — your money is safe"
❌ "ERROR! PAYMENT FAILED!"
```

---

## 🔧 Essential Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | All design tokens |
| `src/components/` | Pre-built components |
| `src/pages/Dashboard.jsx` | Complete example |
| `DESIGN_SYSTEM_RULES.md` | Full specification |
| `.claude/README.md` | Claude Code guide |

---

## 📊 Design Token Cheat Sheet

### Colors
```
bg-primary-600      Trust Blue
bg-success          Green (#059669)
bg-warning          Amber (#D97706)
bg-danger           Red (#DC2626)
bg-info             Blue (#1455A8)
text-debit          Red for outgoing
text-credit         Green for incoming
```

### Typography
```
text-display-xl     36px - Balance hero
text-h1             22px - Page titles
text-h2             18px - Section titles
text-body-lg        15px - Primary text
text-numeric-lg     20px - Amounts
```

### Spacing
```
space-4 (16px)      Standard gap
space-6 (24px)      Card padding
space-8 (32px)      Section gap
```

### Radius
```
rounded-md (8px)    Buttons, inputs
rounded-lg (12px)   Cards
rounded-pill        Status badges
```

### Shadows
```
shadow-level-1      Resting cards
shadow-level-2      Hover/active
shadow-alert-warning  Amber glow
```

---

## ✅ Pre-Flight Checklist

Before shipping ANY component:

- [ ] Uses design system tokens (no Tailwind defaults)
- [ ] Typography from design scale (no arbitrary sizes)
- [ ] Spacing uses 8-point grid
- [ ] Border radius is semantic
- [ ] Touch targets 44×44px minimum
- [ ] Color contrast 4.5:1 minimum
- [ ] ARIA labels on icon buttons
- [ ] PropTypes defined
- [ ] Calm, helpful copy (no panic)

---

## 🎓 Learn More

- Full Rules: `DESIGN_SYSTEM_RULES.md`
- Implementation: `IMPLEMENTATION_SUMMARY.md`
- Main README: `README.md`
- Claude Guide: `.claude/README.md`

---

**Payment Brain Design System v1.0**

*Banking-grade UI system built on trust, clarity, and calm authority*
