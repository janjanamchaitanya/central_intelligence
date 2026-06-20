import PropTypes from 'prop-types';

/**
 * [ComponentName] - Payment Brain Design System
 *
 * Purpose: [Brief description of what this component does]
 * Design System Reference: [Section from design system PDF]
 *
 * Brand Alignment:
 * - Trustworthy Guardian: [How this component builds trust]
 * - Calm Authority: [How this component stays calm under stress]
 * - Radical Transparency: [How this component explains itself]
 *
 * Accessibility:
 * - Touch targets: [44×44px minimum]
 * - ARIA: [role, aria-label, aria-live, etc.]
 * - Color contrast: [4.5:1 for text, 3:1 for UI]
 * - Keyboard navigation: [Tab order, Enter/Space actions]
 */
const ComponentName = ({
  // Required props
  children,

  // Optional props with defaults
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',

  // Event handlers
  onClick,

  // Spread remaining props
  ...props
}) => {
  // ========================================
  // CONFIGURATION
  // ========================================

  // Base styles - always applied
  const baseStyles = 'transition-all duration-150 ease-in-out focus:outline-none';

  // Variants - use design system tokens only
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600',
    secondary: 'bg-white text-primary-600 border border-[#C2DEFA] hover:bg-primary-50',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  };

  // Sizes - use 8-point grid spacing
  const sizes = {
    sm: 'h-11 px-4 text-sm',
    md: 'h-12 px-6 text-body-lg',
    lg: 'h-14 px-8 text-h3',
  };

  // ========================================
  // COMPUTED STYLES
  // ========================================

  const variantClass = disabled
    ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
    : variants[variant];

  const sizeClass = sizes[size];

  // ========================================
  // RENDER
  // ========================================

  return (
    <element
      className={`
        ${baseStyles}
        ${variantClass}
        ${sizeClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      // Add more ARIA attributes as needed
      role="..." // If applicable
      aria-label="..." // If applicable
      {...props}
    >
      {children}
    </element>
  );
};

// ========================================
// PROP TYPES
// ========================================

ComponentName.propTypes = {
  // Required
  children: PropTypes.node.isRequired,

  // Optional
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,

  // Functions
  onClick: PropTypes.func,
};

// ========================================
// USAGE EXAMPLES
// ========================================

/**
 * Basic Usage:
 * <ComponentName variant="primary" size="md">
 *   Pay Now
 * </ComponentName>
 *
 * With Accessibility:
 * <ComponentName
 *   variant="danger"
 *   onClick={handleBlock}
 *   aria-label="Block payment"
 * >
 *   Block
 * </ComponentName>
 *
 * Disabled State:
 * <ComponentName variant="primary" disabled>
 *   Processing...
 * </ComponentName>
 */

export default ComponentName;

// ========================================
// DESIGN SYSTEM CHECKLIST
// ========================================

/**
 * Before shipping, verify:
 *
 * ✓ Colors use design system tokens (no Tailwind defaults)
 * ✓ Typography uses design system scale (no arbitrary sizes)
 * ✓ Spacing uses 8-point grid (no odd values)
 * ✓ Border radius is semantic (correct token for component type)
 * ✓ Shadows use elevation system (if applicable)
 * ✓ Touch targets minimum 44×44px (min-h-touch)
 * ✓ Touch targets have 8px gaps (gap-2 minimum)
 * ✓ Hover states use design system transitions (150ms ease)
 * ✓ Focus rings 2px + 2px offset
 * ✓ Active states scale(0.98) (if applicable)
 * ✓ Color contrast meets 4.5:1 minimum
 * ✓ ARIA labels on icon-only elements
 * ✓ PropTypes defined for all props
 * ✓ Component follows brand personality principles
 * ✓ Copy is calm and measured (no panic language)
 */
