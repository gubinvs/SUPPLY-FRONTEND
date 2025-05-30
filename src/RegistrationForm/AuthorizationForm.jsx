// AuthorizationForm.jsx
import React, { useState } from "react";
import "./RegistrationForm.css";
import {
  handleLoginSubmit,
  redirectToRegistration,
  redirectToPasswordRecovery
} from "./authService.js";

const AuthorizationForm = () => {
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
        <h2 className='form-block__title'>Авторизация пользователя</h2>
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
          <h2>{message}</h2>
          <button onClick={redirectToRegistration} type="button" className="button">
            Пройти регистрацию
          </button>
          <button onClick={redirectToPasswordRecovery} type="button" className="button">
            Восстановить пароль
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthorizationForm;
