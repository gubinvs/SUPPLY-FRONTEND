import React, { useState, useEffect } from "react";
import ApiUrl from '../js/apiUrl.js';
import "./RegistrationForm.css";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Для индикатора загрузки
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Начинаем загрузку

        const requestData = { email: email.trim() };

        fetch(ApiUrl + "/api/UpdatePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
        .then((response) => {
            if (!response.ok) {
                // Обработка ошибок, если статус не OK
                return response.json().then((data) => {
                    throw new Error(data.message || "Ошибка при отправке запроса");
                });
            }
            return response.json();
        })
        .then((data) => {
            setMessage("Пароль отправлен на почту");
            setLoading(false);
        })
        .catch((error) => {
            setMessage(error.message); // Показать ошибку, если она произошла
            setLoading(false);
            console.error(error);
        });
    };

    useEffect(() => {
        if (message === "Пароль отправлен на почту") {
            const timer = setTimeout(() => {
                navigate('/Authorization');
            }, 3000); // 3 секунды

            return () => clearTimeout(timer);
        }
    }, [message, navigate]);

    return (
        <div className="registration-form_container">
            <div className="form-block">
                <h2>Восстановление пароля</h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="email"
                        className="input"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? "Загружается..." : "Сбросить пароль"}
                    </button>
                </form>
                {message && <p style={{ marginTop: '15px', color: 'red' }}>{message}</p>}
            </div>
        </div>
    );
};

export default UpdatePassword;
