
import React from 'react';
import { validatePasswordStrength, getPasswordStrengthColor } from '@/utils/passwordValidation';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const strength = validatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Güc göstəricisi */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Şifrə gücü:</span>
          <span className={strength.color}>{strength.message}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(strength.score)}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Tələblər */}
      {showRequirements && (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-700">Şifrə tələbləri:</div>
          <div className="space-y-1">
            <RequirementItem
              met={strength.requirements.length}
              text="Ən azı 8 simvol"
            />
            <RequirementItem
              met={strength.requirements.uppercase}
              text="Böyük hərf (A-Z)"
            />
            <RequirementItem
              met={strength.requirements.lowercase}
              text="Kiçik hərf (a-z)"
            />
            <RequirementItem
              met={strength.requirements.number}
              text="Rəqəm (0-9)"
            />
            <RequirementItem
              met={strength.requirements.special}
              text="Xüsusi simvol (!@#$%^&*)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className="flex items-center space-x-2 text-sm">
    {met ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
    <span className={met ? 'text-green-700' : 'text-red-700'}>{text}</span>
  </div>
);

export default PasswordStrengthIndicator;
