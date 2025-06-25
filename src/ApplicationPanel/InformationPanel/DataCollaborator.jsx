import {useState} from "react";
import EditDataCollaborator from "./EditDataCollaborator.jsx";
import {wordingOfState} from "../../js/Utilits/wordingOfState.js";


const DataCollaborator = ({
    guidIdCollaborator,
    role,
    nameCollaborator,
    emailCollaborator,
    phoneCollaborator,
    addressDiliveryCollaborator
}) => {
    
    // Состояние редактирования данных
    const [state, setState] = useState(false);
    // Состояние видимости карточки пользователя
    const [visibilityCard, setVisibilityCard] = useState(false);

    const editState =() => {
        setState(true);
    };

    return (
        <>
            {!state?
                <>
                    <div className="add-company-provider__section">
                        <h5>Данные пользователя в системе:</h5>
                        <img
                            src={!visibilityCard ? "../images/slider.svg" : "../images/close-slider.svg"}
                            alt={!visibilityCard ? "Раскрыть форму" : "Скрыть форму"}
                            className="acps-slider"
                            onClick={() => wordingOfState(visibilityCard, setVisibilityCard)}
                        />
                    </div>
                    {visibilityCard?
                        <div className="information-user-card">
                            <div className="information-user-card__title_fon"></div>
                            <div className="information-user-card__title">Информация о пользователе:</div>
                            <ul className="information-company-card__list">
                                <li className="information-company-card__item">
                                    <div className="information-company-card__item_title">Имя:</div>
                                    <div className="information-company-card__item_discr">{nameCollaborator}</div>
                                </li> 
                                <li className="information-company-card__item">
                                    <div className="information-company-card__item_title">E-mail:</div>
                                    <div className="information-company-card__item_discr">{emailCollaborator}</div>
                                </li> 
                                <li className="information-company-card__item">
                                    <div className="information-company-card__item_title">Телефон:</div>
                                    <div className="information-company-card__item_discr">{phoneCollaborator || "Не указан"}</div>
                                </li>
                                <li className="information-company-card__item">
                                    <div className="information-company-card__item_title">Роль пользователя:</div>
                                    <div className="information-company-card__item_discr">{role}</div>
                                </li>
                                <li className="information-company-card__item">
                                    <div className="information-company-card__item_title">Адреса доставки:</div>
                                    {addressDiliveryCollaborator.map((item, index) => (
                                        <div key={index} className="information-company-card__item_discr information-user-card__item_discr">
                                            <span role="img" aria-label="address" style={{ marginRight: '6px' }}>📍</span>
                                            {item}
                                        </div>
                                    ))}
                                </li>
                            </ul>
                            <button type="button" className="btn btn-outline-warning information-user-card__edit-botton" onClick={editState}>Редактировать</button>
                        </div>
                    :
                    ""}
                </>
                :
                <>
                    <EditDataCollaborator 
                        guidIdCollaborator={guidIdCollaborator}
                        role={role}
                        nameCollaborator = {nameCollaborator}
                        emailCollaborator={emailCollaborator}
                        phoneCollaborator={phoneCollaborator}
                        addressDiliveryCollaborator={addressDiliveryCollaborator}
                    />
                </>
            }
        </>
    );

};

export default DataCollaborator;