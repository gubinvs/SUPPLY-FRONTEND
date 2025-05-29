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
                setComponents(data.component || []);
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                setError("Ошибка загрузки данных: " + error.message);
            });
    }, []);

    return (
        <div className="container">
            <h2>Список комплектующих в базе данных:</h2>

            {error && <p className="error">{error}</p>}

            {components.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Артикул</th>
                            <th scope="col">Наименование</th>
                            <th scope="col">Производитель</th>
                        </tr>
                    </thead>
                    <tbody>
                        {components.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td className="list-component__td">{item.vendorCodeComponent}</td>
                                <td>{item.nameComponent}</td>
                                <td>{item.manufacturerComponent || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !error && <p>Загрузка данных...</p>
            )}
        </div>
    );
};

export default ListComponent;
