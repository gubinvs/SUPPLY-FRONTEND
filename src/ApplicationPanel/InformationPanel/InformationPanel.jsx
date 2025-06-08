import React from "react";
import {useState, useEffect} from "react";
import "./informationPanel.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard";
import { data } from "react-router-dom";

// Основной блок информационной панели, вводит информацию для 
// конкретного пользователя симтемы в соответствии с ролью

const InformationPanel = ({role}) => {
    // Считываем guidIdCollaborator
    const guidIdCollaborator =  localStorage.getItem("guidIdCollaborator");
    const [nameCollaborator, setNameCollaborator] = useState("");
    const [emailCollaborator, setEmailCollaborator] = useState("");
    const [phoneCollaborator, setPhoneCollaborator] = useState("");
    const [addressDiliveryCollaborator, setAddressDiliveryCollaborator] = useState([]);

    useEffect(() => {
        // Достаем GUID из хранилища
        const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
        
        // Оборачиваем асинхронную функцию внутрь useEffect
        const fetchData = async () => {
          try {
            const response = await fetch(ApiUrl + "/api/DataInfoPanel/" + guidIdCollaborator, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            setNameCollaborator(data.massage);
      
          } catch (error) {
            console.error("Ошибка при авторизации:", error);
          }
        };
      
        fetchData();
      }, []);
      
    return (
        <>
            <div className="iformation-panel-container">
                <div className="iformation-panel-left-block">
                    <InformationCompanyCard role={role} />
                </div>
                <div className="iformation-panel-right-block">
                    <div className="information-user-card">
                        <div className="information-user-card__title_fon"></div>
                        <div className="information-user-card__title">Информация о пользователе:</div>
                        <ul className="information-company-card__list">
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Имя:</div>
                                <div className="information-company-card__item_discr">{nameCollaborator}</div>
                            </li> 
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">E-mail:</div>
                                <div className="information-company-card__item_discr">{emailCollaborator}</div>
                            </li> 
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Телефон:</div>
                                <div className="information-company-card__item_discr">{phoneCollaborator}</div>
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Адреса доставки:</div>
                                <div className="information-company-card__item_discr information-user-card__item_discr">197375 г. Санкт-Петербург Макулатурный проезд, 4Б, пом. 37.</div>
                                <div className="information-company-card__item_discr information-user-card__item_discr">197375, Санкт-Петербург, ул. Вербная, 27 офис 514</div>
                            </li>
                       </ul>
                       <button type="button" className="btn btn-outline-warning information-user-card__edit-botton">Редактировать</button>
                    </div>
                </div>
            </div>
        </>
    );

};

export default InformationPanel;