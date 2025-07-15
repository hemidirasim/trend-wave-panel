
interface PasswordStrength {
  score: number; // 0-4
  message: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  let message = '';
  let color = '';

  switch (score) {
    case 0:
    case 1:
      message = 'Çox zəif';
      color = 'text-red-500';
      break;
    case 2:
      message = 'Zəif';
      color = 'text-orange-500';
      break;
    case 3:
      message = 'Orta';
      color = 'text-yellow-500';
      break;
    case 4:
      message = 'Güclü';
      color = 'text-green-500';
      break;
    case 5:
      message = 'Çox güclü';
      color = 'text-green-600';
      break;
    default:
      message = 'Çox zəif';
      color = 'text-red-500';
  }

  return {
    score,
    message,
    color,
    requirements,
  };
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-green-500';
    case 5:
      return 'bg-green-600';
    default:
      return 'bg-red-500';
  }
};
