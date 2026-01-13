import {
  FaHome,
  FaPlusCircle,
  FaChartBar,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

export const userMenu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    label: "Add Transaction",
    href: "/dashboard/add",
    icon: FaPlusCircle,
  },
  {
    label: "Charts",
    href: "/dashboard/charts",
    icon: FaChartBar,
  },
];

export const adminMenu = [
  ...userMenu,
  {
    label: "All Users",
    href: "/admin/users",
    icon: FaUsers,
  },
  {
    label: "Admin Panel",
    href: "/admin",
    icon: FaShieldAlt,
  },
];
