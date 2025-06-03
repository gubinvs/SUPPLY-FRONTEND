import ApiUrl from '../js/ApiUrl.js';

export const handleLoginSubmit = async (email, password, setMessage) => {
  try {
    const response = await fetch(ApiUrl + "/api/Authorization", {
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
        window.location.href = "/ApplicationPanelProvider";
        window.location.href = "/ApplicationPanelСustomer";
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
