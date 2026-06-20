import PropTypes from 'prop-types';

/**
 * Button Component - Payment Brain Design System
 * Based on Section 07 - Component Anatomy
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  icon,
  ...props
}) => {
  const baseStyles = 'rounded-md font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 min-h-touch';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-level-1 focus:ring-primary-600 active:scale-[0.98] active:bg-primary-800',
    secondary: 'bg-white text-primary-600 border border-[#C2DEFA] hover:bg-primary-50 hover:shadow-level-1 focus:ring-primary-600 active:scale-[0.98]',
    danger: 'bg-danger text-white hover:bg-red-700 hover:shadow-level-1 focus:ring-danger active:scale-[0.98] active:bg-red-800',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-600',
  };

  const sizes = {
    sm: 'h-11 px-4 text-sm',
    md: 'h-12 px-6 text-body-lg',
    lg: 'h-14 px-8 text-h3',
  };

  const variantClass = disabled ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed' : variants[variant];

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClass} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  icon: PropTypes.node,
};

export default Button;
