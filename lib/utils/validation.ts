// Validation utilities

/**
 * Validates email format using a comprehensive regex
 * Based on HTML5 email validation spec with additional checks
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const trimmed = email.trim().toLowerCase();

  // Check length
  if (trimmed.length < 5 || trimmed.length > 254) return false;

  // Comprehensive email regex
  // - Allows alphanumeric, dots, hyphens, underscores, plus signs in local part
  // - Requires @ symbol
  // - Allows alphanumeric and hyphens in domain
  // - Requires at least 2 character TLD
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  return emailRegex.test(trimmed);
}

/**
 * Validates password strength
 * Returns object with isValid boolean and message
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (!password) {
    return { isValid: false, message: 'Bitte geben Sie ein Passwort ein.' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Das Passwort darf maximal 128 Zeichen lang sein.' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Das Passwort muss mindestens eine Zahl enthalten.' };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, message: 'Das Passwort muss mindestens einen Buchstaben enthalten.' };
  }

  return { isValid: true, message: '' };
}

/**
 * Sanitizes user input to prevent XSS
 * Removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

/**
 * Validates display name
 */
export function isValidDisplayName(name: string): boolean {
  if (!name || typeof name !== 'string') return true; // Optional field

  const trimmed = name.trim();
  if (trimmed.length === 0) return true; // Empty is ok
  if (trimmed.length > 100) return false;

  // Allow letters, numbers, spaces, hyphens, apostrophes
  const nameRegex = /^[\p{L}\p{N}\s\-']+$/u;
  return nameRegex.test(trimmed);
}

/**
 * Validates project name
 */
export function isValidProjectName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;

  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 200;
}
