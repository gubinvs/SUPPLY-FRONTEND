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
    const [offers, setOffers] = useState([]); // 👈 добавлено состояние для истории цен

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

        setIsSearched(true);

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

                // 👇 параллельно загружаем историю предложений
                fetch(`${ApiUrl}/api/ReturnPriceProviderArticle/${encodeURIComponent(article)}`)
                    .then(res => res.ok ? res.json() : Promise.reject("Ошибка истории предложений"))
                    .then(data => {
                        setOffers(data.offers || []);
                    })
                    .catch(error => {
                        console.error("Ошибка загрузки истории цен:", error);
                        setOffers([]);
                    });
            })
            .catch((error) => {
                console.error("Ошибка при получении компонента:", error);
                setComponent(null);
                setOffers([]);
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
            headers: { "Content-Type": "application/json" },
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vendorCodeComponent: article, nameComponent: name })
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
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Наименование"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary" type="button" onClick={handleAddComponent}>
                                    Добавить в базу
                                </button>
                            </div>
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Артикул</th>
                                <th>Наименование</th>
                                <th>Цена</th>
                                <th>Срок поставки</th>
                                <th>Поставщик</th>
                                <th></th>
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
                                    <select
                                        className="form-select"
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                    >
                                        <option value="">Cрок поставки</option>
                                        <option value="В наличии">В наличии</option>
                                        <option value="от 1 до 4 нед">от 1 до 4 нед</option>
                                        <option value="от 4 до 8 нед">от 4 до 8 нед</option>
                                        <option value="от 8 до 12 нед">от 8 до 12 нед</option>
                                        <option value="от 12 до 16 нед">от 12 до 16 нед</option>
                                        <option value="от 16 до 20 нед">от 6 до 20 нед</option>
                                        <option value="от 20 до 24 нед">от 20 до 24 нед</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className="form-select"
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

                    {/* 👇 ВТОРАЯ ТАБЛИЦА — история предложений */}
                    {offers.length > 0 && (
                        <>
                            <h5 className="mt-4">Предложения по этому артикулу:</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Поставщик</th>
                                        <th>Цена</th>
                                        <th>Срок поставки</th>
                                        <th>Дата сохранения</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer, index) => (
                                        <tr key={index}>
                                            <td>{offer.nameProvider}</td>
                                            <td>{offer.priceComponent.toLocaleString('ru-RU')} ₽</td>
                                            <td>{offer.deliveryTimeComponent}</td>
                                            <td>{new Date(offer.saveDataPrice).toLocaleDateString('ru-RU')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default EditPriceComponent;
