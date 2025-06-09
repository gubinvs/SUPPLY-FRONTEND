import React from "react";
import "./informationPanel.css";

// Компонент для изменения данных о компании
const InformationEditCompanyCardContent = ({fullNameCompany, abbreviatedNameCompany, innCompany, addressCompany })=> {

    return (
        <>
            <div className="information-company-card__title">Реквизиты компании:</div>
            <div className="information-company-card__title_fon"></div>
            <ul className="information-company-card__list">
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Полное наименование:</div>
                    <input class="form-control" type="text" placeholder={fullNameCompany} aria-label="default input example" />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Сокращенное наименование:</div>
                    <input class="form-control" type="text" placeholder={abbreviatedNameCompany} aria-label="default input example" />
                    
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">ИНН:</div>
                    <input class="form-control" type="text" placeholder={innCompany} aria-label="default input example" />
                    
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Юридический адрес:</div>
                    <input class="form-control" type="text" placeholder={addressCompany} aria-label="default input example" />
                
                </li>
            </ul>
        </>
    );

};

export default InformationEditCompanyCardContent;