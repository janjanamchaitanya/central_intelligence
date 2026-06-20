# Claude Code - Payment Brain Design System Guide

## 🎯 Quick Start for Claude

When working on this project, you are implementing the **Payment Brain Design System** - a production-ready, banking-grade UI system. Every decision must pass the brand personality test.

### The 5-Second Check
Before writing any code, ask:
1. **Does it build trust?** (Trustworthy Guardian)
2. **Is it calm?** (Calm Authority - especially in errors)
3. **Does it explain why?** (Radical Transparency)
4. **Is friction proportional?** (Low-risk = low friction)
5. **Is security invisible?** (Works silently)

---

## 📚 File Structure

```
frontend/
├── .claude/
│   ├── README.md                    ← You are here
│   ├── design-system-prompt.md      ← Quick reference rules
│   └── component-template.jsx       ← Template for new components
├── DESIGN_SYSTEM_RULES.md           ← Complete design system specification
├── tailwind.config.js               ← All design tokens defined here
├── src/
│   ├── components/                  ← Reusable design system components
│   │   ├── Alert.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── TransactionItem.jsx
│   │   └── index.js
│   └── pages/
│       └── Dashboard.jsx            ← Example implementation
```

---

## 🎨 Design Token Quick Reference

### Colors (NEVER use Tailwind defaults)
```
Primary:     bg-primary-600 text-primary-600
Success:     bg-success text-success
Warning:     bg-warning text-warning
Danger:      bg-danger text-danger
Info:        bg-info text-info
Debit:       text-debit (#DC2626)
Credit:      text-credit (#059669)
Neutral:     bg-neutral-{50,100,200,400,500,700,900}
```

### Typography (ONLY these classes)
```
text-display-xl   (36px) - Balance hero
text-display-lg   (28px) - Screen titles
text-h1          (22px) - Page headings
text-h2          (18px) - Section headings
text-h3          (16px) - Card titles
text-body-lg     (15px) - Primary body
text-body        (14px) - Secondary body
text-caption     (13px) - Metadata
text-label       (11px) - Form labels (UPPERCASE)
text-numeric-lg  (20px) - Amounts
text-numeric-sm  (14px) - Table amounts
```

### Spacing (8-point grid ONLY)
```
space-1  (4px)  - Icon gaps only
space-2  (8px)  - Touch target gaps
space-4  (16px) - Form fields, card padding
space-6  (24px) - Section padding
space-8  (32px) - Major sections
space-10 (40px) - Page sections
space-12 (48px) - Hero padding
space-16 (64px) - Desktop margins
```

### Radius (Semantic)
```
rounded-sm   (4px)  - Badges, chips
rounded-md   (8px)  - Buttons, inputs
rounded-lg   (12px) - Cards, panels
rounded-xl   (16px) - Hero cards, bottom sheets
rounded-pill (999px)- Status labels, badges ONLY
```

### Shadows (Elevation)
```
shadow-level-0  - Flat (page backgrounds)
shadow-level-1  - Resting cards
shadow-level-2  - Interactive/hover cards
shadow-level-3  - Floating (dropdowns, tooltips)
shadow-level-4  - Modals, overlays
shadow-alert-{warning,danger,success,info}  - Alert cards
```

---

## 🔧 Common Tasks

### Task 1: Create a New Component

1. **Copy template**: Start from `.claude/component-template.jsx`
2. **Define purpose**: What does this component do?
3. **Check brand alignment**: Does it pass the 5-second check?
4. **Implement**:
   ```jsx
   import PropTypes from 'prop-types';

   const MyComponent = ({ variant, size, children }) => {
     const baseStyles = 'transition-all duration-150';
     const variants = {
       primary: 'bg-primary-600 text-white',
       // Use design system tokens ONLY
     };

     return (
       <div className={`${baseStyles} ${variants[variant]}`}>
         {children}
       </div>
     );
   };

   MyComponent.propTypes = {
     variant: PropTypes.oneOf(['primary', 'secondary']),
     size: PropTypes.oneOf(['sm', 'md', 'lg']),
     children: PropTypes.node.isRequired,
   };

   export default MyComponent;
   ```

5. **Export**: Add to `src/components/index.js`

### Task 2: Display an Amount

```jsx
// ✓ CORRECT - Tabular numerals + Indian format + Color + Icon + Sign
const DebitAmount = ({ amount }) => (
  <span className="text-numeric-lg tabular-nums text-debit flex items-center gap-1">
    ↗ − ₹{new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}
  </span>
);

const CreditAmount = ({ amount }) => (
  <span className="text-numeric-lg tabular-nums text-credit flex items-center gap-1">
    ↙ + ₹{new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}
  </span>
);
```

### Task 3: Create a Form

```jsx
const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');

  return (
    <Card className="p-6">
      <h2 className="text-h2 text-neutral-900 mb-6">Quick Payment</h2>

      <div className="space-y-4">
        <Input
          label="Enter UPI ID"
          name="upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="name@upi"
          required
        />

        <Input
          label="Amount"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          isAmount={true}
          required
        />

        <div className="flex gap-4">
          <Button variant="primary" className="flex-1">
            Pay Now
          </Button>
          <Button variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
```

### Task 4: Show an Alert

```jsx
// Calm, measured language - NO panic
<Alert
  severity="warning"
  title="Unusual Activity Detected"
  message="We noticed a payment of ₹45,000 to a new merchant. This is higher than your usual spending pattern."
  dismissible={true}
  onDismiss={handleDismiss}
  action={
    <div className="flex gap-3 mt-2">
      <Button variant="primary" size="sm">
        Review Transaction
      </Button>
      <Button variant="ghost" size="sm">
        Dismiss
      </Button>
    </div>
  }
/>

// ❌ WRONG - Panic language
<Alert severity="danger" message="ERROR! PAYMENT FAILED!" />
```

### Task 5: Create a Transaction List

```jsx
const transactions = [
  {
    id: 1,
    merchantName: 'Amazon India',
    category: 'E-commerce',
    rail: 'UPI',
    time: '2 hours ago',
    amount: 2500,
    type: 'debit',
    status: 'success',
    icon: '🛒',
  },
  // ... more transactions
];

return (
  <Card>
    <h2 className="text-h2 mb-6">Recent Transactions</h2>
    <div className="divide-y divide-neutral-200 -mx-6">
      {transactions.map((txn) => (
        <TransactionItem
          key={txn.id}
          {...txn}
          onClick={() => handleTransactionClick(txn.id)}
        />
      ))}
    </div>
  </Card>
);
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T - Tailwind Defaults
```jsx
// WRONG
<button className="bg-blue-600 text-white">Pay Now</button>
<p className="text-red-600">Error occurred</p>
<div className="shadow-md p-4">Card</div>
```

### ✅ DO - Design System Tokens
```jsx
// CORRECT
<Button variant="primary">Pay Now</Button>
<p className="text-danger">Error occurred</p>
<Card className="p-6">Card content</Card>
```

---

### ❌ DON'T - Color Alone
```jsx
// WRONG - Color is sole differentiator
<span className="text-red-600">₹12,500.00</span>
```

### ✅ DO - Color + Icon + Sign
```jsx
// CORRECT
<span className="text-debit flex items-center gap-1 tabular-nums">
  ↗ − ₹12,500.00
</span>
```

---

### ❌ DON'T - Missing Tabular Numerals
```jsx
// WRONG - Numbers will jump during updates
<div className="text-2xl">₹100,000.00</div>
```

### ✅ DO - Tabular Numerals Always
```jsx
// CORRECT
<div className="text-numeric-lg tabular-nums">₹1,00,000.00</div>
```

---

### ❌ DON'T - Small Touch Targets
```jsx
// WRONG - Too small for touch
<button className="p-1" onClick={handleClose}>✕</button>
```

### ✅ DO - Minimum 44×44px
```jsx
// CORRECT
<button
  className="min-h-touch min-w-touch p-2"
  onClick={handleClose}
  aria-label="Close"
>
  ✕
</button>
```

---

### ❌ DON'T - Aggressive Error Copy
```jsx
// WRONG
<Alert severity="danger" message="ERROR! PAYMENT FAILED! TRY AGAIN!" />
```

### ✅ DO - Calm, Helpful Copy
```jsx
// CORRECT
<Alert
  severity="danger"
  message="Something went wrong — your money is safe. Please try again or contact support."
/>
```

---

## 🎨 Layout Patterns

### Two-Column Dashboard
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Main Content - 2 columns */}
  <div className="lg:col-span-2 space-y-8">
    <Card>Main content</Card>
  </div>

  {/* Sidebar - 1 column */}
  <div className="space-y-6">
    <Card>Sidebar widget</Card>
  </div>
</div>
```

### Responsive Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Content */}
</div>
```

### Form Layout
```jsx
<Card className="p-6">
  <h2 className="text-h2 mb-6">Form Title</h2>

  <div className="space-y-4">
    <Input label="Field 1" name="field1" />
    <Input label="Field 2" name="field2" />

    <div className="flex gap-4 pt-4">
      <Button variant="primary" className="flex-1">
        Submit
      </Button>
      <Button variant="secondary">
        Cancel
      </Button>
    </div>
  </div>
</Card>
```

---

## 🔍 Testing Checklist

Before marking any task complete, verify:

### Visual
- [ ] All colors from design system (no `blue-500`, `red-600`)
- [ ] Typography uses scale (no `text-2xl`, `text-lg`)
- [ ] Spacing uses 8-point grid (no `p-3`, `m-7`)
- [ ] Radius is semantic (correct token for type)
- [ ] Shadows use elevation system
- [ ] All amounts use `tabular-nums`
- [ ] Indian format (₹1,00,000.00 not ₹100,000.00)
- [ ] Debit/credit has color + icon + sign

### Interaction
- [ ] Touch targets 44×44px minimum
- [ ] Touch targets have 8px gaps
- [ ] Hover states correct (shadow-level-1, lighten 8%)
- [ ] Focus rings 2px + 2px offset
- [ ] Active states scale(0.98)
- [ ] Transitions 150ms ease

### Accessibility
- [ ] Color contrast 4.5:1 minimum
- [ ] ARIA labels on icon-only buttons
- [ ] `role="alert"` on alerts
- [ ] `aria-live` on critical alerts
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

### Content
- [ ] Copy is calm (no "ERROR!", "FAILED!")
- [ ] Errors explain what + next steps
- [ ] Action buttons use clear verbs
- [ ] Labels are descriptive

---

## 📖 Reference Documents

1. **Quick Rules**: `.claude/design-system-prompt.md` (start here)
2. **Complete Spec**: `DESIGN_SYSTEM_RULES.md` (full reference)
3. **Tailwind Config**: `tailwind.config.js` (all tokens)
4. **Example Page**: `src/pages/Dashboard.jsx` (see it in action)
5. **Component Template**: `.claude/component-template.jsx` (copy this)

---

## 🚀 Development Workflow

### When Creating a New Feature

1. **Read the requirement** - Understand what needs to be built
2. **Check brand alignment** - Does it pass the 5-second check?
3. **Choose existing components** - Use components from `src/components/`
4. **If new component needed**:
   - Copy `.claude/component-template.jsx`
   - Follow template structure exactly
   - Add to `src/components/index.js`
5. **Implement using design tokens** - NO Tailwind defaults
6. **Test against checklist** - Visual + Interaction + A11y + Content
7. **Review against principles** - Trustworthy? Calm? Transparent?

### When Modifying Existing Code

1. **Read current implementation** - Understand existing patterns
2. **Maintain consistency** - Follow established patterns
3. **Don't break design system** - Keep token usage
4. **Test thoroughly** - Ensure no regressions
5. **Document changes** - If adding new patterns

---

## 🎯 Your Mission

You are building a **cognitive intelligence platform** for banking. Users trust you with their financial lives. Every pixel, every word, every interaction must reinforce:

1. **Competence** - We know what we're doing
2. **Protection** - We're guarding your money
3. **Clarity** - We explain everything
4. **Calmness** - We don't panic, even in fraud situations
5. **Respect** - We value your time and intelligence

**This is not just a design system. It's a trust system.**

---

**Payment Brain Design System v1.0 · For Claude Code Use**
