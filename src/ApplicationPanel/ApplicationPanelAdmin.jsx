// Панель администратора

import React, { useState, useEffect } from "react";
import ApiUrl from '../js/ApiUrl.js';
import { useNavigate } from "react-router-dom";
import "./ApplicationPanel.css";

// Стартовая страница для авторизованного пользователя от компании Поставщика

const ApplicationPanelProvider = () =>
{
    return (
        <>
            <h1>Панель Администратора</h1>
        </>
    );

};

export default ApplicationPanelProvider;