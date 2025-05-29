import React, { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./EditPriceComponent.css";

const EditPriceComponent = () => {
    const [component, setComponent] = useState("");
    const [providers, setProviders] = useState([]);
    const [article, setArticle] = useState("");
    const [price, setPrice] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [selectedProvider, setSelectedProvider] = useState("");
    const [name, setName] = useState('');
    const [isSearched, setIsSearched] = useState(false);



    useEffect(() => {
        fetch(ApiUrl + "/api/ReturnListProvider")
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка загрузки поставщиков");
                return response.json();
            })
            .then((data) => {
                setProviders(data.providers);

                const savedArticle = sessionStorage.getItem('lastAddedArticle');
                if (savedArticle) {
                    setArticle(savedArticle);
                    sessionStorage.removeItem('lastAddedArticle');
                }
            })
            .catch((error) => console.error("Ошибка при загрузке поставщиков:", error));
    }, []);

    const handleSearchComponent = () => {
        if (!article.trim()) return;

        setIsSearched(true); // помечаем, что поиск выполнен

        fetch(`${ApiUrl}/api/ReturnDataArticle/${encodeURIComponent(article)}`)
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка при получении данных компонента");
                return response.json();
            })
            .then((data) => {
                setComponent(data.component);
                setPrice("");
                setDeliveryTime("");
                setSelectedProvider("");
            })
            .catch((error) => {
                console.error("Ошибка при получении компонента:", error);
                setComponent(null);
            });
    };

    const handleEditComponent = () => {
        if (!price || !deliveryTime || !selectedProvider) {
            alert("Заполните все поля перед сохранением.");
            return;
        }

        const payload = {
            vendorCodeComponent: component.vendorCodeComponent,
            guidIdProvider: selectedProvider,
            priceComponent: parseFloat(price),
            deliveryTimeComponent: deliveryTime
        };

        fetch(ApiUrl + "/api/ChangePrice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then((response) => {
            if (!response.ok) throw new Error("Ошибка при сохранении");
            alert("Изменения успешно сохранены!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Ошибка при сохранении:", error);
            alert("Не удалось сохранить изменения.");
        });
    };

    const handleAddComponent = async () => {
        if (!article || !name) {
            alert('Заполните оба поля');
            return;
        }

        try {
            const response = await fetch(ApiUrl + '/api/AddComponent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vendorCodeComponent: article,
                    nameComponent: name
                })
            });

            if (response.ok) {
                alert('Компонент успешно добавлен!');
                sessionStorage.setItem('lastAddedArticle', article);
                window.location.reload();
            } else {
                const errorText = await response.text();
                alert(`Ошибка при добавлении: ${errorText}`);
            }
        } catch (error) {
            alert(`Ошибка соединения: ${error}`);
        }
    };

    return (
        <div className="container edit-price-component__container">
            <h4 className="edit-price-component__h4">Внести данные о ценах поставщика:</h4>
            <div className="input-group mb-3 edit-price-component__search-block">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Артикул"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    aria-label="Артикул"
                    aria-describedby="button-addon2"
                />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSearchComponent}>
                    Найти
                </button>
            </div>
            {!component ? (
                <>
                    {/* // Если нет данных на страницу выводим форму для добавления компонента в базу данных */}
                    {isSearched && !component ? (
                        <>
                            <h4 className="edit-price-component__h4">Добавить новый компонент:</h4>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Артикул"
                                    value={article}
                                    onChange={(e) => setArticle(e.target.value)}
                                    aria-label="Артикул"
                                    aria-describedby="button-addon3"
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Наименование"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    aria-label="Наименование"
                                    aria-describedby="button-addon3"
                                />
                                <button className="btn btn-outline-secondary" type="button" id="button-addon3" onClick={handleAddComponent}>
                                    Добавить в базу
                                </button>
                            </div>
                        </>
                    ) : null}

                </>

            ) : (
                // Если данные есть выводим их в таблице
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Артикул</th>
                            <th scope="col">Наименование</th>
                            <th scope="col">Цена</th>
                            <th scope="col">Срок поставки</th>
                            <th scope="col">Поставщик</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{component.vendorCodeComponent}</td>
                            <td>{component.nameComponent}</td>
                            <td>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Новая цена"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Новый срок"
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    className="form-select"
                                    aria-label="Выбери поставщика"
                                    value={selectedProvider}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                >
                                    <option value="">Выбери поставщика</option>
                                    {providers.map((item) => (
                                        <option key={item.guidIdProvider} value={item.guidIdProvider}>
                                            {item.nameProvider}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button type="button" className="btn btn-outline-success" onClick={handleEditComponent}>
                                    Записать
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EditPriceComponent;
