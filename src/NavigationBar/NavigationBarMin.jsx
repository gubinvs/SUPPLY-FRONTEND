import React from "react";
import "./navigationBar.css";

const NavigationBarMin = ({ onShowMax, onHideMax, isNavMaxVisible }) => {
    return (
        <div className="navigation-bar-min">
            <div className="navigation-bar-min__top-block">
                <picture>
                    <img src="../images/header_logo_1280.svg" alt="Логотип системы" className="navigation-bar-min__logo" />
                </picture>
                <div className="top-block__line"></div>
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
