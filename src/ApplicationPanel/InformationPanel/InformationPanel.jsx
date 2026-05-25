
import {useState, useEffect} from "react";
import "../applicationPanel.css";
import "./dataCollaborator.css";
import "./informationCompanyCard.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";
import { SpinnersMin } from "../../ElementApplication/Spinners.jsx";



// Основной блок информационной панели, вводит информацию для 
// конкретного пользователя системы в соответствии с ролью

const InformationPanel = ({ role }) => {
    
  // Формируем данные о пользователе
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [emailCollaborator, setEmailCollaborator] = useState("");
  const [phoneCollaborator, setPhoneCollaborator] = useState("");
  const [loanding, setLoanding] = useState(false);

  // Собираем данные о компаниях в таблице SupplyCompany информацию о компаниях пользователей
  const [company, setCompany] = useState([]);

  // Собирем данные о адресах доставки
  const [addressDiliveryCollaborator, setAddressDiliveryCollaborator] = useState([]);

  // Достаем GUID из хранилища
  const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");

  // Работа с файлом загрузки оприходованных товаров
  const [file, setFile] = useState(null);
  
  const handleSelect = (e) => {
    setFile(e.target.files[0]);
  };



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


  /// Скрипт принимает файл с данными о купленной за период номенклатуре
  /// и отправляет его на сервер

  const filePurchaseUpload = async (file) => {
        setLoanding(true);
                      
        const formData = new FormData();

        // ВАЖНО: имя поля должно совпадать с backend
        formData.append("formFile", file);

        const response = await fetch(
          ApiUrl + "/api/AddRecordingPurchasePrice",
          {
            method: "POST",
            body: formData,
            headers: {
              accept: "*/*",
            },
          }
        );

         

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        } else {
          setLoanding(false);
        }
        
        
      return await response.text();
    };

    
  return (
      <>
        <div className="main-application-panel__container">
            <div className="main-application-panel__left-block">
                <InformationCompanyCard 
                    role={role}
                    company={company} 
                    guidIdCollaborator={guidIdCollaborator} 
                />
                {/* Форма загрузки файла с данными о купленной номенклатуре, выгрузка из 1с */}
                {console.log(role)}
                {role === "Администратор системы"?
                  <> 
                    <br/><br/><br/>
                    <h5>Загрузка файла с данными о покупке номенклатуры<br/> из 1С "Выгрузка цен закупки"</h5>
                    <br/>
                    {!loanding?
                      <>
                       
                        <div className="input-group mb-3 ">
                            <input 
                              type="file" 
                              className="form-control" 
                              id="inputGroupFile02" 
                              onChange={handleSelect}
                            />
                            <button 
                              className="input-group-text" 
                              for="inputGroupFile02"
                              onClick={()=>filePurchaseUpload(file)}
                            >Загрузить</button>
                        </div>
                      </>
                      :
                      <SpinnersMin />
                    }
                  </>
                  :
                  <></>
              
                }
            </div>
            <div className="main-application-panel__right-block">
                <div className="mb-10">
                  {/* Форма редактирования данных о пользователе */}
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
        </div>
    </>
  );
};

export default InformationPanel;