import React, { useState, useEffect } from "react";
import "./navigationBar.css";
import {
    linkPageApplicationPanel, 
    suppliersOffers
} from "../js/linkPage.js";


const NavigationBarMin = ({ onShowMax, onHideMax, isNavMaxVisible }) => {
    const roleId = localStorage.getItem("roleId");

    const [role, setRole] = useState(false);
    const [roleAdmin, setRoleAdmin] = useState(false);

    useEffect(() => {
        if (roleId === "52910536-2b8a-47e7-9d5a-8cca0a0b865a") {
            setRole(true);
        } else {
            setRole(false);
        }

        if (roleId === "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3") {
            setRoleAdmin(true);
        } else {
            setRoleAdmin(false);
        }
    }, [roleId]); // добавляем roleId как зависимость


    return (
        <div className="navigation-bar-min">
            <div className="navigation-bar-min__top-block">
                <picture>
                    <img src="../images/logo-ha.png" alt="Логотип системы" className="navigation-bar-min__logo" />
                </picture>
                <div className="top-block__line"></div>
                <ul className="navigation-icon-block">
                    <li className="navigation-icon-block__item" onClick={linkPageApplicationPanel}>
                        <img className="navigation-icon__icon-img" src="../images/dachbord_icon.svg" alt="Иконка на главную панель" />
                    </li>
                    {/* Если роль пользователя заказчик! */}
                    {role ?
                        <li className="navigation-icon-block__item" onClick={suppliersOffers}>
                            <img className="navigation-icon__icon-img" src="../images/specifications-icon.svg" alt="Иконка на страницу с предложениями" />
                        </li>:
                        <li className="navigation-icon-block__item" onClick="">
                            <img className="navigation-icon__icon-img" src="../images/companies-icon.svg" alt="Иконка на страницу компаний" />
                        </li>
                    }
                    {/* Если роль пользователя администратор! */}
                    {roleAdmin ? 
                            <>
                                <li className="navigation-icon-block__item" onClick="">
                                    <img className="navigation-icon__icon-img" src="../images/specifications-icon.svg" alt="Иконка на страницу спецификации" />
                                </li>
                                <li className="navigation-icon-block__item" onClick="">
                                    <img className="navigation-icon__icon-img" src="../images/companies-icon.svg" alt="Иконка на страницу компаний" />
                                </li>
                            </>:""
                    }
                    <li className="navigation-icon-block__item" onClick="">
                        <img className="navigation-icon__icon-img" src="../images/purchase-icon.svg" alt="Иконка на страницу закупки" />
                    </li>
                </ul>
            </div>
            <div className="navigation-bar-min__bootom-block">
                <div className="bottom-block__navigation-arrow">
                    {!isNavMaxVisible && (
                        <img
                            src="../images/navigation-arrow-right.svg"
                            alt="Показать панель"
                            className="navigation-arrow-img"
                            id="arrow-right"
                            onClick={onShowMax}
                            style={{ cursor: "pointer" }}
                        />
                    )}
                    {isNavMaxVisible && (
                        <img
                            src="../images/navigation-arrow-left.svg"
                            alt="Скрыть панель"
                            className="navigation-arrow-img"
                            id="arrow-left"
                            onClick={onHideMax}
                            style={{ cursor: "pointer" }}
                        />
                    )}
                </div>
                <div className="fice-lodo-block">
                    <img src="../images/user_logo_max-baner.png" alt="Логотип пользователя" />
                </div>
            </div>
        </div>
    );
};

export default NavigationBarMin;
