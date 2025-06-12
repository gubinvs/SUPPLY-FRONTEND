
import { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./viewSuppliersOffers.css";

const ViewSuppliersOffers = () => {
    const [component, setComponent] = useState("");
    const [article, setArticle] = useState("");
    const [isSearched, setIsSearched] = useState(false);
    const [offers, setOffers] = useState([]); // 👈 добавлено состояние для истории цен

    useEffect(() => {
        fetch(ApiUrl + "/api/ReturnListProvider")
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка загрузки поставщиков");
                return response.json();
            })
            .then((data) => {
               
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


    return (
        <div className="view-suppliers-offers__container">
            <div className="input-group mb-3 view-suppliers-offers__search-block">
                {/* Строка поискового запроса предложений */}
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
                {/* 👇 Если нет предложений */}
                    {isSearched && !component ? (
                        <>
                            <h4 className="view-suppliers-offers__h4">Нет предложений по данному артикулу</h4>
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    {/* 👇 Таблица с данными о предложении поставщиков */}
                    {offers.length > 0 && (
                        <>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Компания поставщик</th>
                                        <th>Цена</th>
                                        <th>Срок поставки</th>
                                        <th>Актуальность</th>
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

export default ViewSuppliersOffers;