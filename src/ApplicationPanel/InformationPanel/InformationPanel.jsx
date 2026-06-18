
import React, { useState, useEffect } from 'react';
//import Select from 'react-select';
import "./informationPal.css";
import "../applicationPanel.css";
import "./dataCollaborator.css";
import "./informationCompanyCard.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";
import { SpinnersMin } from "../../ElementApplication/Spinners.jsx";
//import {useProviders} from "../../js/Utilits/loadProviders.js";
import Component from './Component.jsx';
import Manufacturer from './Manufacturer.jsx';
//import {handleSelectManufacturerChange} from "../../js/Utilits/handleSelectManufacturerChange.js";
import AddInfoCollaborator from "./AddInfoCollaborator";



// Основной блок информационной панели, вводит информацию для 
// конкретного пользователя системы в соответствии с ролью

const InformationPanel = ({ role }) => {
    
  // Формируем данные о пользователе
  const [nameCollaborator, setNameCollaborator] = useState("");
  const [emailCollaborator, setEmailCollaborator] = useState("");
  const [phoneCollaborator, setPhoneCollaborator] = useState("");
  const [loanding, setLoanding] = useState(false);
  // Панель отображения данных о сотрудниках компании
  const [collaboratorInfo, setCollaboratorInfo] = useState(false);
  const [providerManufacturerInfo, setProviderManufacturerInfo] = useState(false);
  const [providerManufacturerList, setProviderManufacturerList] = useState([]);
  // Собираем данные о компаниях в таблице SupplyCompany информацию о компаниях пользователей
  const [company, setCompany] = useState([]);
  // Идентификатор компании
  const [guidIdProvider, setGuidIdProvider] = useState("");
  // Контакты сотрудников компании
  const [collaboratorProvider, setCollaboratorProvider] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  // Собирем данные о адресах доставки
  const [addressDiliveryCollaborator, setAddressDiliveryCollaborator] = useState([]);
  // Достаем GUID из хранилища
  const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
  // Работа с файлом загрузки оприходованных товаров
  const [file, setFile] = useState(null);
  const [guidIdManufacturer, setGuidIdManufacturer] = useState("");
  const handleSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const [newNameCollaborator, setNewNameCollaborator] = useState("");
  const [newEmailCollaborator, setNewEmailCollaborator] = useState("");
  const [newPhoneCollaborator, setNewPhoneCollaborator] = useState("");
  const [editGuidIdProvider, setEditGuidIdProvider] = useState("");
  const pushNewDataCollaborator = async  (guid, n, e, p) => {

      const newData = {
          guidIdCompanyProvider : guid,
          nameCollaboratorProvider : n,
          phoneCollaboratorProvider : p,
          emailCollaboratorProvider : e
      }


      console.log(newData);
      // Отправляем данные о новом менеджере компании
      try {
          const response = await fetch(
              ApiUrl + "/api/+++++++++++++",
            {
              method: "POST",
              body: JSON.stringify(newData),
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
      } catch (error) {
          console.error("Ошибка загрузки данных о новом менеджере:", error);
      }
  };

  // Включить панель добавления компании поставщика фирмы производителя
  const [panelProviderManufacturer, setPanelProviderManufacturer] = useState(false);
  const addProviderManufacturer = () => {
      if (panelProviderManufacturer === true) {
          setPanelProviderManufacturer (false);
      } else {
        setPanelProviderManufacturer(true)
      }
  };

  // Включает панель добавления данных о менеждерах компании поставщика
  const [panelCollaboratorProvider, setPanelCollaboratorProvider] = useState(false);
  const addCollaboratorProvider = () => {
      if (panelCollaboratorProvider === true) {
          setPanelCollaboratorProvider (false);
      } else {
          setPanelCollaboratorProvider(true)
      }
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
                {/* Данные о поставщиках и менеджерах */}
                {panelCollaboratorProvider?
                    <>
                        {/* Панель ввода данных о менеджере компании */}
                        <div className="collaborator-provider-info-block"> 
                            <div
                              className="pagination-icon-block__icon pagination-icon-block__add-icon cpib__plus-button"
                              onClick={()=>addCollaboratorProvider()}
                            >
                              -
                            </div>
                            <h5 className="cpib__title"> Ввод данных о менеджере компании поставщика:</h5>
                            <AddInfoCollaborator  setEditGuidIdProvider={setEditGuidIdProvider} manufacturer={manufacturer} />
                        </div>
                        <div className="row g-3" style={{marginBottom: '10px', paddingRight: "10px"}}>
                          <div class="col">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Фамилия Имя *Отчество" 
                                aria-label="Фамилия Имя Отчество*" 
                                onChange={(e) => setNewNameCollaborator(e.target.value)}
                            />
                          </div>
                          <div class="col">
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="Email" 
                                aria-label="Email" 
                                onChange={(e) => setNewEmailCollaborator(e.target.value)}
                            />
                          </div>
                           <div class="col">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Телефон" 
                                aria-label="Телефон" 
                                onChange={(e) => setNewPhoneCollaborator(e.target.value)}
                            />
                          </div>
                          <button 
                              style={{width: "200px"}} 
                              type="button" 
                              className="btn btn-outline-warning"
                              onClick={()=>pushNewDataCollaborator(editGuidIdProvider, newNameCollaborator, newEmailCollaborator, newPhoneCollaborator)}
                          >Записать</button>
                        </div>
                    </>
                    :
                    <>
                      {/* Панель вывода данных о менеджере компании */}
                        <div className="collaborator-provider-info-block"> 
                            <div
                              className="pagination-icon-block__icon pagination-icon-block__add-icon cpib__plus-button"
                              onClick={()=>addCollaboratorProvider()}
                            >
                              +
                            </div>
                            <h5 className="cpib__title"> Информация о менеджере компании поставщика:</h5>
                            <Component setGuidIdProvider={setGuidIdProvider} setCollaboratorInfo={setCollaboratorInfo} setCollaboratorProvider={setCollaboratorProvider}  />
                        </div>
                        {collaboratorInfo?
                          <>
                            <div className="collaborator-provider-info-block__collaborator-info">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" style={{borderTopLeftRadius:"10px"}}></th>
                                            <th scope="col">Контакт</th>
                                            <th scope="col">Телефон</th>
                                            <th scope="col" style={{borderTopRightRadius: "10px"}}>E-mail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {collaboratorProvider.map((item) => (
                                            <tr key={1}>
                                                <td></td>
                                                <td>{item.nameCollaboratorProvider}</td>
                                                <td>{item.phoneCollaboratorProvider}</td>
                                                <td>{item.emailCollaboratorProvider}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                          </>:<></>
                        }
                    </>}               
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
                {/* Форма загрузки файла с данными о купленной номенклатуре, выгрузка из 1с */}
                {role === "Администратор системы"?
                  <> 
                    <div className="loading-data-from-1C-block">
                        <h6 className="ldfb__title">Загрузка файла с данными о покупке номенклатуры<br/> из 1С "Выгрузка цен закупки"</h6>
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
                    </div><br/>
                  </>
                  :
                  <></>
                }
                {/* Блок с информацией о Поставщиках определенного производителя*/}
                {panelProviderManufacturer?<>asasasa</>:<></>}
                <div className="loading-data-from-1C-block">
                    <div
                      className="pagination-icon-block__icon pagination-icon-block__add-icon cpib__plus-button"
                      onClick={()=>addProviderManufacturer()}
                    >
                      +
                    </div>
                    <h5 className="cpib__title"> Поставщики производителя:</h5>
                    <Manufacturer setGuidIdManufacturer={setGuidIdManufacturer} setProviderManufacturerInfo={setProviderManufacturerInfo} setProviderManufacturerList={setProviderManufacturerList} />
                </div>
                {providerManufacturerInfo?
                    <>
                    <br/>
                      <div className="collaborator-provider-info-block__collaborator-info">
                          <table className="table">
                              <thead>
                                  <tr>
                                      <th scope="col" style={{borderTopLeftRadius:"10px"}}></th>
                                      <th scope="col">Наименование компаниии</th>
                                      <th scope="col" style={{borderTopRightRadius: "10px"}}></th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {providerManufacturerList.map((item) => (
                                      <tr key={1}>
                                          <td></td>
                                          <td>{item.nameProvider}</td>
                                          <td></td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    </>:<></>
                }
            </div>
        </div>
    </>
  );
};

export default InformationPanel;