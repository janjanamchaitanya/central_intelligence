import PropTypes from 'prop-types';

/**
 * Alert Component - Payment Brain Design System
 * Based on Section 08 - Alert & State Patterns
 * Severity levels: CRITICAL, WARNING, INFO, DIGEST
 */
const Alert = ({
  severity = 'info',
  title,
  message,
  onDismiss,
  dismissible = true,
  action,
  className = '',
}) => {
  const severityConfig = {
    critical: {
      bg: 'bg-danger-bg',
      border: 'border-l-[3px] border-danger',
      shadow: 'shadow-alert-danger',
      icon: '🛡️',
      textColor: 'text-neutral-900',
    },
    warning: {
      bg: 'bg-warning-bg',
      border: 'border-l-[3px] border-warning',
      shadow: 'shadow-alert-warning',
      icon: '⚠️',
      textColor: 'text-neutral-900',
    },
    info: {
      bg: 'bg-info-bg',
      border: 'border-l-[2px] border-info',
      shadow: 'shadow-alert-info',
      icon: 'ℹ️',
      textColor: 'text-neutral-900',
    },
    success: {
      bg: 'bg-success-bg',
      border: 'border-l-[3px] border-success',
      shadow: 'shadow-alert-success',
      icon: '✓',
      textColor: 'text-neutral-900',
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      className={`${config.bg} ${config.border} ${config.shadow} rounded-md p-4 ${className} min-h-touch`}
      role="alert"
      aria-live={severity === 'critical' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-body-lg font-medium ${config.textColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-body ${config.textColor}`}>{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 p-1 min-w-touch min-h-touch"
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  severity: PropTypes.oneOf(['critical', 'warning', 'info', 'success']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
  dismissible: PropTypes.bool,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default Alert;
