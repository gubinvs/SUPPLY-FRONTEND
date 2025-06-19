import React from "react";
import "./navigationBarMax.css";
import { useRoleId } from "../js/Utilits/roleId.js";
import {
    linkPageAddComponent,
    linkPageApplicationPanel, 
    suppliersOffers
} from "../js/linkPage.js";


const NavigationBarMax =()=> {
    const { roleCustomer, roleProvider, roleAdmin, roleUser, error } = useRoleId();
    return (
        <>
            <div className="navigation-bar-max">
                <div className="navigation-bar-max__logo-block">
                    <picture>
                        <img src="../images/logo-ha.png" alt="Логотип системы" className="navigation-bar-min__logo" />
                    </picture>
                    <div className="nbm-logo-block__title">Handy Automation</div>
                </div>
                <div className="top-block__line navigation-bar-max__top-block__line"></div>
                <ul className="navigation-bar-max__navigation-list">
                    <li className="navigation-bar-max__navigation-item navigation-bar-max__navigation-item_active" onClick={linkPageApplicationPanel}>
                        <img src="../../images/dachbord_icon.svg" className="nbm-navigation-item__icon" />
                        <div className="nbm-navigation-item__name">Информационная панель</div>
                    </li>
                    {/* Если роль пользователя заказчик! */}
                    {roleCustomer || roleUser || roleAdmin ?
                        <>
                            <li className="navigation-bar-max__navigation-item"  onClick={suppliersOffers}>
                                <img src="../images/specifications-icon.svg" className="nbm-navigation-item__icon" />
                                <div className="nbm-navigation-item__name">Предложения поставщиков</div>
                            </li>
                        </>:""
                    }
                    {/* Если роль не пользователь (просто наблюдатель) откроем добавление артикулов */}
                    {!roleUser?
                        <>
                             <li className="navigation-bar-max__navigation-item"  onClick={linkPageAddComponent}>
                               <img src="../images/add-component-icon.svg" className="nbm-navigation-item__icon" />
                                <div className="nbm-navigation-item__name">Добавить номенклатуру</div>
                            </li>
                        </>
                    :""}
                </ul>
            </div>
        </>
    );
};

export default NavigationBarMax;