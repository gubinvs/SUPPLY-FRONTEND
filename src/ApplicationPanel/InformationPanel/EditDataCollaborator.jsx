import React, { useState } from "react";
import ApiUrl from "../../js/ApiUrl.js";
import { exitEdit } from "../../js/exitEdit";

const EditDataCollaborator = ({
    guidIdCollaborator,
    role,
    nameCollaborator,
    emailCollaborator,
    phoneCollaborator,
    addressDiliveryCollaborator,
    
}) => {
    const [formData, setFormData] = useState({
        guidIdCollaborator: guidIdCollaborator,
        nameCollaborator: nameCollaborator || "",
        phoneCollaborator: phoneCollaborator || "",
        deliveryAddress: [...addressDiliveryCollaborator] || []
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (index, value) => {
        const updatedAddresses = [...formData.deliveryAddress];
        updatedAddresses[index] = value;
        setFormData(prev => ({
            ...prev,
            deliveryAddress: updatedAddresses
        }));
    };

    const handleAddAddress = () => {
        setFormData(prev => ({
            ...prev,
            deliveryAddress: [...prev.deliveryAddress, ""]
        }));
    };

    const handleDeleteAddress = (index) => {
        const updatedAddresses = formData.deliveryAddress.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            deliveryAddress: updatedAddresses
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(ApiUrl + "/api/EditInformationCollaborator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            let resultText = await response.text();
            let result;

            try {
                result = JSON.parse(resultText);
            } catch {
                result = { message: resultText };
            }

            if (!response.ok) {
                throw new Error(result.message || "Ошибка на сервере");
            }

            //alert("Данные успешно обновлены!");
            window.location = window.location.href;

        } catch (err) {
            console.error("Ошибка при отправке:", err);
            alert("Ошибка при отправке: " + (err.message || err.toString()));
        }
    };

    return (
        <div className="information-user-card">
            <div className="information-user-card__title_fon"></div>
            <div className="information-user-card__title">Информация о пользователе:</div>
            <ul className="information-company-card__list">
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Имя:</div>
                    <input
                        type="text"
                        name="nameCollaborator"
                        className="form-control"
                        value={formData.nameCollaborator}
                        onChange={handleChange}
                    />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Телефон:</div>
                    <input
                        type="text"
                        name="phoneCollaborator"
                        className="form-control"
                        value={formData.phoneCollaborator}
                        onChange={handleChange}
                    />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">E-mail:</div>
                    <div className="information-company-card__item_discr">{emailCollaborator}</div>
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Роль пользователя:</div>
                    <div className="information-company-card__item_discr">{role}</div>
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Адреса доставки:</div>
                    {formData.deliveryAddress.map((item, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                className="form-control me-2"
                                value={item}
                                onChange={(e) => handleAddressChange(index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteAddress(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm mt-2"
                        onClick={handleAddAddress}
                    >
                        + Добавить адрес
                    </button>
                </li>
            </ul>
            <div class="check-box information-user-card__edit-botton">
              <input className="check-box__input" type="checkbox" name="chekBox" checked required />
              <div className="check-box__pp-page" onClick={()=> {window.location.href="https://encomponent.ru/pp-page.html"}}>Соглашаюсь на обработку персональных данных.</div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
            >
                Записать
            </button>
            </div>
            {/* Выйти из редактирования */}
            <button type="button" class="btn btn-outline-danger information-user-card__exit-botton" onClick={exitEdit}>Х</button>
        </div>
    );
};

export default EditDataCollaborator;
