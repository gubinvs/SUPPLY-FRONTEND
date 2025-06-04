import React, { useState, useEffect } from "react";
import ApiUrl from '../js/ApiUrl';
import { useNavigate } from "react-router-dom";
import "./applicationPanel.css";

// Стартовая страница для авторизованного пользователя от компании Поставщика

const ApplicationPanelProvider = () =>
{
    return (
        <>
            <h1>Панель Поставщика</h1>
        </>
    );

};

export default ApplicationPanelProvider;