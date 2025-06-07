import React from "react";
import "./informationPanel.css";

// Основной блок информационной панели, вводит информацию для конкретного пользователя симтемы в соответствии с ролью
const InformationPanel = () => {

    return (
        <>
            <div className="iformation-panel-container">
                <div className="iformation-panel-left-block">
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
                                <div className="information-company-card__item_title">Адрес доставки:</div>
                                <div className="information-company-card__item_discr">197375 г. Санкт-Петербург Макулатурный проезд, 4Б, пом. 37.</div>
                            </li> 
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Роль компании в системе:</div>
                                <div className="information-company-card__item_discr">Заказчик</div>
                            </li> 

                       </ul>
                    </div>
                </div>
                <div className="iformation-panel-right-block">
                    <div className="information-user-card">
                    <div className="information-user-card__title">Информация о пользователе:</div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default InformationPanel;