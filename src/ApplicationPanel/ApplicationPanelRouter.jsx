// ApplicationPanelRouter.jsx
// Проверяет роль пользователя при запуске приложения и перенаправляет на соответствующую панель.
// Если роль не определена — перенаправляет на форму авторизации.

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ROLE_ADMIN = "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3";
const ROLE_PROVIDER = "a5219e2b-12f3-490e-99f5-1be54c55cc6d";
const ROLE_CUSTOMER = "52910536-2b8a-47e7-9d5a-8cca0a0b865a";

const ApplicationPanelRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("roleId");

    const routesByRole = {
      [ROLE_ADMIN]: "/ApplicationPanelAdmin",
      [ROLE_PROVIDER]: "/ApplicationPanelProvider",
      [ROLE_CUSTOMER]: "/ApplicationPanelСharterer",
    };

    const targetPath = routesByRole[role] || "/AuthorizationForm";

    // Навигация только если текущий путь отличается от целевого
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
};

export default ApplicationPanelRouter;
