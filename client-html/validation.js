document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form")
  const passwordInput = document.getElementById("signup-password")
  const confirmPasswordInput = document.getElementById("confirm-password")
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const admissionInput = document.getElementById("admission")
  const phoneInput = document.getElementById("phone")

  // Create password strength indicator
  const passwordGroup = passwordInput.parentElement
  const strengthIndicator = document.createElement("div")
  strengthIndicator.className = "password-strength"
  strengthIndicator.innerHTML = `
    <div class="strength-bar">
        <div class="strength-fill"></div>
    </div>
    <div class="strength-text">Password strength</div>
    <ul class="password-requirements">
        <li id="length-req">At least 8 characters</li>
        <li id="uppercase-req">One uppercase letter (A-Z)</li>
        <li id="lowercase-req">One lowercase letter (a-z)</li>
        <li id="number-req">One number (0-9)</li>
        <li id="special-req">One special character (!@#$%^&*)</li>
    </ul>
`
  passwordGroup.appendChild(strengthIndicator)

  // Password validation function
  function validatePassword(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }

    return requirements
  }

  // Update password strength indicator
  function updatePasswordStrength(password) {
    const requirements = validatePassword(password)
    const strengthFill = document.querySelector(".strength-fill")
    const strengthText = document.querySelector(".strength-text")

    // Update requirement indicators
    Object.keys(requirements).forEach((req) => {
      const element = document.getElementById(`${req}-req`)
      if (requirements[req]) {
        element.classList.add("met")
      } else {
        element.classList.remove("met")
      }
    })

    // Calculate strength based on 5 requirements
    const metRequirements = Object.values(requirements).filter(Boolean).length
    const strengthPercentage = (metRequirements / 5) * 100

    strengthFill.style.width = strengthPercentage + "%"

    if (metRequirements === 5) {
      strengthFill.className = "strength-fill strong"
      strengthText.textContent = "Very strong password"
    } else if (metRequirements >= 4) {
      strengthFill.className = "strength-fill good"
      strengthText.textContent = "Good password"
    } else if (metRequirements >= 2) {
      strengthFill.className = "strength-fill medium"
      strengthText.textContent = "Medium password"
    } else {
      strengthFill.className = "strength-fill weak"
      strengthText.textContent = "Weak password"
    }
  }

  // Real-time password validation
  passwordInput.addEventListener("input", function () {
    updatePasswordStrength(this.value)
    validatePasswordMatch()
  })

  // Password confirmation validation
  function validatePasswordMatch() {
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity("Passwords do not match")
      confirmPasswordInput.classList.add("error")
    } else {
      confirmPasswordInput.setCustomValidity("")
      confirmPasswordInput.classList.remove("error")
    }
  }

  confirmPasswordInput.addEventListener("input", validatePasswordMatch)

  // Email validation
  function validateEmail(email) {
    // More comprehensive email regex
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email) && email.length <= 254
  }

  // Phone validation (basic format)
  function validatePhone(phone) {
    const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
    return phoneRegex.test(phone)
  }

  // Name validation
  function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name)
  }

  // Admission number validation
  function validateAdmission(admission) {
    return admission.trim().length >= 3
  }

  // Real-time field validation
  nameInput.addEventListener("blur", function () {
    if (!validateName(this.value)) {
      this.setCustomValidity("Name must be at least 2 characters and contain only letters")
      this.classList.add("error")
    } else {
      this.setCustomValidity("")
      this.classList.remove("error")
    }
  })

  emailInput.addEventListener("input", function () {
    const email = this.value.trim()
    if (email.length > 0) {
      if (!validateEmail(email)) {
        this.setCustomValidity("Please enter a valid email address (e.g., user@example.com)")
        this.classList.add("error")
        this.classList.remove("success")
      } else {
        this.setCustomValidity("")
        this.classList.remove("error")
        this.classList.add("success")
      }
    } else {
      this.setCustomValidity("")
      this.classList.remove("error", "success")
    }
  })

  phoneInput.addEventListener("blur", function () {
    if (!validatePhone(this.value)) {
      this.setCustomValidity("Please enter a valid phone number")
      this.classList.add("error")
    } else {
      this.setCustomValidity("")
      this.classList.remove("error")
    }
  })

  admissionInput.addEventListener("blur", function () {
    if (!validateAdmission(this.value)) {
      this.setCustomValidity("Admission number must be at least 3 characters")
      this.classList.add("error")
    } else {
      this.setCustomValidity("")
      this.classList.remove("error")
    }
  })

  // Form submission validation
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const password = passwordInput.value
    const requirements = validatePassword(password)
    const allRequirementsMet = Object.values(requirements).every(Boolean)

    // Validate all fields
    const isNameValid = validateName(nameInput.value)
    const isEmailValid = validateEmail(emailInput.value)
    const isAdmissionValid = validateAdmission(admissionInput.value)
    const isPhoneValid = validatePhone(phoneInput.value)
    const isPasswordValid = allRequirementsMet
    const isPasswordMatch = passwordInput.value === confirmPasswordInput.value
    const isRoleSelected = document.getElementById("role").value !== ""

    if (!isNameValid) {
      nameInput.focus()
      alert("Please enter a valid name (at least 2 characters, letters only)")
      return
    }

    if (!isEmailValid) {
      emailInput.focus()
      alert("Please enter a valid email address")
      return
    }

    if (!isAdmissionValid) {
      admissionInput.focus()
      alert("Please enter a valid admission number (at least 3 characters)")
      return
    }

    if (!isPhoneValid) {
      phoneInput.focus()
      alert("Please enter a valid phone number")
      return
    }

    if (!isRoleSelected) {
      document.getElementById("role").focus()
      alert("Please select your role")
      return
    }

    if (!isPasswordValid) {
      passwordInput.focus()
      alert(
        "Password must meet all requirements:\n" +
          "• At least 8 characters\n" +
          "• One uppercase letter (A-Z)\n" +
          "• One lowercase letter (a-z)\n" +
          "• One number (0-9)\n" +
          "• One special character (!@#$%^&*)",
      )
      return
    }

    if (!isPasswordMatch) {
      confirmPasswordInput.focus()
      alert("Passwords do not match")
      return
    }

    // If all validations pass
    alert("Registration successful! (This is a demo - form data would be submitted to server)")
    console.log("Form data:", {
      name: nameInput.value,
      email: emailInput.value,
      admission: admissionInput.value,
      phone: phoneInput.value,
      role: document.getElementById("role").value,
    })
  })
})
