import { useState, useEffect } from "react";
import "./addCompanyProvider.css";
import { useProviders } from "../../js/Utilits/loadProviders";
import ApiUrl from "../../js/ApiUrl";

const AddCompanyProvider = () => {
    const [addForm, setAddForm] = useState(true);
    const { providers, loading, error } = useProviders();

    const [formData, setFormData] = useState({
        abbreviatedNameCompany: "",
        innCompany: "",
        lastAutoFilledName: ""
    });
    const [statusMessage, setStatusMessage] = useState("");

    // При изменении ИНН ищем совпадение среди поставщиков и подставляем наименование,
    // если совпадений нет — очищаем поле с именем
    useEffect(() => {
        const inn = formData.innCompany?.trim() ?? "";
        if (inn === "" || providers.length === 0) {
            // Сбрасываем имя, если поле ИНН пустое или данных нет
            setFormData(prev => ({
                ...prev,
                abbreviatedNameCompany: "",
                lastAutoFilledName: ""
            }));
            return;
        }

        const found = providers.find(p => p.innProvider === inn);
        console.log("useEffect: найдено совпадение:", found);

        if (found) {
            setFormData(prev => {
                // если поле пустое или совпадает с прошлым автозаполнением, обновляем имя
                if (
                    prev.abbreviatedNameCompany.trim() === "" ||
                    prev.abbreviatedNameCompany === prev.lastAutoFilledName
                ) {
                    return {
                        ...prev,
                        abbreviatedNameCompany: found.nameProvider || "",
                        lastAutoFilledName: found.nameProvider || ""
                    };
                }
                // иначе пользователь вводил свое — не меняем имя
                return prev;
            });
        } else {
            // Совпадений нет — сбрасываем имя и lastAutoFilledName
            setFormData(prev => ({
                ...prev,
                abbreviatedNameCompany: "",
                lastAutoFilledName: ""
            }));
        }
    }, [formData.innCompany, providers]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Если пользователь меняет поле имени вручную — сбросим lastAutoFilledName,
        // чтобы автозаполнение не перезаписывалось
        if (name === "abbreviatedNameCompany") {
            setFormData(prev => ({
                ...prev,
                abbreviatedNameCompany: value,
                lastAutoFilledName: ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

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
                                placeholder="Поиск по ИНН"
                                value={formData.innCompany}
                                onChange={(e) =>
                                    handleChange({
                                        target: {
                                            name: "innCompany",
                                            value: e.target.value.replace(/\D/g, "")
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
