import PropTypes from 'prop-types';

/**
 * Card Component - Payment Brain Design System
 * Radius: lg (12px) for primary cards, xl (16px) for hero cards
 * Elevation: level-1 for resting, level-2 for hover
 */
const Card = ({ children, className = '', hover = false, elevated = false, ...props }) => {
  const baseStyles = 'bg-white rounded-lg p-6';
  const shadowStyles = elevated ? 'shadow-level-2' : 'shadow-level-1';
  const hoverStyles = hover ? 'hover:shadow-level-2 transition-shadow duration-200 cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${shadowStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  elevated: PropTypes.bool,
};

export default Card;
