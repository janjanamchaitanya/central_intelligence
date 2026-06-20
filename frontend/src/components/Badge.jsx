import PropTypes from 'prop-types';

/**
 * Badge/Chip Component - Payment Brain Design System
 * Used for status labels, trust tier badges, tag elements
 */
const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variants = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-danger text-white',
    info: 'bg-info text-white',
    neutral: 'bg-neutral-500 text-white',
    primary: 'bg-primary-600 text-white',
  };

  const sizes = {
    sm: 'text-label px-2 py-0.5',
    md: 'text-caption px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-pill font-medium uppercase ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'neutral', 'primary']),
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
};

export default Badge;
