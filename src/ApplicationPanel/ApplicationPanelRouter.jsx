// ApplicationPanelRouter.jsx
// Проверяет роль пользователя при запуске приложения и перенаправляет на соответствующую панель.
// Если роль не определена — перенаправляет на форму авторизации.

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROLE_ADMIN, ROLE_PROVIDER, ROLE_CUSTOMER  } from "../js/roleMap.js";


const ApplicationPanelRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("ROLE_ID", localStorage.getItem("roleId"));

  useEffect(() => {
    const role = localStorage.getItem("roleId");

    const routesByRole = {
      [ROLE_ADMIN]: "/ApplicationPanelAdmin",
      [ROLE_PROVIDER]: "/ApplicationPanelProvider",
      [ROLE_CUSTOMER]: "/ApplicationPanelCustomer",
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
