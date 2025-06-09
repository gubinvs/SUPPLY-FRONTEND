import React from "react";
import "./informationPanel.css";


const InformationCompanyCardContent =({fullNameCompany, abbreviatedNameCompany, innCompany, addressCompany })=> {

    return(
        <>
            <div className="information-company-card__title">Реквизиты компании:</div>
            <div className="information-company-card__title_fon"></div>
            <ul className="information-company-card__list">
            <li className="information-company-card__item">
                <div className="information-company-card__item_title">Полное наименование:</div>
                <div className="information-company-card__item_discr">{fullNameCompany}</div>
            </li>
            <li className="information-company-card__item">
                <div className="information-company-card__item_title">Сокращенное наименование:</div>
                <div className="information-company-card__item_discr">{abbreviatedNameCompany}</div>
            </li>
            <li className="information-company-card__item">
                <div className="information-company-card__item_title">ИНН:</div>
                <div className="information-company-card__item_discr">{innCompany}</div>
            </li>
            <li className="information-company-card__item">
                <div className="information-company-card__item_title">Юридический адрес:</div>
                <div className="information-company-card__item_discr">{addressCompany}</div>
            </li>
            </ul>
        </>
    );

};

export default InformationCompanyCardContent;