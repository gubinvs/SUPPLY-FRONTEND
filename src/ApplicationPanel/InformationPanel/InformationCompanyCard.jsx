import React, { useState } from "react";
import "./informationPanel.css";
import InformationCompanyCardContent from "./InformationCompanyCardContent.jsx";
import InformationEditCompanyCardContent from "./InformationEditCompanyCardContent.jsx";
import InformationAddCompanyCardContent from "./InformationAddCompanyCardContent.jsx";

const InformationCompanyCard = ({ role, company }) => {
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
    return (
      <>
        <div className="information-company-card" style={{ position: "relative" }}>
          <div>Нет данных о компаниях</div>
          <button type="button" className="btn btn-outline-warning information-company-card__edit-botton"  onClick={editState}>Редактировать</button>
        </div>
      </>
    );
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

  return (
    <>
      <div className="information-company-card">
        
        {/* Если включено состояние добавления новой компании */}
        {addState? 
            <>
                {/* форма для добавления информации о новой компании */}
                <InformationAddCompanyCardContent />
            </>
            :
            <>
                {/* Если состояние редактирование выводим InformationEditCompanyCardContent */}
                {state?
                    <>
                        {/* Информация о компаниях */}
                        <button type="button" className="btn btn-outline-warning information-company-card__edit-botton" onClick={editState}>Редактировать</button>
                        <InformationCompanyCardContent 
                            fullNameCompany={currentCompany.fullNameCompany}
                            abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
                            innCompany={currentCompany.innCompany} 
                            addressCompany={currentCompany.addressCompany}
                        />
                    </>
                    :
                    <>
                      {/* Форма для изменения данных о текущей компании */}
                      <InformationEditCompanyCardContent
                          fullNameCompany={currentCompany.fullNameCompany}
                          abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
                          innCompany={currentCompany.innCompany} 
                          addressCompany={currentCompany.addressCompany}
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
          {/* Кнопка для отображения формы заполнения информации о новой компании */}
          <div className="pagination-icon-block__icon pagination-icon-block__add-icon" onClick={addNewCompany}>+</div>
        </div>
      </div>
    </>
  );
};

export default InformationCompanyCard;
