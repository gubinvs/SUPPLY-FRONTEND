import React from "react";
import {useState, useEffect} from "react";
import "./informationPanel.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard";


// Основной блок информационной панели, вводит информацию для 
// конкретного пользователя симтемы в соответствии с ролью

const InformationPanel = ({role}) => {
    // Формируем данные о пользователе
    const [nameCollaborator, setNameCollaborator] = useState("");
    const [emailCollaborator, setEmailCollaborator] = useState("");
    const [phoneCollaborator, setPhoneCollaborator] = useState("");


    // Собираем данные о компаниях
    const [company, setCompany] = useState([]);

    // Собирем данные о адресах доставки
    const [addressDiliveryCollaborator, setAddressDiliveryCollaborator] = useState([]);



    useEffect(() => {
        // Достаем GUID из хранилища
        const guidIdCollaborator = "369581ef-5f9d-4c41-b083-6bfe926605dc";
        //const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
        
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
            setNameCollaborator(data.user.nameCollaborator);
            setEmailCollaborator(data.user.emailCollaborator);
            setPhoneCollaborator(data.user.phoneCollaborator);
            setCompany(data.companyInfo);
            setAddressDiliveryCollaborator(data.deliveryAddress);
      
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
                    <InformationCompanyCard company={company} />
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
                                <div className="information-company-card__item_discr">{phoneCollaborator==null?phoneCollaborator:"Не указан"}</div>
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Роль пользователя:</div>
                                <div className="information-company-card__item_discr">{role}</div>
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Адреса доставки:</div>
                                {addressDiliveryCollaborator.map((item, index) => (
                                    <div key={index} className="information-company-card__item_discr information-user-card__item_discr">
                                        <span role="img" aria-label="address" style={{ marginRight: '6px' }}>📍</span>
                                        {item}
                                    </div>
                                ))}
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