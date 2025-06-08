import React from "react";

// Карточка компании 

const InformationCompanyCard = ({role}) => {
    // role - роль компании в системе


    return (
        <>
            <div className="information-company-card">
                <button type="button" className="btn btn-outline-warning information-company-card__edit-botton">Редактировать</button>
                <div className="information-company-card__title">Реквизиты компании:</div> 
                <div className="information-company-card__title_fon"></div>
                <ul className="information-company-card__list">
                    <li className="information-company-card__item">
                        <div className="information-company-card__item_title">Полное наименование:</div>
                        <div className="information-company-card__item_discr">Общество с ограниченной ответственностью "Хэнди-Автомейшн"</div>
                    </li> 
                    <li className="information-company-card__item">
                        <div className="information-company-card__item_title">Сокращенное наименование:</div>
                        <div className="information-company-card__item_discr">ООО "Хэнди-Автомейшн"</div>
                    </li> 
                    <li className="information-company-card__item">
                        <div className="information-company-card__item_title">ИНН:</div>
                        <div className="information-company-card__item_discr">7814785216</div>
                    </li> 
                    <li className="information-company-card__item">
                        <div className="information-company-card__item_title">Юридический адрес:</div>
                        <div className="information-company-card__item_discr">197375 г. Санкт-Петербург Макулатурный проезд, 4Б, пом. 37.</div>
                    </li> 
                    <li className="information-company-card__item">
                        <div className="information-company-card__item_title">Роль компании в системе:</div>
                        <div className="information-company-card__item_discr">{role}</div>
                    </li> 
                </ul>
            </div>
        </>
    );

};

export default InformationCompanyCard;