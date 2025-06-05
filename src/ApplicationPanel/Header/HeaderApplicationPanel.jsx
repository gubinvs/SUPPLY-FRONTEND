import React, { useState } from "react";
import "./headerApplicationPanel.css";
import clearRoleId from "../../js/clearRoleId.js";



const HeaderApplicationPanel = ({role}) => {
    return (
        <>
            <div className="application-panel__header">
                <h6 className="application-panel__title">Роль в системе: {role}</h6>
                <button type="button" class="btn btn-outline-warning" onClick={clearRoleId}>Выход</button>
            </div>
            <div className="application-panel__line"></div>
        </>
    );
};

export default HeaderApplicationPanel;