import ApiUrl from '../js/apiUrl.js';

export const handleLoginSubmit = async (email, password, setMessage) => {
  try {
    const response = await fetch(ApiUrl + "/api/Auth", {
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
