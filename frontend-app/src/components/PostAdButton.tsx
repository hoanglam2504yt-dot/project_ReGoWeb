import { FaPlus } from "react-icons/fa6";

interface PostAdButtonProps {
  onClick: () => void;
}

const PostAdButton = ({ onClick }: PostAdButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 active:bg-purple-800 transition shadow-md flex items-center gap-2"
      aria-label="Đăng tin mới"
      role="button"
    >
      <FaPlus className="text-sm md:hidden" />
      <span className="hidden md:inline">Đăng tin</span>
      <span className="md:hidden">Đăng</span>
    </button>
  );
};

export default PostAdButton;
