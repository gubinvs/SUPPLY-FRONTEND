
import {useState, useEffect} from "react";
import "../applicationPanel.css";
import "./dataCollaborator.css";
import "./informationCompanyCard.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";
import AddCompanyProvider from "./AddCompanyProvider.jsx";


// Основной блок информационной панели, вводит информацию для 
// конкретного пользователя симтемы в соответствии с ролью

const InformationPanel = ({ role }) => {
    
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
    }, [guidIdCollaborator]);
      
    return (
        <>
            <div className="main-application-panel__container">
                <div className="main-application-panel__left-block">
                    <InformationCompanyCard 
                        role={role}
                        company={company} 
                        guidIdCollaborator={guidIdCollaborator} 
                    />

                    {/* Форма для добавления новой компании поставщика, Если роль пользователя в системе заказчик, то выводим эту форму */}
                    {role === "Заказчик"?
                    <AddCompanyProvider />
                    :""}

                </div>
                <div className="main-application-panel__right-block">
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