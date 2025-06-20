export const validateEmail = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return {
    isValid: emailRegex.test(email) && email.length <= 254,
    message: emailRegex.test(email) ? "" : "Please enter a valid email address",
  }
}

export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  const score = Object.values(requirements).filter(Boolean).length

  return {
    requirements,
    score,
    isValid: score === 5,
  }
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/
  return {
    isValid: phoneRegex.test(phone),
    message: phoneRegex.test(phone) ? "" : "Please enter a valid phone number",
  }
}

export const validateName = (name) => {
  const isValid = name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name)
  return {
    isValid,
    message: isValid ? "" : "Name must be at least 2 characters and contain only letters",
  }
}
