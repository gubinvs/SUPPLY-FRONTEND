import React, { useState } from "react";
import "./informationPanel.css";
import ApiUrl from "../../js/ApiUrl";

const InformationAddCompanyCardContent = ({ guidIdCollaborator }) => {
    const [formData, setFormData] = useState({
        guidIdCompany: "f8617fbf",
        fullNameCompany: "",
        abbreviatedNameCompany: "",
        innCompany: "",
        addressCompany: "",
        guidIdCollaborator: guidIdCollaborator
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const companyData = {
            ...formData,
            innCompany: Number(formData.innCompany), // Преобразуем ИНН в число
        };

        console.log("Отправка данных:", companyData);
        console.log(JSON.stringify({formData}));

        // Отправка на сервер
        try {
                const response = fetch(ApiUrl + "/api/AddInformationCompany", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                    body: JSON.stringify({formData})
                });
                
                
                if (!response.ok) {
                throw new Error(`Ошибка при отправке: ${response.statusText}`);
                }

                const data = response.json();
                return data;

            } catch (error) {
                console.error("Ошибка отправки данных о компании:", error);
                throw error;
            }
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-success information-company-card__edit-botton"
                onClick={handleSubmit}
            >
                Записать
            </button>
            <div className="information-company-card__title">Реквизиты компании:</div>
            <div className="information-company-card__title_fon"></div>
            <ul className="information-company-card__list">
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Полное наименование:</div>
                    <input
                        className="form-control"
                        type="text"
                        name="fullNameCompany"
                        value={formData.fullNameCompany}
                        onChange={handleChange}
                        aria-label="Полное наименование"
                    />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Сокращенное наименование:</div>
                    <input
                        className="form-control"
                        type="text"
                        name="abbreviatedNameCompany"
                        value={formData.abbreviatedNameCompany}
                        onChange={handleChange}
                        aria-label="Сокращенное наименование"
                    />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">ИНН:</div>
                    <input
                        className="form-control"
                        type="text"
                        name="innCompany"
                        value={formData.innCompany}
                        onChange={handleChange}
                        aria-label="ИНН"
                    />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Юридический адрес:</div>
                    <input
                        className="form-control"
                        type="text"
                        name="addressCompany"
                        value={formData.addressCompany}
                        onChange={handleChange}
                        aria-label="Юридический адрес"
                    />
                </li>
            </ul>
        </>
    );
};

export default InformationAddCompanyCardContent;
