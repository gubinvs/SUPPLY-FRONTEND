import React, { useState } from "react";
import "./informationPanel.css";
import InformationCompanyCardContent from "./InformationCompanyCardContent.jsx";
import InformationEditCompanyCardContent from "./InformationEditCompanyCardContent.jsx";
import InformationAddCompanyCardContent from "./InformationAddCompanyCardContent.jsx";
import { generateGUID } from "../../js/generateGUID.js";



///
/// Компонент отвечает за отображение информации о компаниях пользователя
///


const InformationCompanyCard = ( {company, guidIdCollaborator} ) => {
  // Инициализация идентификатора
  const [currentIndex, setCurrentIndex] = useState(0);

  // Состояние просмотра двнных о компании
  const [state, setState] = useState(true); // состояние информации о компании
  const [addState, setAddState] = useState(false); // состояние для отображения формы добавления информации о компании

  // Переключение на режим редактирвания информации о компании
  const editState =()=> {
    setState(false);
  };

  // Если нет записи о компании
  if (!company || company.length === 0) {
    company = [
      {
        guidIdCompany: generateGUID(),
        fullNameCompany: "Нет данных",
        abbreviatedNameCompany: "Нет данных",
        innCompany: "Нет данных",
        addressCompany: "Нет данных",
      },
    ];
  }

  // Идентификация полей для конкретной компании
  const currentCompany = company[currentIndex];

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  // Открыть форму заполнения для добавления новой компании
  const addNewCompany = () => {
    setAddState(true);
  };

  // Закроем форму для добавления новой компании
  const clearAddNewCompany = () => {
    setAddState(false);
  };

  // Валидация данных о ИНН компании
  const isValidInn = (inn) => {
    const regex = /^\d{10}(\d{2})?$/;
    return regex.test(inn);
  };

  return (
    <>
      <div className="information-company-card">
        
        {/* Если включено состояние добавления новой компании */}
        {addState? 
            <>
                {/* форма для добавления информации о новой компании */}
                <InformationAddCompanyCardContent guidIdCollaborator={guidIdCollaborator} />
            </>
            :
            <>
                {/* Если состояние редактирование выводим InformationEditCompanyCardContent */}
                {state?
                    <>
                        {/* Информация о компаниях */}
                        <button type="button" className="btn btn-outline-warning information-company-card__edit-botton" onClick={editState}>Редактировать</button>
                        <InformationCompanyCardContent 
                          guidIdCompany={currentCompany.guidIdCompany}
                          fullNameCompany={currentCompany.fullNameCompany}
                          abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
                          innCompany={currentCompany.innCompany} 
                          addressCompany={currentCompany.addressCompany}
                        />

                        {!isValidInn(currentCompany.innCompany) && (
                          <div className="text-danger" style={{ marginTop: "10px" }}>
                            Внимание: ИНН указан некорректно
                          </div>
                        )}
                    </>
                    :
                    <>
                      {/* Форма для изменения данных о текущей компании */}
                      <InformationEditCompanyCardContent
                          guidIdCompany={currentCompany.guidIdCompany}
                          fullNameCompany={currentCompany.fullNameCompany}
                          abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
                          innCompany={currentCompany.innCompany} 
                          addressCompany={currentCompany.addressCompany}
                          guidIdCollaborator={guidIdCollaborator}
                      />
                    </>
                }
            </>
        }

        {/* Индикаторы пагинации компаний в правом нижнем углу */}
        <div className="pagination-icon-block">
          {company.map((_, index) => (
            <div key={index} className="pagination-icon-block__icon" onClick={() => goToIndex(index)} style={{backgroundColor: index === currentIndex ? "#ffc107" : "#e0e0e0",}}> {index + 1}</div>
          ))}
          {/* Кнопка для отображения формы заполнения информации о новой компании, либо (+) либо (-) */}
          {addState?
              <div className="pagination-icon-block__icon pagination-icon-block__add-icon" onClick={clearAddNewCompany}>-</div>
              :
              <div className="pagination-icon-block__icon pagination-icon-block__add-icon" onClick={addNewCompany}>+</div>
          }
        </div>
      </div>
    </>
  );
};

export default InformationCompanyCard;
