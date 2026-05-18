// Backend validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

const validateReason = (reason) => {
  return reason && reason.trim().length >= 5;
};

const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj > new Date();
};

const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const validateMessage = (message) => {
  return message && message.trim().length >= 10;
};

const validateTitle = (title) => {
  return title && title.trim().length >= 3;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateReason,
  validateDate,
  validateTime,
  validateMessage,
  validateTitle,
  sanitizeInput
};
