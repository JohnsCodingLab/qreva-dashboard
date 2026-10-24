export const getInputBorderColor = (error, touched, value) => {
  if (error && touched) return 'border-qreva-orange focus:ring-qreva-orange';
  if (!error && touched && value) return 'border-qreva-blue focus:ring-qreva-blue';
  return 'border-gray-300 focus:ring-qreva-orange';
};

/**
 * Get floating label classes
 */
export const getFloatingLabelClasses = (value, baseClasses = '') => {
  const defaultClasses = `
    absolute left-4 transition-all duration-200 pointer-events-none
    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
    peer-focus:top-2 peer-focus:text-xs peer-focus:text-qreva-navy
  `;
  
  const stateClasses = value 
    ? 'top-2 text-xs text-qreva-navy' 
    : 'top-4 text-base text-gray-400';
  
  return `${defaultClasses} ${stateClasses} ${baseClasses}`.trim();
};

/**
 * Handle keyboard submit
 */
export const createKeyPressHandler = (callback, condition = true) => {
  return (e) => {
    if (e.key === 'Enter' && condition) {
      e.preventDefault();
      callback();
    }
  };
};

/**
 * Validate single field
 */
export const validateField = async (schema, fieldName, value) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    return error.message;
  }
};