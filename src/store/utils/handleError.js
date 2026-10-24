import { toast } from "sonner";

/**
 * Handles API errors and displays appropriate toast messages
 * @param {Error} error - The error object from the API call
 * @param {string} customMessage - Optional custom error message
 * @returns {string} - The error message that was displayed
 */
export const handleError = (error, customMessage) => {
  let errorMessage = customMessage || 'An error occurred';

  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;

    const serverMsg = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || data?.error || (typeof data === 'string' ? data : null);

    if (serverMsg) {
      errorMessage = serverMsg;
    } else {
      // Handle specific status codes if no explicit message was returned
      switch (status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = 'A conflict occurred.';
          break;
        case 422:
          errorMessage = 'Validation failed.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          break;
      }
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from server. Please check your connection.';
  } else {
    // Error in request setup or custom throw
    errorMessage = error.message || errorMessage;
  }

  toast.error(errorMessage);
  return errorMessage;
};

/**
 * Extracts error message without showing toast (for custom handling)
 * @param {Error} error - The error object
 * @returns {string} - The error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred';
};