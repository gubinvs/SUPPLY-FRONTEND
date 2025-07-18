// AuthorizationForm.jsx
import React, { useState } from "react";
import "./registrationForm.css";
import {
  handleLoginSubmit,
  redirectToRegistration,
  redirectToPasswordRecovery
} from "./authService.js";
import ApiUrl from "../js/ApiUrl.js";

const redirectToEmailActivation = (email, setMessage) => {
  fetch(ApiUrl + "/api/ActivationEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email}),
  })
    .then(response => response.json())
    .then(data => {
      setMessage(data.message || "Письмо отправлено.");
    })
    .catch(error => {
      console.error("Ошибка при активации почты:", error);
      setMessage("Ошибка при попытке отправки письма.");
    });
};


const AuthorizationForm = () => {
  // Для того, чтобы автоматически заполнить поле логина
  const newLogin = localStorage.getItem("newLogin");
  
  const [email, setEmail] = useState(newLogin || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password, setMessage);
  };

  return (
    <div className="registration-form_container">
      <div className="form-block">
        <h2 className='form-block__title'>Авторизация</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            className="input"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Войти
          </button>
        </form>
      </div>

      {message && (
        <div className="form-block form block-message">
          <h4 className="form-block__message">{message}</h4>

          {message === "Пожалуйста, подтвердите email — иначе аккаунт будет удалён." ? (
            <button
              onClick={() => redirectToEmailActivation(email, setMessage)}
              type="button"
              className="button"
            >
              Активировать почту
            </button>
          ) : message === "Проверьте ваш email для подтверждения регистрации." ? null : (
            <>
              <button onClick={redirectToRegistration} type="button" className="button">
                Пройти регистрацию
              </button>
              <button onClick={redirectToPasswordRecovery} type="button" className="button">
                Восстановить пароль
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default AuthorizationForm;
