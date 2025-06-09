import React, { useState } from "react";
import "./informationPanel.css";
import InformationCompanyCardContent from "./InformationCompanyCardContent.jsx";
import InformationEditCompanyCardContent from "./InformationEditCompanyCardContent.jsx";

const InformationCompanyCard = ({ role, company }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Состояние просмотра двнных о компании
  const [state, setState] = useState(true);

  // Переключение на режим редактирвания
  const editState =()=> {
    setState(false);
  };

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

  return (
    <>
      <div className="information-company-card">
        {/* Если состояние редактирование выводим InformationEditCompanyCardContent */}
        {state?
            <>
                <button type="button" className="btn btn-outline-warning information-company-card__edit-botton" onClick={editState}>Редактировать</button>
                <InformationCompanyCardContent 
                    fullNameCompany={currentCompany.fullNameCompany}
                    abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
                    innCompany={currentCompany.innCompany} 
                    addressCompany={currentCompany.addressCompany}
                />
            </>
            :
            <InformationEditCompanyCardContent
                fullNameCompany={currentCompany.fullNameCompany}
                abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
                innCompany={currentCompany.innCompany} 
                addressCompany={currentCompany.addressCompany}
            />
        }

        {/* Индикаторы пагинации компаний в правом нижнем углу */}
        <div className="pagination-icon-block">
          {company.map((_, index) => (
            <div key={index} className="pagination-icon-block__icon" onClick={() => goToIndex(index)} style={{backgroundColor: index === currentIndex ? "#ffc107" : "#e0e0e0",}}> {index + 1}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InformationCompanyCard;
