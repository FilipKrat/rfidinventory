// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Register from "@material-ui/icons/GroupAdd";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import SettingsTableList from "views/SettingsTableList/SettingsTableList.jsx";

import Antenna from "views/Forms/Antenna.jsx";
import Package from "views/Forms/Package.jsx";
import Position from "views/Forms/Position.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    show: true,
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    show: false,
    rtlName: "قائمة الجدول",
    icon: "person",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/statistics",
    name: "Transactions & Exports",
    show: true,
    rtlName: "قائمة الجدول",
    icon: "equalizer",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/antenna/:id",
    name: "Add/Edit Antenna",
    show: false,
    rtlName: "پشتیبانی از راست به چپ",
    icon: Register,
    component: Antenna,
    layout: "/admin"
  },
  {
    path: "/position/:id",
    name: "Add/Edit Position",
    show: false,
    rtlName: "پشتیبانی از راست به چپ",
    icon: Register,
    component: Position,
    layout: "/admin"
  },
  {
    path: "/package/:id",
    name: "Add/Edit Package",
    show: false,
    rtlName: "پشتیبانی از راست به چپ",
    icon: Register,
    component: Package,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "Settings",
    show: true,
    rtlName: "قائمة الجدول",
    icon: "settings",
    component: SettingsTableList,
    layout: "/admin"
  }
];

export default dashboardRoutes;
