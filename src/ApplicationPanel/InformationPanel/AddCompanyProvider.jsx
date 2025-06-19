import { useState } from "react";
import "./addCompanyProvider.css";
//
// Компонент отвечает за карточку добавления новой компании поставщика в систему, 
// отображается только у пользователей с ролью заказчик
//


const AddCompanyProvider = () => {
    // Состояние формы заполнения данных о компании
    const [addForm, setAddForm] = useState(true);


    // Обработчик слайдера
    const openFormAddProvider = () => {
        if (addForm == false) {
           setAddForm(true); 
        }
        
        if (addForm == true) {
           setAddForm(false); 
        }
    };

    return (
        <>
            <div className="add-company-provider__section">
                <h4>Добавить компанию поставщика:</h4>
                <img src={addForm?"../images/slider.svg":"../images/close-slider.svg"} alt="Раскрыть форму" className="acps-slider" onClick={openFormAddProvider} />
            </div>
            {addForm?"":
                <>
                    <div className="add-company-provider__section acps__add-form">
                        <ul className="information-company-card__list">
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Полное наименование:</div>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="fullNameCompany"
                                    aria-label="Полное наименование"
                                />
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Сокращенное наименование:</div>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="abbreviatedNameCompany"
                                    aria-label="Сокращенное наименование"
                                />
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">ИНН:</div>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="innCompany"
                                    aria-label="ИНН"
                                />
                            </li>
                            <li className="information-company-card__item">
                                <div className="information-company-card__item_title">Юридический адрес:</div>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="addressCompany"
                                    aria-label="Юридический адрес"
                                />
                            </li>    
                            <li className="information-company-card__item">
                                <button
                                    type="button"
                                    className="btn btn-outline-warning acps__add-button"
                                   
                                >
                                    Записать
                                </button>
                            </li>  
                        </ul>
                    </div>
                </>
            }
        </>
    );
};

export default AddCompanyProvider;