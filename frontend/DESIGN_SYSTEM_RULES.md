# Payment Brain Design System Rules

## Core Principles - ALWAYS FOLLOW

### 1. Brand Personality (Non-Negotiable)
- **Trustworthy Guardian**: Every interaction must signal competence and protection
- **Calm Authority**: No panic colors, no aggressive copy - especially in fraud/error states
- **Radical Transparency**: Explain every decision in plain language
- **Proportional Friction**: Friction scales exactly with risk (₹200 UPI = zero friction, ₹80,000 new merchant = biometric step-up)
- **Invisible Security**: Security works silently, becomes visible only when it matters

---

## Color System Rules

### Primary Color - Trust Blue
```
RULE: Use Trust Blue (#1455A8) for all primary actions, navigation, and brand elements
✓ DO: bg-primary-600 for CTA buttons, active nav, links
✗ DON'T: Use blue variants outside the primary palette (no Tailwind blue-500, blue-700)
```

### Semantic Colors - CRITICAL RULES
```
RULE: Never use color as the sole differentiator
✓ DO: Color + Icon + Label simultaneously
✗ DON'T: Red text alone for debit, green alone for credit

SUCCESS: #059669 (green) - Payment confirmed, KYC passed, verified
WARNING: #D97706 (amber) - Attention needed, unusual activity, pre-crime
DANGER: #DC2626 (red) - Fraud detected, blocked payment, critical alert
INFO: #1455A8 (blue) - Intelligence insights, neutral information
```

### Debit/Credit Display - MANDATORY FORMAT
```
RULE: Always use Color + Icon + Sign Prefix
Debit:  − ₹12,500.00 (red text + ↗ icon + minus prefix)
Credit: + ₹85,000.00 (green text + ↙ icon + plus prefix)

✓ DO: <span className="text-debit">↗ − ₹{amount}</span>
✗ DON'T: Rely on color alone or omit sign prefix
```

---

## Typography Rules

### Font Family
```
RULE: Use Inter for all UI text
✓ DO: font-sans (already configured as Inter)
✗ DON'T: Use system fonts directly or add new font families

ONLY 2 WEIGHTS: 400 Regular, 500 Medium
✗ DON'T: Use font-bold (700), font-semibold (600), font-light (300)
```

### Type Scale - EXACT USAGE
```
Display XL (36px): Balance hero, large amount display only
Display LG (28px): Screen titles, modal primary headings
H1 (22px): Primary page headings
H2 (18px): Section headings, card primary
H3 (16px): Card titles, list group headers
Body LG (15px): Primary body, alert messages
Body (14px): Secondary body, transaction details
Caption (13px): Metadata, timestamps
Label (11px): Form labels, section labels (UPPERCASE only)
Numeric LG (20px): Transaction amounts, balance display
Numeric SM (14px): Table amounts, list item values

✓ DO: className="text-display-xl" for balance
✗ DON'T: Use arbitrary text-2xl, text-3xl classes
```

### Numeric Typography - MANDATORY
```
RULE: All amounts MUST use tabular numerals
✓ DO: className="tabular-nums" on every amount element
✗ DON'T: Display amounts without font-variant-numeric

RULE: Indian number format - ₹1,00,000.00 NOT ₹100,000.00
RULE: Always 2 decimal places - ₹89.00 NOT ₹89
RULE: Currency symbol before amount - ₹ always precedes
RULE: No abbreviation under ₹1Cr - ₹10,00,000 NEVER ₹10L
```

---

## Spacing Rules - 8-Point Grid

### Grid Adherence
```
RULE: ALL spacing must be multiples of 8px
✓ DO: space-1 (4px), space-2 (8px), space-4 (16px), space-6 (24px), space-8 (32px)
✗ DON'T: Use arbitrary values like p-3 (12px), m-7 (28px)

EXCEPTION: 4px (space-1) ONLY for icon gaps and tight inline spacing
```

### Component Spacing Standards
```
Card padding: p-6 (24px)
Button horizontal padding: px-6 (24px for md size)
Form field gap: gap-4 (16px)
Section gap: gap-8 (32px)
Page margins (desktop): mx-16 (64px)
Touch target minimum: min-h-touch (44px), min-w-touch (44px)
Touch target gap: gap-2 (8px minimum)
```

---

## Border Radius Rules - Semantic

```
RULE: Radius is semantic - tied to component category

radius-sm (4px): Badges, chips, status pills, code blocks
radius-md (8px): Buttons, inputs, small cards, tooltips
radius-lg (12px): Primary cards, panels, modals (desktop)
radius-xl (16px): Bottom sheets, hero cards, dashboard tiles
radius-pill (999px): Status labels, trust badges, toggle switches ONLY

✓ DO: rounded-md on all buttons and inputs
✗ DON'T: Use rounded-lg on buttons (reads as card container)
✗ DON'T: Use radius-pill on buttons (too playful for banking)
✗ DON'T: Use rounded-none (sharp corners undermine premium feel)
```

---

## Elevation & Shadow Rules

### Shadow Levels
```
level-0: Flat surface (page backgrounds, table rows)
level-1: Resting card (transaction items, dashboard tiles)
level-2: Interactive card (hover, focus, selected states)
level-3: Floating element (dropdowns, tooltips, popovers)
level-4: Modal/overlay (confirmation dialogs, step-up modals)

✓ DO: shadow-level-1 for default cards
✓ DO: hover:shadow-level-2 for interactive elements
✗ DON'T: Use Tailwind shadow-sm, shadow-md, shadow-lg
```

### Semantic Alert Shadows
```
RULE: Alert cards must have colored ambient shadows

Warning: shadow-alert-warning (amber glow + 3px left border)
Danger: shadow-alert-danger (red glow + 3px left border)
Success: shadow-alert-success (green glow + 3px left border)
Info: shadow-alert-info (blue glow + 2px left border)
```

---

## Component Rules

### Button Component
```
MANDATORY SPECS:
- Height: 48px (h-12)
- Horizontal padding: 24px (px-6)
- Border radius: 8px (rounded-md)
- Font size: 15px (text-body-lg)
- Min touch target: 44×44px (min-h-touch)

STATE TRANSITIONS (150ms ease):
- Hover: lighten bg 8% + shadow-level-1
- Focus: 2px primary ring + 2px offset
- Active: darken bg 10% + scale(0.98)
- Disabled: bg-neutral-100 + text-neutral-400 + cursor-not-allowed

VARIANTS:
Primary: bg-primary-600 text-white (Pay now, Confirm, Add payee)
Secondary: bg-white text-primary-600 border (Cancel, Back)
Danger: bg-danger text-white (Block account, Remove payee)
Ghost: bg-transparent text-primary-600 (Tertiary actions)

✗ DON'T: Create "success" or "outline" variants
✗ DON'T: Use pill-shaped buttons
```

### Input Field Component
```
MANDATORY SPECS:
- Height: 48px (h-12)
- Padding: 14px 16px (px-4 py-3)
- Border radius: 8px (rounded-md)
- Label: 12px (#6B7280) ALWAYS above field
- Font size: 15px (text-body-lg)

STATE BORDERS:
Default: 1px #D1D5DB
Focus: 2px #1455A8 + ring-[3px] ring-primary-600/15
Filled: 1px #D1D5DB
Error: 2px #DC2626 + bg-[#FFF5F5] + error message below
Disabled: 1px #E5E7EB + bg-neutral-100 + cursor-not-allowed

AMOUNT FIELDS:
- Height: 56px (h-14)
- ₹ prefix inside field (absolute positioned)
- Font size: 20px (text-numeric-lg)
- Tabular numerals: MANDATORY

✗ DON'T: Use placeholder labels that disappear on focus
✓ DO: Always show label above field
```

### Transaction List Item
```
MANDATORY ANATOMY:
1. Leading icon (40×40px circle, category color bg)
2. Primary text (15px #111827 weight-500, truncate 1 line)
3. Secondary text (13px #6B7280, "Category · Rail · Time")
4. Amount (16px weight-500 tabular-nums, debit/credit color)
5. Status badge (pill, 10px weight-500, semantic color)
6. Trailing chevron (→ only if tappable)

AMOUNT DISPLAY:
Debit: ↗ − ₹X.XX in red
Credit: ↙ + ₹X.XX in green

MIN HEIGHT: 44px (min-h-touch)
✗ DON'T: Make non-interactive items look clickable
```

### Alert Component
```
SEVERITY LEVELS:
CRITICAL: Red border-left 3px + shadow-alert-danger + NEVER auto-dismiss + SMS+Push+In-app
WARNING: Amber border-left 3px + shadow-alert-warning + dismissible
INFO: Blue border-left 2px + shadow-alert-info + auto-dismiss allowed
SUCCESS: Green border-left 3px + shadow-alert-success + auto-dismiss

STRUCTURE:
- Icon (semantic emoji or SVG)
- Title (optional, 15px weight-500)
- Message (14px body text)
- Action buttons (optional)
- Dismiss X (only if dismissible)

ARIA ATTRIBUTES:
role="alert"
aria-live="assertive" (CRITICAL) or "polite" (others)

✗ DON'T: Use aggressive copy ("DANGER!", "WARNING!")
✓ DO: Use calm, measured language ("We noticed unusual activity")
```

### Card Component
```
DEFAULT SPECS:
- Padding: 24px (p-6)
- Border radius: 12px (rounded-lg)
- Shadow: shadow-level-1 (resting)
- Background: bg-white

INTERACTIVE CARDS:
hover:shadow-level-2 + transition-shadow duration-200 + cursor-pointer

NESTED ELEMENTS:
✓ DO: Use smaller radius than parent (button radius-md inside card radius-lg)
✗ DON'T: Use equal radii (looks like clipping error)
```

### Badge Component
```
MANDATORY:
- Border radius: pill (999px)
- Font size: 11px (text-label)
- Text transform: UPPERCASE
- Padding: px-2 py-0.5 (sm) or px-3 py-1 (md)

VARIANTS: success, warning, danger, info, neutral, primary
USE CASES: Status labels, trust tier badges, tag elements ONLY

✗ DON'T: Use pill radius on buttons or large elements
```

---

## Accessibility Rules - WCAG 2.1 AA

### Color Contrast
```
RULE: Minimum 4.5:1 for body text, 3:1 for UI components
✓ DO: Test all color combinations with contrast checker
✗ DON'T: Use light text on light backgrounds

Primary Blue (#1455A8) on white: 4.8:1 ✓
```

### Touch Targets
```
RULE: Minimum 44×44px with 8px gap between targets
✓ DO: min-h-touch min-w-touch on all interactive elements
✗ DON'T: Place Confirm/Cancel buttons closer than 8px apart

CRITICAL: Confirm/Cancel pairs on mobile must have adequate spacing
```

### Motion
```
RULE: Respect prefers-reduced-motion
✓ DO: Alert animations fade only (no bounce, spring, shake)
✗ DON'T: Use spring animations on critical alerts
✗ DON'T: Auto-dismiss critical errors
```

### Screen Readers
```
RULE: All alerts as ARIA live regions (role="alert")
RULE: Security and payment alerts announced immediately (aria-live="assertive")
RULE: Include sr-only text for icon-only buttons

✓ DO: <button aria-label="Close alert">✕</button>
```

### Numeric Format
```
RULE: Use tabular numerals everywhere amounts appear
WHY: Prevents balance jumping during real-time updates
HOW: className="tabular-nums" or font-variant-numeric: tabular-nums
```

---

## Layout Rules - Responsive Breakpoints

### Grid System
```
Mobile (< 768px):
- 4 columns
- 16px gutter (space-4)
- 16px margin (space-4)
- 100% max-width

Tablet (768-1024px):
- 8 columns
- 24px gutter (space-6)
- 24px margin (space-6)
- 100% max-width

Desktop (> 1024px):
- 12 columns
- 32px gutter (space-8)
- 64px margin (space-16)
- 1280px max-width

✓ DO: Mobile-first design - all critical flows must work perfectly on mobile
```

---

## State Pattern Rules

### Loading States
```
SKELETON: Animated gray shimmer (never spinner for content)
ACTION: Inline spinner in button (16px, replaces label text)

✓ DO: <div className="animate-pulse bg-neutral-200 h-12 rounded-md" />
✗ DON'T: Use full-screen spinners for content loads
```

### Empty States
```
FIRST USE: Illustration + heading + single CTA (welcoming, action-oriented)
FILTERED: Simple icon + message + clear filter link (no illustration)

✓ DO: "Make your first payment" (action-oriented)
✗ DON'T: "You don't have any transactions yet" (apologetic)
```

### Error States
```
NETWORK: Inline banner + Retry option (never full screen)
VALIDATION: Field-level red border + 13px error message below
BLOCKED PAYMENT: Full-screen with Brain explanation + appeal option

COPY PATTERN: Plain language - reason + what happens next + how to fix
✓ DO: "Something went wrong — your money is safe."
✗ DON'T: "Error 500: Internal Server Error"
```

---

## Code Implementation Rules

### Class Naming
```
✓ DO: Use design system tokens
className="text-display-xl text-primary-600 mb-6"

✗ DON'T: Use arbitrary Tailwind classes
className="text-4xl text-blue-600 mb-8"
```

### Component Props
```
✓ DO: Use semantic prop names
<Button variant="primary" size="md" />

✗ DON'T: Use generic props
<Button color="blue" big={true} />
```

### Color References
```
✓ DO: Use semantic color names
className="bg-primary-600 text-danger border-success"

✗ DON'T: Use hex values or Tailwind defaults
className="bg-[#1455A8] text-red-600"
```

---

## Anti-Patterns - NEVER DO

### Design Anti-Patterns
```
✗ Square corners on user-facing components (reads as legacy)
✗ Pill-shaped buttons (too playful for banking)
✗ Color as sole differentiator (accessibility fail)
✗ Aggressive error copy ("ERROR!", "FAILED!", "DANGER!")
✗ Auto-dismissing critical alerts
✗ Spinner for content loads (use skeleton)
✗ Placeholder labels that disappear (always show label)
✗ Amount fields without tabular numerals
✗ Abbreviated amounts under ₹1Cr (₹10L)
✗ Currency symbol after amount (₹ always before)
✗ Debit/credit without icon and sign prefix
✗ Spring/bounce animations on critical alerts
✗ Touch targets smaller than 44×44px
✗ Touch targets with less than 8px gap
```

### Code Anti-Patterns
```
✗ Using Tailwind default colors (blue-500, red-600)
✗ Using font weights other than 400, 500
✗ Using spacing values not in 8-point grid
✗ Using border radius values not in design system
✗ Using shadow values not in elevation system
✗ Creating components without PropTypes
✗ Hardcoding hex values in className
✗ Using inline styles for design system properties
```

---

## Review Checklist - Before Shipping

### Visual Review
- [ ] All colors from design system palette (no Tailwind defaults)
- [ ] Typography uses design system scale (no arbitrary sizes)
- [ ] Spacing uses 8-point grid (no odd values)
- [ ] Border radius is semantic (correct token for component type)
- [ ] Shadows use elevation system (no custom shadows)
- [ ] All amounts use tabular numerals
- [ ] Indian number format (₹1,00,000.00)
- [ ] Debit/Credit has color + icon + sign prefix

### Interaction Review
- [ ] Touch targets minimum 44×44px
- [ ] Touch targets have 8px gaps
- [ ] Hover states lighten/darken correctly
- [ ] Focus rings 2px + 2px offset
- [ ] Active states scale(0.98)
- [ ] Transitions 150ms ease
- [ ] No spring/bounce on critical alerts

### Accessibility Review
- [ ] Color contrast 4.5:1 minimum
- [ ] ARIA labels on icon-only buttons
- [ ] role="alert" on all alerts
- [ ] aria-live on critical alerts
- [ ] Keyboard navigation works
- [ ] Screen reader announces properly
- [ ] prefers-reduced-motion respected

### Content Review
- [ ] Copy is calm and measured (no panic)
- [ ] Errors explain what happened + next steps
- [ ] Action buttons use clear verbs
- [ ] Labels are descriptive (not generic)
- [ ] Amounts formatted correctly
- [ ] Status badges use semantic labels

---

## Decision Framework

When implementing a new component or pattern, ask:

1. **Does it reinforce trust?** (Trustworthy Guardian)
2. **Is it calm in stress moments?** (Calm Authority)
3. **Does it explain why?** (Radical Transparency)
4. **Is friction proportional to risk?** (Proportional Friction)
5. **Does security work silently?** (Invisible Security)

If answer to any is NO → Redesign

---

## Quick Reference

### Most Used Classes
```
Buttons: h-12 px-6 rounded-md text-body-lg bg-primary-600 text-white
Inputs: h-12 px-4 py-3 rounded-md border text-body-lg tabular-nums
Cards: p-6 rounded-lg shadow-level-1 bg-white
Amounts: text-numeric-lg tabular-nums text-debit (or text-credit)
Alerts: p-4 rounded-md border-l-[3px] shadow-alert-{severity}
Badges: px-2 py-0.5 rounded-pill text-label uppercase
```

### Color Quick Reference
```
Primary: bg-primary-600 text-primary-600
Success: bg-success text-success
Warning: bg-warning text-warning
Danger: bg-danger text-danger
Info: bg-info text-info
Debit: text-debit (#DC2626)
Credit: text-credit (#059669)
```

### Spacing Quick Reference
```
Tight: gap-1 (4px) - icons only
Standard: gap-4 (16px) - form fields
Section: gap-8 (32px) - major sections
Page: mx-16 (64px) - desktop margins
```

---

**This is the source of truth. Any deviation must be documented with rationale.**

**Payment Brain Design System v1.0 · Confidential**
