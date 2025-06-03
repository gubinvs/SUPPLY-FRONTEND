// Панель администратора

import React, { useState, useEffect } from "react";
import ApiUrl from '../js/ApiUrl';
import { useNavigate } from "react-router-dom";
import "./ApplicationPanel.css";

// Основная панель для пользователя, который авторизовался. 
// Здесь проходит проверка на его принадлежность к компании Поставщика, 
// Заказчика или Администратора и перенаправляет на нужную страницу


const ApplicationPanel = () =>
{
    
    window.location.href = "/ApplicationPanelСustomer"; 

};

export default ApplicationPanel;