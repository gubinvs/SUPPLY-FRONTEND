import React, { useState, useEffect } from "react";
import ApiUrl from "../../js/ApiUrl";
import { ROLE_PROVIDER, ROLE_CUSTOMER, ROLE_ADMIN } from "../../js/roleMap.js";

const InformationAddCompanyCardContent = ({ role, guidIdCollaborator }) => {
    const isAdmin = role === "Администратор";

    const [formData, setFormData] = useState({
        guidIdCompany: "f8617fbf",
        fullNameCompany: "",
        abbreviatedNameCompany: "",
        innCompany: "",
        addressCompany: "",
        roleCompany: "", // 👈 Добавили
        guidIdCollaborator: guidIdCollaborator
    });
console.log(formData);
console.log(guidIdCollaborator);

    const [companyFound, setCompanyFound] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchCompanyByInn = async () => {
            if (![10, 12].includes(formData.innCompany.length)) return; // ИНН: 10 или 12 цифр

            try {
                const response = await fetch(`${ApiUrl}/api/ReturnListCompany`);
                if (!response.ok) {
                    setCompanyFound(false);
                    return;
                }

                const result = await response.json();
                const companies = result.company;

                const found = companies.find(
                    c => String(c.innCompany) === formData.innCompany
                );

                if (found) {
                    setFormData((prev) => ({
                        ...prev,
                        guidIdCompany: found.guidIdCompany,
                        fullNameCompany: found.fullNameCompany || "",
                        abbreviatedNameCompany: found.abbreviatedNameCompany || "",
                        addressCompany: found.addressCompany || ""
                    }));
                    setCompanyFound(true);
                } else {
                    setCompanyFound(false);
                }

            } catch (error) {
                console.error("Ошибка при поиске компании по ИНН:", error);
                setCompanyFound(false);
            }
        };

        fetchCompanyByInn();
    }, [formData.innCompany]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${ApiUrl}/api/AddInformationCompany`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Ошибка на сервере");
            }

            window.location = window.location.href;
        } catch (err) {
            console.error("Ошибка при отправке:", err);
            alert("Ошибка при отправке: " + (err.message || err.toString()));
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
                    {companyFound && (
                        <div className="text-success small mt-1">Компания найдена, данные заполнены автоматически</div>
                    )}
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

                {isAdmin && (
                <div className="information-company-card__item">
                    <div className="information-company-card__item_title">Роль компании:</div>
                    <select
                        className="form-select"
                        name="roleCompany"
                        value={formData.roleCompany}
                        onChange={handleChange}
                    >
                        <option value="">Выбрать роль</option>
                        <option value={ROLE_PROVIDER}>Поставщик</option>
                        <option value={ROLE_CUSTOMER}>Заказчик</option>
                    </select>
                </div>
                )}
            </ul>
        </>
    );
};

export default InformationAddCompanyCardContent;
