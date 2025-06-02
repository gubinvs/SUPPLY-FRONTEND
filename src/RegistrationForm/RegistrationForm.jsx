import React, { useState } from "react";
import ApiUrl from "../js/ApiUrl";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Поле для хонипота
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверка хонипота (боты заполняют скрытые поля)
    if (honeypot) {
      setMessage("Вы не прошли проверку, пожалуйста, повторите попытку.");
      return;
    }

    // Проверка пустых строк
    if (!email.trim() || !password.trim()) {
      setMessage("Пожалуйста, заполните все поля.");
      return;
    }

    // Отправка данных на сервер
    fetch(ApiUrl + "/api/Registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Ошибка регистрации: " + error.message));
  };

  if (message === "") {
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
            {/* Скрытое поле для хонипота */}
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
      </div>
    );
  } else {
    const handleRedirect = () => {
      // Записываю email для удобства авторизации  автоматического заполнения формы
      const newLogin = email;
      console.log(email);
      localStorage.setItem("newLogin", email);
      console.log(localStorage.getItem("newLogin"));
      window.location.href = "/Authorization"; // Переход на страницу авторизации
    };

    return (
      <div className="container">
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
            {/* Скрытое поле для хонипота */}
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
        <div className="form-block form block-message">
          <h2>{message}</h2>
          <button onClick={handleRedirect} type="submit" className="button">
            Пройдите авторизацию
          </button>
        </div>
      </div>
    );
  }
};

export default RegistrationForm;
