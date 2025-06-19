import { useState, useEffect } from "react";
import "./addCompanyProvider.css";
import { useProviders } from "../../js/Utilits/loadProviders";
import ApiUrl from "../../js/ApiUrl";

//
// Компонент отвечает за карточку добавления новой компании поставщика в систему, 
// отображается только у пользователей с ролью заказчик
//

const AddCompanyProvider = () => {
    // Состояние формы заполнения данных о компании
    const [addForm, setAddForm] = useState(true);

    // Получаем все компании поставщики из таблицы SupplyProvider
    const { providers, loading, error } = useProviders();

    // Состояние значений формы
    const [formData, setFormData] = useState({
        abbreviatedNameCompany: "",
        innCompany: "",
        lastAutoFilledName: ""
    });
    const [statusMessage, setStatusMessage] = useState("");


    // При изменении ИНН ищем совпадение среди поставщиков и подставляем наименование
    useEffect(() => {
        const inn = formData.innCompany?.trim() ?? "";
        if (inn === "" || providers.length === 0) return;

        const found = providers.find(p => p.innProvider === inn);
        console.log("Найдено совпадение:", found);

        if (found) {
            setFormData(prev => {
                // Если пользователь сам ничего не вводил или предыдущее значение совпадает с предыдущим найденным
                const prevAbbr = prev.abbreviatedNameCompany?.trim() ?? "";
                const newAbbr = found.nameProvider || "";

                if (prevAbbr === "" || prevAbbr === prev.lastAutoFilledName) {
                    return {
                        ...prev,
                        abbreviatedNameCompany: newAbbr,
                        lastAutoFilledName: newAbbr, // сохраняем последнее автозаполненное
                    };
                }

                return prev; // иначе не трогаем, пользователь ввёл своё
            });
        }
    }, [formData.innCompany, providers]);


       // Обработчик изменений в полях формы
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

    // Отправка формы
    const handleSubmit = async () => {
        const abbreviatedName = formData.abbreviatedNameCompany?.trim() ?? "";
        const inn = formData.innCompany?.trim() ?? "";

        if (!abbreviatedName || !inn) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const exists = providers.some(p => p.innProvider === inn);
        if (exists) {
            alert("Компания с таким ИНН уже существует.");
            return;
        }

        try {
            const response = await fetch(ApiUrl + "/api/AddCompanyProvider", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({
                    abbreviatedNameCompany: formData.abbreviatedNameCompany,
                    innCompany: formData.innCompany
                })
            });

            if (response.ok) {
                setStatusMessage("Компания успешно добавлена!");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setStatusMessage("Ошибка при добавлении компании.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            setStatusMessage("Ошибка при отправке запроса.");
        }
    };

    // Обработчик слайдера для открытия/закрытия формы
    const openFormAddProvider = () => {
        setAddForm(prev => !prev);
    };

    return (
        <>
            <div className="add-company-provider__section">
                <h4>Добавить компанию поставщика:</h4>
                <img
                    src={addForm ? "../images/slider.svg" : "../images/close-slider.svg"}
                    alt={addForm ? "Раскрыть форму" : "Скрыть форму"}
                    className="acps-slider"
                    onClick={openFormAddProvider}
                />
            </div>
            {addForm ? null : (
                <div className="add-company-provider__section acps__add-form">
                    <ul className="information-company-card__list">
                        <li className="information-company-card__item">
                            <div className="information-company-card__item_title">Сокращенное наименование:</div>
                            <input
                                className="form-control"
                                type="text"
                                name="abbreviatedNameCompany"
                                aria-label="Сокращенное наименование"
                                value={formData.abbreviatedNameCompany}
                                onChange={handleChange}
                            />
                        </li>
                        <li className="information-company-card__item">
                            <div className="information-company-card__item_title">ИНН:</div>
                            <input
                                className="form-control"
                                type="text"
                                name="innCompany"
                                aria-label="ИНН"
                                value={formData.innCompany}
                                onChange={(e) =>
                                    handleChange({
                                        target: {
                                            name: "innCompany",
                                            value: e.target.value.replace(/\D/g, "") // только цифры
                                        }
                                    })
                                }
                            />
                        </li>
                        <li className="information-company-card__item">
                            <button
                                type="button"
                                className="btn btn-outline-warning acps__add-button"
                                onClick={handleSubmit}
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

export default AddCompanyProvider;
