// ApplicationPanelRouter.jsx
// Принимает первое направление при открытии приложения и проверяет роль текущего авторизованного пользователеля, 
// если пользователь не авторизован перенаправляет его на страницу авторизации
import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const ROLE_ADMIN = "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3";
const ROLE_PROVIDER = "a5219e2b-12f3-490e-99f5-1be54c55cc6d";
const ROLE_CUSTOMER = "52910536-2b8a-47e7-9d5a-8cca0a0b865a";

const ApplicationPanelRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("roleId");

    if (!role) {
      if (location.pathname !== "/AuthorizationForm") {
        navigate("/AuthorizationForm");
      }
      return;
    }

    switch (role) {
      case ROLE_ADMIN:
        if (location.pathname !== "/ApplicationPanelAdmin") {
          navigate("/ApplicationPanelAdmin");
        }
        break;
      case ROLE_PROVIDER:
        if (location.pathname !== "/ApplicationPanelProvider") {
          navigate("/ApplicationPanelProvider");
        }
        break;
      case ROLE_CUSTOMER:
        if (location.pathname !== "/ApplicationPanelCustomer") {
          navigate("/ApplicationPanelCustomer");
        }
        break;
      default:
        if (location.pathname !== "/AuthorizationForm") {
          navigate("/AuthorizationForm");
        }
        break;
    }
  }, [navigate, location]);

  return null;
};

export default ApplicationPanelRouter;
