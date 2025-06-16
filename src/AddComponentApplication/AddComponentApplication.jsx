import { useState, useEffect } from "react";
import "./addComponentApplication.css";
import ApiUrl from "../js/ApiUrl.js";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import ReturnListDataComponent from "../js/RequestsApi/ReturnListDataComponent.js";

const ITEMS_PER_PAGE = 10;

const AddComponentApplication = ({ role, title }) => {
    const [components, setComponents] = useState([]);
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [article, setArticle] = useState("");
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [deliveryTerm, setDeliveryTerm] = useState('');
    const [providerId, setProviderId] = useState('');
    const [providers, setProviders] = useState([]);
    const [showEditPriceBlock, setShowEditPriceBlock] = useState(false);

    useEffect(() => {
        async function loadComponents() {
            const result = await ReturnListDataComponent();
            setComponents(result);
            console.log("Полученные компоненты:", result);
        }

        loadComponents();

        const savedProviderId = localStorage.getItem("lastProviderId");
        if (savedProviderId) {
            setProviderId(savedProviderId);
        }
    }, []);

    const filteredItems = components.filter(
        (item) =>
            item.vendorCodeComponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nameComponent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleCheckboxToggle = (id) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                setArticle('');
                setName('');
                setShowEditPriceBlock(false);
            } else {
                newSet.clear();
                newSet.add(id);

                const selectedItem = components.find((item) => item.id === id);
                if (selectedItem) {
                    setArticle(selectedItem.vendorCodeComponent);
                    setName(selectedItem.nameComponent);
                    setShowEditPriceBlock(true);
                }
            }
            return newSet;
        });
    };

    async function loadProviders() {
        try {
            const response = await fetch(ApiUrl + "/api/ReturnListProvider");
            const result = await response.json();
            setProviders(result.providers);
        } catch (error) {
            console.error("Ошибка загрузки поставщиков:", error);
        }
    }

    useEffect(() => {
        loadProviders();
    }, []);

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
                localStorage.setItem("newArticle", article);
                window.location.reload();
            } else {
                const errorText = await response.text();
                alert(`Ошибка при добавлении: ${errorText}`);
            }
        } catch (error) {
            alert(`Ошибка соединения: ${error}`);
        }
    };

    const handleSavePrice = async () => {
        if (!article || !price || !providerId || !deliveryTerm) {
            alert("Заполните все поля для записи цены");
            return;
        }

        try {
            const response = await fetch(ApiUrl + '/api/AddOrUpdatePriceForComponent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorCodeComponent: article,
                    price: parseFloat(price),
                    term: deliveryTerm,
                    guidIdProvider: providerId
                })
            });

            if (response.ok) {
                alert("Цена успешно записана!");
                setPrice('');
                setDeliveryTerm('');
            } else {
                const errorText = await response.text();
                alert(`Ошибка при сохранении: ${errorText}`);
            }
        } catch (error) {
            alert(`Ошибка соединения: ${error}`);
        }
    };

    return (
        <div className="main-application-panel">
            <NavigationBarMin
                onShowMax={handleShowMax}
                onHideMax={handleHideMax}
                isNavMaxVisible={isNavMaxVisible}
            />
            {isNavMaxVisible && <NavigationBarMax />}
            <HeaderApplicationPanel role={role} title={title} />
            <div className="main-application-panel__container">
                <div className="add-component-application__left-block">
                    <h6><b>Поиск артикула в базе данных:</b></h6>
                    <input
                        className="form-control aca-searh-form"
                        type="text"
                        placeholder="Поисковая строка"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                            setSelectedIds(new Set()); // Сброс всех чекбоксов
                            setArticle('');
                            setName('');
                            setShowEditPriceBlock(false);
                        }}
                    />

                    {searchTerm.trim() && filteredItems.length > 0 && (
                        <>
                            <table className="table">
                                <thead className="table-borderless__theder">
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Артикул</th>
                                        <th scope="col">Наименование</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={selectedIds.has(item.id)}
                                                    onChange={() => handleCheckboxToggle(item.id)}
                                                />
                                            </td>
                                            <td>{item.vendorCodeComponent}</td>
                                            <td>{item.nameComponent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-controls__block aca-pagination-controls__block">
                                <div className="pagination-controls">
                                    <button
                                        className="btn btn-outline-primary me-2"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        &#8592;
                                    </button>
                                    <span>Страница {currentPage} из {totalPages}</span>
                                    <button
                                        className="btn btn-outline-primary ms-2"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        &#8594;
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {searchTerm.trim() && filteredItems.length === 0 && (
                        <div className="mt-3 text-muted">Ничего не найдено по запросу.</div>
                    )}
                </div>

                <div className="add-component-application__right-block">
                    <h6><b>Артикул не найден — добавьте новый:</b></h6>
                    <div className="add-component-application__input-form">
                        <input
                            type="text"
                            className="form-control aca-input-form__article"
                            placeholder="Артикул"
                            value={article}
                            onChange={(e) => setArticle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control aca-input-form__name"
                            placeholder="Наименование"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {!showEditPriceBlock && (
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={handleAddComponent}
                            >
                                Добавить
                            </button>
                        )}
                    </div>

                    {showEditPriceBlock && (
                        <>
                            <input
                                className="form-control aca-input-form__new-price"
                                type="number"
                                placeholder="Новая цена"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <select
                                className="form-select aca-input-form__select"
                                value={deliveryTerm}
                                onChange={(e) => setDeliveryTerm(e.target.value)}
                            >
                                <option value="">Срок поставки</option>
                                <option value="В наличии">В наличии</option>
                                <option value="от 1 до 4 нед">от 1 до 4 нед</option>
                                <option value="от 4 до 8 нед">от 4 до 8 нед</option>
                                <option value="от 8 до 12 нед">от 8 до 12 нед</option>
                                <option value="от 12 до 16 нед">от 12 до 16 нед</option>
                                <option value="от 16 до 20 нед">от 16 до 20 нед</option>
                                <option value="от 20 до 24 нед">от 20 до 24 нед</option>
                            </select>
                            <select
                                className="form-select aca-input-form__select"
                                value={providerId}
                                onChange={(e) => {
                                    setProviderId(e.target.value);
                                    localStorage.setItem("lastProviderId", e.target.value);
                                }}
                            >
                                <option value="">Выбери поставщика</option>
                                {providers.map((item) => (
                                    <option key={item.guidIdProvider} value={item.guidIdProvider}>
                                        {item.nameProvider}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="btn btn-outline-success mt-2 aca-input-form__edit-button"
                                onClick={handleSavePrice}
                            >
                                Записать
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddComponentApplication;
