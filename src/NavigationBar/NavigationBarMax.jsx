import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./navigationBarMax.css";
import { useRoleId } from "../js/Utilits/roleId.js";

const NavigationBarMax = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roleCustomer, roleProvider, roleAdmin, roleUser } = useRoleId();

    // Пути
    let pathApplicationPanel = "";
    const pathSuppliersOffers = "/SuppliersOffers";
    const pathAddComponent = "/AddComponentApplication";
    const pathEditSupplyComponent = "/EditSupplyComponent";

    if (roleAdmin) {
        pathApplicationPanel = "/ApplicationPanelAdmin";
    } else if (roleUser || roleCustomer) {
        pathApplicationPanel = "/ApplicationPanelCustomer";
    } else if (roleProvider) {
        pathApplicationPanel = "/ApplicationPanelProvider";
    }

    return (
        <div className="navigation-bar-max">
            <div className="navigation-bar-max__logo-block">
                <picture>
                    {/* <img src="../images/logo/header-logo__max-bar_1280.svg" alt="Логотип системы" className="navigation-bar-max__logo"/> */}
                    <img src="../../images/logo/logo-ha.png" alt="Логотип системы" className="navigation-bar-min__logo mr-20" />
                </picture>
                {/* <div className="nbm-logo-block__title">Компоненты<br /> энергии</div> */}
                <div className="nbm-logo-block__title nbm-logo-block__title_handy">Handy Automation</div>
            </div>
            <div className="top-block__line navigation-bar-max__top-block__line"></div>
            <ul className="navigation-bar-max__navigation-list">
                <li
                    className={`navigation-bar-max__navigation-item ${location.pathname === pathApplicationPanel ? 'navigation-bar-max__navigation-item_active' : ''}`}
                    onClick={() => navigate(pathApplicationPanel)}
                >
                    <img src="../../images/dachbord_icon.svg" className="nbm-navigation-item__icon" alt="#"/>
                    <div className="nbm-navigation-item__name">Информационная панель</div>
                </li>

                {(roleCustomer || roleUser || roleAdmin) && (
                    <>
                        <li
                            className={`navigation-bar-max__navigation-item ${location.pathname === pathSuppliersOffers ? 'navigation-bar-max__navigation-item_active' : ''}`}
                            onClick={() => navigate(pathSuppliersOffers)}
                        >
                            <img src="../images/specifications-icon.svg" className="nbm-navigation-item__icon" alt="#"/>
                            <div className="nbm-navigation-item__name">Предложения поставщиков</div>
                        </li>
                        <li
                            className={`navigation-bar-max__navigation-item ${location.pathname === pathEditSupplyComponent ? 'navigation-bar-max__navigation-item_active' : ''}`}
                            onClick={() => navigate(pathEditSupplyComponent)}
                        >
                            <img src="../images/file-pen-line.svg" className="nbm-navigation-item__icon" alt="#" />
                            <div className="nbm-navigation-item__name">Редактировать номенлатуру</div>
                        </li>
                    </>
                )}

                {!roleUser && (
                    <li
                        className={`navigation-bar-max__navigation-item ${location.pathname === pathAddComponent ? 'navigation-bar-max__navigation-item_active' : ''}`}
                        onClick={() => navigate(pathAddComponent)}
                    >
                        <img src="../images/add-component-icon.svg" className="nbm-navigation-item__icon" alt="#"/>
                        <div className="nbm-navigation-item__name">Добавить данные</div>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NavigationBarMax;