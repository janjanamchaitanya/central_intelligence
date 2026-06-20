import PropTypes from 'prop-types';

/**
 * Input Field Component - Payment Brain Design System
 * Based on Section 07 - Input Field Component
 * Implements all states: Default, Focus, Filled, Error, Disabled, Amount
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  isAmount = false,
  className = '',
  ...props
}) => {
  const getInputStyles = () => {
    const base = 'w-full px-4 py-3 rounded-md transition-all duration-200 focus:outline-none tabular-nums';

    if (disabled) {
      return `${base} border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed`;
    }

    if (error) {
      return `${base} border-2 border-danger bg-[#FFF5F5] text-neutral-900 focus:ring-[3px] focus:ring-danger/15`;
    }

    if (value) {
      return `${base} border border-neutral-400 bg-white text-neutral-900 focus:border-2 focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15`;
    }

    return `${base} border border-neutral-400 bg-white text-neutral-900 focus:border-2 focus:border-primary-600 focus:ring-[3px] focus:ring-primary-600/15`;
  };

  const inputHeight = isAmount ? 'h-14' : 'h-12';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-caption font-medium mb-2 ${error ? 'text-danger' : 'text-neutral-500'}`}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {isAmount && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-numeric-lg text-neutral-700">
            ₹
          </span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${getInputStyles()} ${inputHeight} ${isAmount ? 'pl-10 text-numeric-lg' : 'text-body-lg'}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-caption text-danger flex items-center gap-1"
        >
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  isAmount: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
