import React, { useState } from "react";
import "./informationPanel.css";
import ApiUrl from "../../js/ApiUrl";

const InformationEditCompanyCardContent = ({
    guidIdCompany,
    fullNameCompany,
    abbreviatedNameCompany,
    innCompany,
    addressCompany,
    guidIdCollaborator
}) => {
    const [formData, setFormData] = useState({
        guidIdCompany: guidIdCompany,
        fullNameCompany: fullNameCompany || "",
        abbreviatedNameCompany: abbreviatedNameCompany || "",
        innCompany: innCompany || "",
        addressCompany: addressCompany || "",
        guidIdCollaborator: guidIdCollaborator || "" 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(ApiUrl + "/api/AddInformationCompany", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Ошибка на сервере");
            }

            // alert(result.message);

        } catch (err) {
            console.error("Ошибка при отправке:", err);
            alert("Ошибка при отправке: ИНН должен быть из 10 или 12 цифр");
        }

        // Вернемся на текущую страницу
        window.location = window.location.href;
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

export default InformationEditCompanyCardContent;
