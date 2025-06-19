import React, { useState, useEffect } from "react";
import "./navigationBar.css";
import {
    linkPageAddComponent,
    linkPageApplicationPanel, 
    suppliersOffers
} from "../js/linkPage.js";


const NavigationBarMin = ({ onShowMax, onHideMax, isNavMaxVisible }) => {
    const roleId = localStorage.getItem("roleId");

    const [roleCustomer, setRoleCustomer] = useState(false);
    const [roleProvider, setRoleProvider] = useState(false);
    const [roleAdmin, setRoleAdmin] = useState(false);
    const [roleUser, setRoleUser] = useState(false);

    useEffect(() => {
        // Если заказчик
        if (roleId === "52910536-2b8a-47e7-9d5a-8cca0a0b865a") {
            setRoleCustomer(true);
        } else {
            setRoleCustomer(false);
        }
        // Если поставщик
        if (roleId === "a5219e2b-12f3-490e-99f5-1be54c55cc6d") {
            setRoleProvider(true);
        } else {
            setRoleProvider(false);
        }
        // Если администатор
        if (roleId === "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3") {
            setRoleAdmin(true);
        } else {
            setRoleAdmin(false);
        }
        // Если пользователь
        if (roleId === "ba246092-47bf-4bcc-9e97-5b59969c8976") {
            setRoleUser(true);
        } else {
            setRoleUser(false);
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
                    {roleCustomer ?
                        <>
                            <li className="navigation-icon-block__item" onClick={suppliersOffers}>
                                <img className="navigation-icon__icon-img" src="../images/specifications-icon.svg" alt="Иконка на страницу со списком номенклатуры" />
                            </li>
                        </>:""
                    }
                    <li className="navigation-icon-block__item" onClick={linkPageAddComponent}>
                        <img className="navigation-icon__icon-img" src="../images/add-component-icon.svg" alt="Иконка на страницу добавления артикулов" />
                    </li>
                    {/* Если роль пользователя администратор! */}
                    {roleAdmin ? 
                            <>
                                <li className="navigation-icon-block__item" onClick={suppliersOffers}>
                                    <img className="navigation-icon__icon-img" src="../images/specifications-icon.svg" alt="Иконка на страницу со списком номенклатуры" />
                                </li>
                            </>:""
                    }
                    {/* Если роль пользователя поставщик! */}
                    {roleProvider?"":""}
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
