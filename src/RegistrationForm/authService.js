import ApiUrl from '../js/ApiUrl.js';

export const handleLoginSubmit = async (email, password, setMessage) => {
  try {
    const response = await fetch(ApiUrl + "/api/Autorization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.token !== undefined && data.roleId !== undefined) {
      // Запишем в хранилище токен пользователя
      localStorage.setItem("token", data.token);
      // Запишем в хранилище роль в системе пользователя
      localStorage.setItem("roleId", data.roleId);
      // Запишем в хранилище guidId пользователя 
      localStorage.setItem("guidIdCollaborator", data.guidIdCollaborator);
    

      switch (data.roleId.toLowerCase()) {
        case "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3": // администратор
          window.location.href = "/ApplicationPanelAdmin";
          break;
        case "a5219e2b-12f3-490e-99f5-1be54c55cc6d": // поставщик
          window.location.href = "/ApplicationPanelProvider";
          break;
        default: 
            window.location.href = "/ApplicationPanelCustomer"; // Заказчик
          break;
      }
    } else {
      setMessage(data.message || "Неизвестная ошибка.");
    }
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    setMessage("Ошибка соединения с сервером.");
  }
};

export const redirectToRegistration = () => {
  window.location.href = "/Registration";
};

export const redirectToPasswordRecovery = () => {
  window.location.href = "/UpdatePassword";
};

