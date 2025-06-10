import React from "react";
import "./informationPanel.css";

// Компонент для изменения данных о компании
const InformationAddCompanyCardContent = (guidIdCollaborator)=> {

    return (
        <>
            <button type="button" className="btn btn-success information-company-card__edit-botton">Записать</button>
            <div className="information-company-card__title">Реквизиты компании:</div>
            <div className="information-company-card__title_fon"></div>
            <ul className="information-company-card__list">
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Полное наименование:</div>
                    <input class="form-control" type="text"  aria-label="default input example" />
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Сокращенное наименование:</div>
                    <input class="form-control" type="text" aria-label="default input example" />
                    
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">ИНН:</div>
                    <input class="form-control" type="text"  aria-label="default input example" />
                    
                </li>
                <li className="information-company-card__item">
                    <div className="information-company-card__item_title">Юридический адрес:</div>
                    <input class="form-control" type="text" aria-label="default input example" />
                
                </li>
            </ul>
        </>
    );

};

export default InformationAddCompanyCardContent;