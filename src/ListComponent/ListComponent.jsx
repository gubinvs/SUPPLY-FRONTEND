import React, { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./ListComponent.css";

const ListComponent = () => {
    const [components, setComponents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(ApiUrl + "/api/ReturnListDataComponent", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setComponents(data.component);
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                setError("Ошибка загрузки данных: " + error.message);
            });
    }, []);

    return (
        <div className="list-container">
            <h2>Список комплектующих</h2>
            {error && <p className="error">{error}</p>}
            {components.length > 0 ? (
                <ul>
                    {components.map((item) => (
                        <li key={item.id}>
                            <strong>{item.vendorCodeComponent}</strong>: {item.nameComponent}
                        </li>
                    ))}
                </ul>
            ) : (
                !error && <p>Загрузка данных...</p>
            )}
        </div>
    );
};

export default ListComponent;
