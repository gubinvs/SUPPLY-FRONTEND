import React, { useState } from "react";
import ApiUrl from "../js/ApiUrl";
import "./registrationForm.css";


/// Компонент формы регистрации пользователя в системе
/// если это локальная версия, то выбор роли в компании заблокировано
///

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [guidIdRoleSystem, setGuidIdRoleSystem] = useState(""); // Состояние для роли если полная версия программы
  // если урезанная для локального деплоя, то пользователь всегда заказчик
  const guidIdRoleSystem =  "52910536-2b8a-47e7-9d5a-8cca0a0b865a";
  const [honeypot, setHoneypot] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (honeypot) {
      setMessage("Вы не прошли проверку, пожалуйста, повторите попытку.");
      return;
    }

    if (!email.trim() || !password.trim() || !guidIdRoleSystem.trim()) {
      setMessage("Пожалуйста, заполните все поля, включая выбор роли.");
      return;
    }

    fetch(ApiUrl + "/api/Registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, guidIdRoleSystem }),
      
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) =>
        setMessage("Ошибка регистрации: " + error.message)
      );
  };

  const handleRedirect = () => {
    localStorage.setItem("newLogin", email);
    window.location.href = "/AuthorizationForm";
  };

  return (
    <div className="registration-form_container">
      <div className="form-block">
        <h2 className="form-block__title">Регистрация</h2>
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

          {/* <select
            className="input"
            value={guidIdRoleSystem}
            onChange={(e) => setGuidIdRoleSystem(e.target.value)}
            required
          >
            <option>Выбор роли</option>
            <option value="a5219e2b-12f3-490e-99f5-1be54c55cc6d">Поставщик</option>
            <option value="52910536-2b8a-47e7-9d5a-8cca0a0b865a">Заказчик</option>
          </select> */}

          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            autoComplete="off"
          />

          <button type="submit" className="button">
            Зарегистрироваться
          </button>
        </form>
      </div>

      {message && (
        <div className="form-block form-block-message">
          <h4 className="form-block__message">{message}</h4>
          <button onClick={handleRedirect} className="button">
            Пройдите авторизацию
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
