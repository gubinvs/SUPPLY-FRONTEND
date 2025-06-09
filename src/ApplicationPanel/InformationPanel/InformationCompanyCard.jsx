import React, { useState } from "react";
import "./informationPanel.css"

const InformationCompanyCard = ({ role, company }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!company || company.length === 0) {
    return (
      <>
        <div className="information-company-card" style={{ position: "relative" }}>
          <div>Нет данных о компаниях</div>
          <button
            type="button"
            className="btn btn-outline-warning information-company-card__edit-botton"
          >
            Редактировать
          </button>
        </div>
      </>
    );
  }

  const currentCompany = company[currentIndex];

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="information-company-card" style={{ position: "relative" }}>
        <button
          type="button"
          className="btn btn-outline-warning information-company-card__edit-botton"
        >
          Редактировать
        </button>
        <div className="information-company-card__title">Реквизиты компании:</div>
        <div className="information-company-card__title_fon"></div>
        <ul className="information-company-card__list">
          <li className="information-company-card__item">
            <div className="information-company-card__item_title">Полное наименование:</div>
            <div className="information-company-card__item_discr">{currentCompany.fullNameCompany}</div>
          </li>
          <li className="information-company-card__item">
            <div className="information-company-card__item_title">Сокращенное наименование:</div>
            <div className="information-company-card__item_discr">{currentCompany.abbreviatedNameCompany}</div>
          </li>
          <li className="information-company-card__item">
            <div className="information-company-card__item_title">ИНН:</div>
            <div className="information-company-card__item_discr">{currentCompany.innCompany}</div>
          </li>
          <li className="information-company-card__item">
            <div className="information-company-card__item_title">Юридический адрес:</div>
            <div className="information-company-card__item_discr">{currentCompany.addressCompany}</div>
          </li>
        </ul>

        {/* Индикаторы страниц в правом нижнем углу */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "6px",
          }}
        >
          {company.map((_, index) => (
            <div
              key={index}
              onClick={() => goToIndex(index)}
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: index === currentIndex ? "#ffc107" : "#e0e0e0",
                borderRadius: "3px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                userSelect: "none",
              }}
              
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InformationCompanyCard;
