import { useEffect, useRef } from "react";
import { FaUser, FaGear, FaRightFromBracket, FaRectangleList, FaReceipt } from "react-icons/fa6";
import type { IconType } from "react-icons";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  onMyProductsClick: () => void;
  onOrdersClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: IconType;
  onClick: () => void;
  ariaLabel: string;
}

const DropdownMenu = ({
  isOpen,
  onClose,
  onProfileClick,
  onMyProductsClick,
  onOrdersClick,
  onSettingsClick,
  onLogoutClick,
}: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      id: "profile",
      label: "Hồ sơ",
      icon: FaUser,
      onClick: onProfileClick,
      ariaLabel: "Xem hồ sơ của bạn",
    },
    {
      id: "my-products",
      label: "Tin đăng của tôi",
      icon: FaRectangleList,
      onClick: onMyProductsClick,
      ariaLabel: "Xem tin đăng của bạn",
    },
    {
      id: "orders",
      label: "Đơn hàng đã đặt",
      icon: FaReceipt,
      onClick: onOrdersClick,
      ariaLabel: "Xem đơn hàng đã đặt",
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: FaGear,
      onClick: onSettingsClick,
      ariaLabel: "Mở cài đặt tài khoản",
    },
    {
      id: "logout",
      label: "Đăng xuất",
      icon: FaRightFromBracket,
      onClick: onLogoutClick,
      ariaLabel: "Đăng xuất khỏi tài khoản",
    },
  ];

  // Focus first menu item when dropdown opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      try {
        const firstMenuItem = menuRef.current.querySelector('[role="menuitem"]');
        if (firstMenuItem instanceof HTMLElement) {
          firstMenuItem.focus();
        }
      } catch (error) {
        console.warn("Failed to focus dropdown menu item:", error);
      }
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        const nextIndex = (index + 1) % menuItems.length;
        const nextButton = menuRef.current?.querySelectorAll('[role="menuitem"]')[nextIndex];
        if (nextButton instanceof HTMLElement) {
          nextButton.focus();
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
        const prevButton = menuRef.current?.querySelectorAll('[role="menuitem"]')[prevIndex];
        if (prevButton instanceof HTMLElement) {
          prevButton.focus();
        }
        break;
      case "Enter":
        event.preventDefault();
        menuItems[index].onClick();
        break;
      case "Tab":
        event.preventDefault();
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
      role="menu"
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors focus:bg-purple-50 dark:focus:bg-purple-900/30 focus:outline-none"
            role="menuitem"
            aria-label={item.ariaLabel}
            tabIndex={0}
          >
            <Icon className="text-lg" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
