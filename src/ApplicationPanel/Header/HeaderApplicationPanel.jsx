import React, { useState, useEffect } from "react";
import "./headerApplicationPanel.css";
import clearRoleId from "../../js/clearRoleId.js";
import { roleMap } from "../../js/roleMap.js";

const HeaderApplicationPanel = () => {
    const [roleId] = useState(() => localStorage.getItem("roleId")); // ✅ кэшируем значение
    const [role, setRole] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        const currentRole = roleMap[roleId] || "Неизвестная роль";
        setRole(currentRole);
    }, [roleId]);

    useEffect(() => {
        const location = window.location.pathname;
        
        setTitle(location === "/ApplicationPanelCustomer"
            ? "Информационная панель"
            : "");
    }, []);

    return (
        <>
            <div className="application-panel__header">
                <h6 className="application-panel-header__role-discr">Роль в системе: {role}</h6>
                <button
                    type="button"
                    className="btn btn-outline-warning application-panel-header__botton"
                    onClick={clearRoleId}
                >
                    Выход
                </button>
            </div>
            <div className="application-panel-header__title">{title}</div>
            <div className="application-panel-header__line"></div>
        </>
    );
};

export default HeaderApplicationPanel;
