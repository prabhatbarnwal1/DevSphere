export const phoneValidation = {
  required: {
    value: true,
    message: "Phone number is required",
  },
  pattern: {
    value: /^[0-9]{10}$/,
    message: "Invalid phone number",
  },
};

export const emailValidation = {
  required: {
    value: true,
    message: "Email is required",
  },
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email address",
  },
};

export const passwordValidation = {
  required: {
    value: true,
    message: "Password is required",
  },
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters long",
  },
};

export const usernameValidation = {
  required: {
    value: true,
    message: "Username is required",
  },
};
