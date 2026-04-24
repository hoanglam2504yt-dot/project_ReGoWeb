import { useState } from "react";
import type { User } from "../types";

interface AvatarProps {
  user: User;
  onClick: () => void;
  isDropdownOpen: boolean;
}

const Avatar = ({ user, onClick, isDropdownOpen }: AvatarProps) => {
  const [avatarError, setAvatarError] = useState(false);

  const handleImageError = () => {
    setAvatarError(true);
  };

  // Get first letter of user's name for fallback avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Generate a consistent color based on user's name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border-2 transition-all cursor-pointer overflow-hidden
        ${isDropdownOpen 
          ? "border-purple-600 dark:border-purple-400" 
          : "border-gray-300 dark:border-gray-600"
        }
        hover:opacity-80`}
      aria-label="User menu"
      aria-expanded={isDropdownOpen}
      aria-haspopup="true"
      role="button"
      tabIndex={0}
    >
      {user.avatar && !avatarError ? (
        <img
          src={user.avatar}
          alt={`${user.name} avatar`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div 
          className={`w-full h-full flex items-center justify-center ${getAvatarColor(user.name)} text-white font-semibold text-sm md:text-base`}
          data-testid="fallback-avatar"
        >
          {getInitials(user.name)}
        </div>
      )}
    </button>
  );
};

export default Avatar;
