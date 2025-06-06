import React, { useState, useEffect } from "react";
import "./headerApplicationPanel.css";
import clearRoleId from "../../js/clearRoleId.js";



const HeaderApplicationPanel = ({role}) => {
    // Определяем на какой странице находимся
    const windowLocation = window.location.pathname;
    console.log(windowLocation);
    const [title, setTitle] = useState("");


    useEffect(() => {
        if (windowLocation === "/ApplicationPanelCustomer") {
            setTitle("Главная панель");
        } else {
            setTitle("здесь, возможно, опечатка"); // здесь, возможно, опечатка
        }
    }, [windowLocation]);

    return (
        <>
            <div className="application-panel__header">
                <h6 className="application-panel-header__role-discr">Роль в системе: {role}</h6>
                <button type="button" className="btn btn-outline-warning application-panel-header__botton" onClick={clearRoleId}>Выход</button>
            </div>
            <div className="application-panel-header__title">{title}</div>
            <div className="application-panel-header__line"></div>
        </>
    );
};

export default HeaderApplicationPanel;