// @material-ui/icons
import Register from "@material-ui/icons/GroupAdd";
import Login from "@material-ui/icons/LockOpen";
// core components/views for Auth layout
import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";

const authRoutes = [
  {
    path: "/login-page",
    name: "Login Page",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Login,
    component: LoginPage,
    layout: "/auth"
  },
  {
    path: "/register-page",
    name: "Register Page",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Register,
    component: RegisterPage,
    layout: "/auth"
  }
];

export default authRoutes;
