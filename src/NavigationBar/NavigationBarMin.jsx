import React from "react";
import { useRoleId } from "../js/Utilits/roleId.js";
import "./navigationBarMin.css";
import {
    linkPageAddComponent,
    linkPageApplicationPanel, 
    suppliersOffers,
    linkPageEditSupplyComponent,
    linkPagePurchase
} from "../js/linkPage.js";


const NavigationBarMin = (
    { onShowMax, onHideMax, isNavMaxVisible }
) => {

    // состояни роли пользователя в системе
    const { roleCustomer, roleProvider, roleAdmin, roleUser} = useRoleId();
    

    return (
        <div className="navigation-bar-min">
            <div className="navigation-bar-min__top-block">
                <picture>
                    <img src="../../images/logo/header_logo_1280.svg" alt="Логотип системы" className="navigation-bar-min__logo" />
                    {/* <img src="../../images/logo/logo-ha.png" alt="Логотип системы" className="navigation-bar-min__logo" /> */}
                    {/* <img src="../../images/logo/header-logo_sa.svg" alt="Логотип системы" className="navigation-bar-min__logo" /> */}
                </picture>
                <div className="top-block__line"></div>
                <ul className="navigation-icon-block">
                    <li className="navigation-icon-block__item" onClick={linkPageApplicationPanel}>
                        <img className="navigation-icon__icon-img" src="../images/dachbord_icon.svg" alt="Иконка на главную панель" />
                    </li>
                    {/* Если роль пользователя заказчик и администратор */}
                    {roleCustomer || roleAdmin ?
                        <>
                            <li className="navigation-icon-block__item" onClick={suppliersOffers}>
                                <img className="navigation-icon__icon-img" src="../images/specifications-icon.svg" alt="Иконка на страницу со списком номенклатуры" />
                            </li>
                            <li className="navigation-icon-block__item" onClick={linkPageEditSupplyComponent}>
                                <img className="navigation-icon__icon-img" src="../images/file-pen-line.svg" alt="Иконка на страницу с редактированием номенклатуры" />
                            </li>
                        </>:""
                    }
                    {/* Если роль пользователя */}
                    {roleUser?
                        <>
                            <li className="navigation-icon-block__item" onClick={suppliersOffers}>
                                <img className="navigation-icon__icon-img" src="../images/specifications-icon.svg" alt="Иконка на страницу со списком номенклатуры" />
                            </li> 
                            <li className="navigation-icon-block__item">
                                <img className="navigation-icon__icon-img" src="../images/file-pen-line.svg" alt="Иконка на страницу с редактированием номенклатуры" title="По подписке"/>
                            </li>
                            <li className="navigation-icon-block__item">
                                <img className="navigation-icon__icon-img" src="../images/add-component-icon.svg" alt="Иконка на страницу добавления артикулов" title="По подписке" />
                            </li>
                            <li className="navigation-icon-block__item" onClick={linkPagePurchase}>
                                <img className="navigation-icon__icon-img" src="../images/purchase-icon.svg" alt="Иконка на страницу с данными о закупках" />
                            </li>
                           
                        </>:""
                    }
                    {/* Если роль не пользователь (просто наблюдатель) откроем добавление артикулов */}
                    {!roleUser?
                        <>
                            <li className="navigation-icon-block__item" onClick={linkPageAddComponent}>
                                <img className="navigation-icon__icon-img" src="../images/add-component-icon.svg" alt="Иконка на страницу добавления артикулов" />
                            </li>
                            <li className="navigation-icon-block__item" onClick={linkPagePurchase}>
                                <img className="navigation-icon__icon-img" src="../images/purchase-icon.svg" alt="Иконка на страницу с данными о закупках" />
                            </li>
                        </>
                    :""}
                    
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
