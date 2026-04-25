export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //   return 'Please enter a valid email address';
  // }

  return '';
};


export const validatePhoneNumber = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';

  const phoneRegex = /^[0-9]{10,15}$/;

  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }

  return '';
};


// export const validatePassword = (password: string): string => {
//   if (!password.trim()) return 'Password is required';

// if (password.length < 8) {
//   return 'Password must be at least 8 characters';
// }

// Optional: Add more password strength requirements
// if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
// if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
// if (!/\d/.test(password)) return 'Password must contain at least one number';

//   return '';
// };

export const validateAddress = (val: string): string => {
  if (!val.trim()) return "Address is required";
  if (val.length < 5) return "Please enter a more detailed address";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password.trim()) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
};



export const validateCurrentPassword = (currentPassword: string): string => {
  if (!currentPassword.trim()) {
    return 'Current password is required';
  }

  // if (currentPassword.length < 8) {
  //   return 'Current password must be at least 8 characters';
  // }

  return '';
};



export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  const pwd = password.trim();
  const confirmPwd = confirmPassword.trim();

  if (!confirmPwd) return 'Confirm Password is required';

  if (confirmPwd.length < 8) return 'Confirm Password must be at least 8 characters';

  if (pwd !== confirmPwd) return 'Passwords do not match';

  return '';
};

export const validateSkills = (skills: string): string => {
  if (!skills.trim()) return 'Skills are required';

  if (skills.trim().length < 3) {
    return 'Please enter at least one valid skill';
  }

  return '';
};

export const validateExperience = (experience: string): string => {
  if (!experience || !experience.trim()) return '';  // optional
  if (isNaN(Number(experience))) return 'Experience must be a number';
  if (Number(experience) < 0) return 'Experience cannot be negative';
  return '';
};
// export const validateName = (name: string): string => {
//   if (!name.trim()) return 'Full name is required';

//   if (name.trim().length < 2) {
//     return 'Name must be at least 2 characters';
//   }

//   return '';
// };

export const validateName = (name: string): string => {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 3) return 'Name must be at least 3 characters';
  return '';
};

// export const validateDOB = (dob: string): string => {
//   if (!dob.trim()) return 'Date of birth is required';

//   const birthDate = new Date(dob);
//   const today = new Date();

//   if (isNaN(birthDate.getTime())) {
//     return 'Please enter a valid date';
//   }

//   // Calculate age
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();

//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }

//   if (age < 21) {
//     return 'You must be at least 21 years old to register';
//   }

//   return '';
// };


export const validateDOB = (dob: string): string => {
  if (!dob.trim()) return 'Date of birth is required';
  console.log(dob)
  // Parse DD/MM.l/YYYY
  const [day, month, year] = dob.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);

  const today = new Date();
  console.log(`${day}-${month}-${year}`)
  if (isNaN(birthDate.getTime())) {
    return 'Please enter a valid date';
  }

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 21) {
    return 'You must be at least 21 years old to register';
  }

  return '';
};



export const validateRequired = (value: string, fieldName: string): string => {
  if (!value.trim()) return `${fieldName} is required`;
  return '';
};

export const validateOver21 = (dob: string): boolean => {
  if (!dob) return false;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 21;
};

export interface FormErrors {
  [key: string]: string;
}

export const validateForm = (
  values: Record<string, string>,
  rules: Record<string, (value: string) => string>
): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(rules).forEach((key) => {
    const error = rules[key](values[key] || '');
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
};