
import {useState, useEffect} from "react";
import "./informationPal.css";
import "../applicationPanel.css";
import "./dataCollaborator.css";
import "./informationCompanyCard.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";
import { SpinnersMin } from "../../ElementApplication/Spinners.jsx";
import {useProviders} from "../../js/Utilits/loadProviders.js";



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
  
  const handleSelect = (e) => {
    setFile(e.target.files[0]);
  };

  // Список поставщиков
  const Component = () => {
    const { providers, loading, error } = useProviders();

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error.message}</p>;

    return (
      <select
        className="form-select"
        style={{ maxHeight: "50px" }}
        onChange={(e) => handleProviderChange(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Выберите поставщика
        </option>

        {providers.map((p) => (
          <option
            key={p.guidIdProvider}
            value={p.guidIdProvider}
          >
            {p.nameProvider}
          </option>
        ))}
      </select>
    );
  };

  // Список производителей
  const   Manufacturer = () =>  {
   
      useEffect(() => {
        const loadManufacturers = async () => {
          try {
            const response = await fetch(
              ApiUrl + "/api/ReturnListManufacturer"
            );

            const data = await response.json();

            setManufacturer(data.manufacturer);
          } catch (error) {
            console.error("Ошибка загрузки производителей:", error);
          }
        };

        loadManufacturers();
      }, []);
      


      return (
        <>
            <select 
                className="form-select" 
                style={{'maxMenuHeight': '50px'}}
            >
                <option selected>Выберите производителя</option>
                {manufacturer.map(p => <option value={p.guidIdManufacturer}>{p.nameManufacturer}</option>)}
            </select>
        </>
      );
  };


  const handleProviderChange = (e) => {
      // Записали в переменную идентификатор компании
      setGuidIdProvider(e);

      // Отправили запрос к api для получения информации о менеджерах компании
      const fetchData = async () => {
          try {
           const response = await fetch(`${ApiUrl}/api/ReturnInfoCollaboratorProvider?guid=${e}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();

            if (data === null || data.length === 0) {
              const formattedData = {
                nameCollaboratorProvider: " ",
                phoneCollaboratorProvider: " ",
                emailCollaboratorProvider: " "
              };
            };

            // Метод .map() создаст новый массив с нужной структурой объектов
            const formattedData = data.map(element => ({
              nameCollaboratorProvider: element.nameCollaboratorProvider || " ",
              phoneCollaboratorProvider: element.phoneCollaboratorProvider || " ",
              emailCollaboratorProvider: element.emailCollaboratorProvider || " "
            }));

            console.log(formattedData);

            // Сохраняем получившийся массив в состояние
            setCollaboratorProvider(formattedData);
                  
          } catch (error) {
            console.error("Ошибка при авторизации:", error);
          }
        };
      
      fetchData();

      // Сделали видимым окно вывода информации о компании
      setCollaboratorInfo(true);
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
                <div className="collaborator-provider-info-block">
                    <h5 className="cpib__title"> Информация о компании поставщика:</h5>
                    {Component()}
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
                    </div>
                  </>
                  :
                  <></>
                }
                {/* Блок с информацией о Поставщиках определенного производителя*/}
                <div className="loading-data-from-1C-block">
                    <h5 className="cpib__title"> Поставщики производителя:</h5>
                    {Manufacturer()}
                </div>
            </div>
        </div>
    </>
  );
};

export default InformationPanel;