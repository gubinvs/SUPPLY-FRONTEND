import React from "react";
import "./informationPanel.css";
import InformationCompanyCard from "./InformationCompanyCard";

// Основной блок информационной панели, вводит информацию для конкретного пользователя симтемы в соответствии с ролью
const InformationPanel = ({role}) => {

    return (
        <>
            <div className="iformation-panel-container">
                <div className="iformation-panel-left-block">
                    <InformationCompanyCard role={role} />
                </div>
                <div className="iformation-panel-right-block">
                    <div className="information-user-card">
                        <div className="information-user-card__title_fon"></div>
                        <div className="information-user-card__title">Информация о пользователе:</div>
                        <ul className="information-company-card__list">
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Имя:</div>
                                <div className="information-company-card__item_discr">Губин Владимир Сергеевич</div>
                            </li> 
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">E-mail:</div>
                                <div className="information-company-card__item_discr">man@handyautomation.ru</div>
                            </li> 
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Телефон:</div>
                                <div className="information-company-card__item_discr">+7(814)7852162</div>
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Адреса доставки:</div>
                                <div className="information-company-card__item_discr information-user-card__item_discr">197375 г. Санкт-Петербург Макулатурный проезд, 4Б, пом. 37.</div>
                                <div className="information-company-card__item_discr information-user-card__item_discr">197375, Санкт-Петербург, ул. Вербная, 27 офис 514</div>
                            
                            </li>
                       </ul>
                       <button type="button" className="btn btn-outline-warning information-user-card__edit-botton">Редактировать</button>
                    </div>
                </div>
            </div>
        </>
    );

};

export default InformationPanel;