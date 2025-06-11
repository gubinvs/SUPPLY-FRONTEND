import React, { useState } from "react";
import "./informationPanel.css";
import InformationCompanyCardContent from "./InformationCompanyCardContent.jsx";
import InformationEditCompanyCardContent from "./InformationEditCompanyCardContent.jsx";
import InformationAddCompanyCardContent from "./InformationAddCompanyCardContent.jsx";
import { generateGUID } from "../../js/generateGUID.js";

///
/// Компонент отвечает за отображение информации о компаниях пользователя
///

const InformationCompanyCard = ({ company, guidIdCollaborator }) => {
  // Состояния компонента
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState(true); // режим просмотра
  const [addState, setAddState] = useState(false); // режим добавления

  // Проверка корректности ИНН
  const isInnValid = (inn) => {
    return /^\d{10}$/.test(inn); // ИНН должен быть строкой из 10 цифр
  };

  // Если company не передана или пуста — используем заглушку
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

  const currentCompany = company[currentIndex];

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const addNewCompany = () => {
    setAddState(true);
  };

  const clearAddNewCompany = () => {
    setAddState(false);
  };

  const editState = () => {
    setState(false);
  };

  // Если ИНН некорректен — покажем предупреждение
  const showInvalidInnWarning = !isInnValid(currentCompany.innCompany);

  return (
    <div className="information-company-card">
      {addState ? (
        <InformationAddCompanyCardContent guidIdCollaborator={guidIdCollaborator} />
      ) : showInvalidInnWarning ? (
        <>
          <div className="alert alert-warning">
            ИНН компании некорректен или отсутствует. Пожалуйста, добавьте корректные данные.
          </div>
          <div className="pagination-icon-block">
            <div
              className="pagination-icon-block__icon pagination-icon-block__add-icon"
              onClick={addNewCompany}
            >
              +
            </div>
          </div>
        </>
      ) : state ? (
        <>
          <button
            type="button"
            className="btn btn-outline-warning information-company-card__edit-botton"
            onClick={editState}
          >
            Редактировать
          </button>
          <InformationCompanyCardContent
            guidIdCompany={currentCompany.guidIdCompany}
            fullNameCompany={currentCompany.fullNameCompany}
            abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
            innCompany={currentCompany.innCompany}
            addressCompany={currentCompany.addressCompany}
          />
        </>
      ) : (
        <InformationEditCompanyCardContent
          guidIdCompany={currentCompany.guidIdCompany}
          fullNameCompany={currentCompany.fullNameCompany}
          abbreviatedNameCompany={currentCompany.abbreviatedNameCompany}
          innCompany={currentCompany.innCompany}
          addressCompany={currentCompany.addressCompany}
          guidIdCollaborator={guidIdCollaborator}
        />
      )}

      {/* Пагинация и кнопка добавления компании */}
      {!addState && !showInvalidInnWarning && (
        <div className="pagination-icon-block">
          {company.map((_, index) => (
            <div
              key={index}
              className="pagination-icon-block__icon"
              onClick={() => goToIndex(index)}
              style={{
                backgroundColor: index === currentIndex ? "#ffc107" : "#e0e0e0",
              }}
            >
              {index + 1}
            </div>
          ))}
          <div
            className="pagination-icon-block__icon pagination-icon-block__add-icon"
            onClick={addNewCompany}
          >
            +
          </div>
        </div>
      )}

      {addState && (
        <div className="pagination-icon-block">
          <div
            className="pagination-icon-block__icon pagination-icon-block__add-icon"
            onClick={clearAddNewCompany}
          >
            -
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationCompanyCard;
