import { useState } from "react";
import "./manufacturer.css";
import { wordingOfState } from "../js/Utilits/wordingOfState.js";
import { addCompanyManufacturer } from "../js/RequestsApi/addCompanyManufacturer.js";

const Manufacturer = () => {
    const [form, setForm] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [manufacturerName, setManufacturerName] = useState("");

    return (
        <>
            <div className="add-company-provider__section">
                <h5>Добавить наименование производителя:</h5>
                <img
                    src={form ? "../images/slider.svg" : "../images/close-slider.svg"}
                    alt={form ? "Раскрыть форму" : "Скрыть форму"}
                    className="acps-slider"
                    onClick={() => wordingOfState(form, setForm)}
                />
            </div>
            {!form && (
                <div className="add-company-provider__section acps__add-form">
                    <ul className="information-company-card__list">
                        <li className="information-company-card__item">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                aria-label="Наименование"
                                value={manufacturerName}
                                onChange={(e) => setManufacturerName(e.target.value)}
                                placeholder="Наименование производителя"
                            />
                        </li>
                        <li className="information-company-card__item">
                            <button
                                type="button"
                                className="btn btn-outline-warning acps__add-button"
                                onClick={() => addCompanyManufacturer(manufacturerName, setStatusMessage)}
                            >
                                Записать
                            </button>
                        </li>
                        {statusMessage && (
                            <li className="information-company-card__item">
                                <div>{statusMessage}</div>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Manufacturer;
