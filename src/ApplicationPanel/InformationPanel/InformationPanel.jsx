import React from "react";
import {useState, useEffect} from "react";
import "./informationPanel.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";


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

    // Достаем GUID из хранилища
    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");

    useEffect(() => {
        
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
                    <InformationCompanyCard 
                        company={company} 
                        guidIdCollaborator={guidIdCollaborator} 
                    />
                </div>
                <div className="iformation-panel-right-block">
                    <DataCollaborator 
                        guidIdCollaborator={guidIdCollaborator}
                        role={role}
                        nameCollaborator={nameCollaborator} 
                        emailCollaborator={emailCollaborator}
                        phoneCollaborator={phoneCollaborator}
                        addressDiliveryCollaborator={addressDiliveryCollaborator}
                    />
                </div>
            </div>
        </>
    );

};

export default InformationPanel;