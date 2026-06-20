import PropTypes from 'prop-types';

/**
 * Transaction List Item Component - Payment Brain Design System
 * Based on Section 07 - Transaction List Item Anatomy
 * Implements debit/credit display with color + icon + sign prefix
 */
const TransactionItem = ({
  merchantName,
  category,
  rail,
  time,
  amount,
  type = 'debit', // 'debit' or 'credit'
  status = 'success',
  onClick,
  icon,
  className = '',
}) => {
  const statusConfig = {
    success: { label: 'SUCCESS', color: 'bg-success text-white' },
    pending: { label: 'PENDING', color: 'bg-neutral-400 text-white' },
    failed: { label: 'FAILED', color: 'bg-danger text-white' },
    reversed: { label: 'REVERSED', color: 'bg-neutral-500 text-white' },
  };

  const typeConfig = {
    debit: {
      color: 'text-debit',
      icon: '↗',
      prefix: '−',
    },
    credit: {
      color: 'text-credit',
      icon: '↙',
      prefix: '+',
    },
  };

  const currentStatus = statusConfig[status];
  const currentType = typeConfig[type];

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amt);
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer border-b border-neutral-200 last:border-0 min-h-touch ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Leading Icon */}
      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <span className="text-primary-700 text-xl">{icon || '💳'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-body-lg font-medium text-neutral-900 truncate">
          {merchantName}
        </p>
        <p className="text-caption text-neutral-500">
          {category} · {rail} · {time}
        </p>
      </div>

      {/* Amount & Status */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <p className={`text-h3 font-medium tabular-nums ${currentType.color} flex items-center gap-1`}>
          <span className="text-sm">{currentType.icon}</span>
          {currentType.prefix} {formatAmount(amount)}
        </p>
        <span className={`text-label uppercase px-2 py-0.5 rounded-pill ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </div>

      {/* Trailing Chevron */}
      {onClick && (
        <svg
          className="w-5 h-5 text-neutral-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
};

TransactionItem.propTypes = {
  merchantName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  rail: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['debit', 'credit']),
  status: PropTypes.oneOf(['success', 'pending', 'failed', 'reversed']),
  onClick: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default TransactionItem;
