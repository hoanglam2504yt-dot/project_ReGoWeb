import type { IconType } from "react-icons";
import {
  FaBaby,
  FaBook,
  FaCar,
  FaCouch,
  FaFutbol,
  FaMobileScreenButton,
  FaShirt,
  FaSpa,
  FaTag,
} from "react-icons/fa6";

/** Icon Font Awesome 6 theo tên danh mục (tiếng Việt) — không dùng emoji từ API. */
export function getCategoryIconComponent(categoryName: string): IconType {
  const n = categoryName.toLowerCase();
  if (
    n.includes("điện tử") ||
    n.includes("dien tu") ||
    n.includes("điện thoại") ||
    n.includes("laptop") ||
    n.includes("tablet") ||
    n.includes("tai nghe") ||
    n.includes("đồng hồ")
  )
    return FaMobileScreenButton;
  if (n.includes("thời trang") || n.includes("thoi trang")) return FaShirt;
  if (n.includes("nội thất") || n.includes("noi that")) return FaCouch;
  if (n.includes("sách") || n.includes("sach") || n.includes("văn phòng"))
    return FaBook;
  if (n.includes("thể thao") || n.includes("the thao") || n.includes("giải trí"))
    return FaFutbol;
  if (n.includes("xe")) return FaCar;
  if (n.includes("mẹ") || n.includes("bé") || n.includes("me ") || n.includes("be "))
    return FaBaby;
  if (n.includes("làm đẹp") || n.includes("lam dep") || n.includes("sức khỏe"))
    return FaSpa;
  return FaTag;
}
