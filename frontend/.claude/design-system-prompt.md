# Payment Brain Design System - Claude Instructions

You are implementing the **Payment Brain Design System** - a cognitive intelligence platform for banking and payments. Every design decision must reinforce three brand pillars: **Trustworthy Guardian**, **Intelligent Advisor**, and **Calm Authority**.

## Critical Rules - ALWAYS ENFORCE

### Brand Personality (Non-Negotiable)
1. **Trustworthy Guardian**: Signal competence and protection in every interaction
2. **Calm Authority**: No panic colors, no aggressive copy - especially in fraud/error states
3. **Radical Transparency**: Explain every decision in plain language
4. **Proportional Friction**: Friction scales with risk (₹200 UPI = zero friction, ₹80,000 new merchant = biometric step-up)
5. **Invisible Security**: Security works silently, becomes visible only when necessary

## Color System - STRICT ENFORCEMENT

### Primary Color
- **Trust Blue (#1455A8)**: Use `bg-primary-600` or `text-primary-600` for all primary actions
- **NEVER** use Tailwind's default `blue-500`, `blue-600`, etc.

### Semantic Colors - Color + Icon + Label Rule
```jsx
// ✓ CORRECT - Color + Icon + Label
<span className="text-danger flex items-center gap-1">
  ⚠ Payment blocked
</span>

// ✗ WRONG - Color alone
<span className="text-red-600">Payment blocked</span>
```

### Debit/Credit Display - MANDATORY FORMAT
```jsx
// ✓ CORRECT - Color + Icon + Sign Prefix
<span className="text-debit flex items-center gap-1 tabular-nums">
  ↗ − ₹12,500.00
</span>

<span className="text-credit flex items-center gap-1 tabular-nums">
  ↙ + ₹85,000.00
</span>

// ✗ WRONG - Missing any element
<span className="text-red-600">₹12,500.00</span>
```

## Typography - EXACT USAGE

### Font Weights
- **ONLY** use: `font-normal` (400) and `font-medium` (500)
- **NEVER** use: `font-bold`, `font-semibold`, `font-light`

### Type Scale Classes
```jsx
text-display-xl  // 36px - Balance hero only
text-display-lg  // 28px - Screen titles, modal headings
text-h1          // 22px - Primary page headings
text-h2          // 18px - Section headings
text-h3          // 16px - Card titles
text-body-lg     // 15px - Primary body, alerts
text-body        // 14px - Secondary body
text-caption     // 13px - Metadata, timestamps
text-label       // 11px - Form labels (UPPERCASE)
text-numeric-lg  // 20px - Transaction amounts
text-numeric-sm  // 14px - Table amounts
```

### Numeric Typography - MANDATORY
```jsx
// ✓ CORRECT - Tabular numerals + Indian format
<span className="text-numeric-lg tabular-nums">
  ₹1,00,000.00
</span>

// ✗ WRONG - Missing tabular-nums or wrong format
<span className="text-xl">₹100,000.00</span>
```

## Spacing - 8-Point Grid ONLY

### Allowed Spacing Values
- `space-1` (4px) - **ONLY** for icon gaps
- `space-2` (8px), `space-4` (16px), `space-6` (24px)
- `space-8` (32px), `space-10` (40px), `space-12` (48px), `space-16` (64px)

### Common Patterns
```jsx
// Card padding
<Card className="p-6">

// Form field gaps
<div className="space-y-4">

// Section gaps
<div className="space-y-8">

// Button padding
<Button className="px-6 h-12">
```

## Component Implementation Rules

### Button Component
```jsx
// ✓ CORRECT
<Button
  variant="primary"    // primary, secondary, danger, ghost
  size="md"           // sm, md, lg
  className="min-h-touch"
>
  Pay Now
</Button>

// ✗ WRONG - Don't create custom variants
<Button color="blue" big={true}>
```

**Mandatory Button Specs:**
- Height: `h-12` (48px)
- Padding: `px-6` (24px horizontal)
- Radius: `rounded-md` (8px)
- Font: `text-body-lg`
- Min touch: `min-h-touch` (44px)

### Input Component
```jsx
// ✓ CORRECT - Amount field
<Input
  label="Amount"
  name="amount"
  isAmount={true}
  value={amount}
  onChange={handleChange}
  className="tabular-nums"
/>

// ✗ WRONG - Missing label or amount props
<input type="number" placeholder="Enter amount" />
```

**Mandatory Input Specs:**
- Height: `h-12` (standard) or `h-14` (amount)
- Padding: `px-4 py-3`
- Radius: `rounded-md` (8px)
- Label: Always visible above field
- Amount fields: ₹ prefix, `tabular-nums`, `text-numeric-lg`

### Alert Component
```jsx
// ✓ CORRECT
<Alert
  severity="warning"
  title="Unusual Activity Detected"
  message="We noticed a payment of ₹45,000 to a new merchant."
  dismissible={true}
  onDismiss={handleDismiss}
/>

// ✗ WRONG - Aggressive copy
<Alert severity="danger" message="ERROR! PAYMENT FAILED!" />
```

**Alert Severity Levels:**
- `critical`: Red border-left 3px, never auto-dismiss, SMS+Push+In-app
- `warning`: Amber border-left 3px, dismissible
- `info`: Blue border-left 2px, auto-dismiss allowed
- `success`: Green border-left 3px, auto-dismiss allowed

### Transaction Item
```jsx
// ✓ CORRECT
<TransactionItem
  merchantName="Amazon India"
  category="E-commerce"
  rail="UPI"
  time="2 hours ago"
  amount={2500}
  type="debit"  // 'debit' or 'credit'
  status="success"
  icon="🛒"
/>
```

## Accessibility - WCAG 2.1 AA

### Touch Targets
```jsx
// ✓ CORRECT
<button className="min-h-touch min-w-touch p-2">
  ✕
</button>

// ✗ WRONG - Too small
<button className="p-1">✕</button>
```

### ARIA Attributes
```jsx
// ✓ CORRECT - Alert with ARIA
<div
  role="alert"
  aria-live={severity === 'critical' ? 'assertive' : 'polite'}
>
  {message}
</div>

// ✓ CORRECT - Icon button with label
<button aria-label="Close alert" className="min-h-touch">
  ✕
</button>
```

### Color Contrast
- Primary Blue (#1455A8) on white: 4.8:1 ✓
- All text must meet 4.5:1 minimum
- UI components must meet 3:1 minimum

## State Patterns

### Loading States
```jsx
// ✓ CORRECT - Skeleton loader
<div className="animate-pulse bg-neutral-200 h-12 rounded-md" />

// ✗ WRONG - Spinner for content
<div className="flex justify-center">
  <Spinner />
</div>
```

### Empty States
```jsx
// ✓ CORRECT - Action-oriented
<div className="text-center">
  <h2>Make your first payment</h2>
  <Button variant="primary">Get Started</Button>
</div>

// ✗ WRONG - Apologetic
<div>You don't have any transactions yet</div>
```

### Error States
```jsx
// ✓ CORRECT - Calm, helpful
<Alert severity="danger">
  Something went wrong — your money is safe.
  Please try again or contact support.
</Alert>

// ✗ WRONG - Panic-inducing
<Alert severity="danger">
  ERROR 500! PAYMENT FAILED! TRY AGAIN!
</Alert>
```

## Anti-Patterns - NEVER DO

### Design Anti-Patterns
❌ Square corners on user-facing components
❌ Pill-shaped buttons (too playful for banking)
❌ Color as sole differentiator
❌ Aggressive error copy ("ERROR!", "FAILED!")
❌ Auto-dismissing critical alerts
❌ Spinner for content loads (use skeleton)
❌ Placeholder labels that disappear
❌ Amount fields without `tabular-nums`
❌ Abbreviated amounts under ₹1Cr
❌ Currency symbol after amount
❌ Spring/bounce animations on critical alerts
❌ Touch targets smaller than 44×44px

### Code Anti-Patterns
❌ Using Tailwind default colors (`blue-500`, `red-600`)
❌ Using font weights other than 400, 500
❌ Using spacing values not in 8-point grid
❌ Using arbitrary border radius values
❌ Hardcoding hex values in `className`
❌ Creating components without PropTypes
❌ Using inline styles for design system properties

## Quick Reference - Most Used Patterns

### Buttons
```jsx
<Button variant="primary" size="md" className="h-12 px-6 rounded-md">
  Pay Now
</Button>
```

### Inputs
```jsx
<Input
  label="Amount"
  name="amount"
  isAmount={true}
  className="h-14 tabular-nums"
/>
```

### Cards
```jsx
<Card className="p-6 rounded-lg shadow-level-1">
  {content}
</Card>
```

### Amounts
```jsx
<span className="text-numeric-lg tabular-nums text-debit">
  ↗ − ₹12,500.00
</span>
```

### Alerts
```jsx
<Alert
  severity="warning"
  title="Attention Required"
  message="Clear, calm explanation"
  className="border-l-[3px] shadow-alert-warning"
/>
```

## Decision Framework

Before implementing any component or pattern, verify:

1. ✓ Does it reinforce trust? (Trustworthy Guardian)
2. ✓ Is it calm in stress moments? (Calm Authority)
3. ✓ Does it explain why? (Radical Transparency)
4. ✓ Is friction proportional to risk? (Proportional Friction)
5. ✓ Does security work silently? (Invisible Security)

If answer to any is NO → Redesign

## File References

- **Full Rules**: `DESIGN_SYSTEM_RULES.md`
- **Tailwind Config**: `tailwind.config.js`
- **Components**: `src/components/`
- **Example**: `src/pages/Dashboard.jsx`

---

**REMEMBER**: This is a banking platform. Every design decision impacts user trust. When in doubt, choose calm, clear, and consistent over flashy or trendy.

**Payment Brain Design System v1.0 · Confidential**
