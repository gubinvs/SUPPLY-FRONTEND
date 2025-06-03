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

    if (data.token !== undefined) {
        localStorage.setItem("token", data.token);
        // Отправляем пользователя на основную панель, там проведем проверку его роли и перенаправим уже на нужную панель
        window.location.href = "/ApplicationPanel"; 
    } else {
      setMessage(data.message);
    }
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
  }
};

export const redirectToRegistration = () => {
  window.location.href = "/Registration";
};

export const redirectToPasswordRecovery = () => {
  window.location.href = "/UpdatePassword";
};
