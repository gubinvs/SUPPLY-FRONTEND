import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./addComponentApplication.css";
import ApiUrl from "../js/ApiUrl.js";
import { handleAnalyzeClick } from "../js/Utilits/handleAnalyzeClick.js";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import Select from 'react-select'; // установка в проект = npm install react-select

const ITEMS_PER_PAGE = 10;

const AddComponentApplication = (
    {role, title, components}
) => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [article, setArticle] = useState("");
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [deliveryTerm, setDeliveryTerm] = useState('');
    const [providerId, setProviderId] = useState('');
    const [providers, setProviders] = useState([]); // Данные о наименовании компаний поставщиков
    const [showEditPriceBlock, setShowEditPriceBlock] = useState(false);
    const [manufacturer, setManufacturer] = useState([]); // Данные о наименовании производителей
    const [unitMeasurement, setUnitMeasurement] = useState([]); // Данные о единицах измерения
    const [combinedOffers, setCombinedOffers] = useState([]); // для цен поставщиков
    const [selectedManufacturer, setSelectedManufacturer] = useState(''); // данные из выбранного списка про производителя
    const [selectedUnit, setSelectedUnit] = useState(''); // данные из выбранного списка по единицам измерения
    const navigate = useNavigate();

    // Преобразуй данные поставщиков в формат, понятный React Select
    const providerOptions = providers.map((item) => ({
                            value: item.guidIdProvider,
                            label: item.nameProvider,
                            }));

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

    const handleCheckboxToggle = async (id) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                setArticle('');
                setName('');
                setShowEditPriceBlock(false);
                setCombinedOffers([]); // очистка цен при снятии выбора
                setSelectedManufacturer('');
                setSelectedUnit('');
            } else {
                newSet.clear();
                newSet.add(id);

                const selectedItem = components.find((item) => item.id === id);
                if (selectedItem) {
                    setArticle(selectedItem.vendorCodeComponent);
                    setName(selectedItem.nameComponent);
                    setShowEditPriceBlock(true);
                    setSelectedManufacturer(selectedItem.manufacturerName);
                    setSelectedUnit(selectedItem.unitMeasurementName);
                
                    // Запрос цен поставщиков по выбранному артикулу
                    fetchPrices(selectedItem.vendorCodeComponent);
                }
            }
            return newSet;
        });
    };

    // Загрузка списка компаний поставщиков
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


    // Загрузка списка наименований производителей
    async function loadManufacturer() {
        try {
            const responseManufacturer = await fetch(ApiUrl + "/api/ReturnListManufacturer");
            const allManufacturer = await responseManufacturer.json();
            setManufacturer(allManufacturer.manufacturer);
        } catch (error) {
            console.error("Ошибка загрузки поставщиков:", error);
        }
    }

    useEffect(() => {
        loadManufacturer();
    }, []);


    // Загрузка списка единиц измерения
    async function loadUnitMeasurement() {
        try {
            const responseUnit = await fetch(ApiUrl + "/api/ReturnListUnitMeasurement");
            const allUnit = await responseUnit.json();
            setUnitMeasurement(allUnit.unitMeasurement);
        } catch (error) {
            console.error("Ошибка загрузки поставщиков:", error);
        }
    }

    useEffect(() => {
        loadUnitMeasurement();
    }, []);


    // Функция заполнения данных о новой номенклатуре
    const handleAddComponent = async () => {
        if (!article || !name) {
            alert('Заполните оба поля');
            return;
        }

        // Запрос на добавление номенклатуры
        const request = {
            vendorCodeComponent: article,
            nameComponent: name,
            guidIdManufacturer: selectedManufacturer,
            guidIdUnitMeasurement: selectedUnit
        };

        try {
            const response = await fetch(ApiUrl + '/api/AddComponent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (response.ok) {
                // const addedComponent = await response.json(); // если backend возвращает добавленный объект

                // Очистка старого состояния
                setSelectedIds(new Set());
                setPrice('');
                setDeliveryTerm('');
                setShowEditPriceBlock(false);

                // Установка нового артикула
                setSearchTerm(article);       // покажет в списке
                setName(name);                // оставим имя
                setArticle(article);          // артикул в input
                setShowEditPriceBlock(true);  // показать блок цен
                fetchPrices(article);         // загрузка предложений
            } else {
                const errorText = await response.text();
                alert(`Ошибка при добавлении: ${errorText}`);
            }
        } catch (error) {
            alert(`Ошибка соединения: ${error}`);
        }
    };


    // Функция записи новых цен
    const handleSavePrice = async () => {
        if (!article || !price || !providerId || !deliveryTerm) {
            alert("Заполните все поля для записи цены");
            return;
        }

        try {
            const response = await fetch(ApiUrl + '/api/ChangePrice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorCodeComponent: article,
                    guidIdProvider: providerId,
                    priceComponent: parseFloat(price),
                    deliveryTimeComponent: deliveryTerm,
                    
                })
            });

            if (response.ok) {
                // alert("Цена успешно записана!");
                setPrice('');
                setDeliveryTerm('');
                window.location.reload();
            } else {
                const errorText = await response.text();
                alert(`Ошибка при сохранении: ${errorText}`);
            }
        } catch (error) {
            alert(`Ошибка соединения: ${error}`);
        }
    };

    const fetchPrices = async (article) => {
        try {
            const response = await fetch(`${ApiUrl}/api/ReturnPriceProviderArticle/${article}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) throw new Error("Ошибка загрузки данных");

            const data = await response.json();

            // Сохраняем имя компонента
            setName(data.nameComponent);

            // Фильтруем предложения с ценой > 0 и сохраняем
            const filteredOffers = data.offers
                .filter(item => item.priceComponent > 0)
                .map(item => ({
                    nameProvider: item.nameProvider,
                    priceComponent: item.priceComponent,
                    deliveryTimeComponent: item.deliveryTimeComponent,
                    saveDataPrice: item.saveDataPrice
                }));

            setCombinedOffers(filteredOffers);

        } catch (error) {
            console.error("Ошибка загрузки цен поставщиков:", error);
            setCombinedOffers([]);
        }
    };


    // Заполним последнего выбранного поставщика
    useEffect(() => {
        loadProviders();
        const savedProviderId = localStorage.getItem("lastProviderId");
        if (savedProviderId) setProviderId(savedProviderId);
    }, []);



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
                                setSelectedIds(new Set()); // Сброс выбранного чекбокса
                                setArticle('');
                                setName('');
                                setShowEditPriceBlock(false);
                                setCombinedOffers([]); // 👈 Очистка предложений
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
                    <h6><b>{article === ""? "Артикул не найден — добавьте новый":"Артикул найден — внесите изменения"}</b></h6>
                    <div className="add-component-application__input-form">
                        <input
                            type="text"
                            className="form-control aca-input-form__article"
                            placeholder="Артикул"
                            value={article}
                            onChange={(e) => {
                                setArticle(e.target.value);
                                setSelectedManufacturer("");
                                setSelectedUnit("");
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                                setSelectedIds(new Set()); // Сброс выбранного чекбокса
                            }}
                        />
                        <input
                            type="text"
                            className="form-control aca-input-form__name"
                            placeholder="Наименование"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="aca-input-form__manufacturer-block">
                            <select
                                className="form-select aca-input-form__manufacturer"
                                value={selectedManufacturer}
                                onChange={(selectedOption) => {
                                                    if (selectedOption) {
                                                        setSelectedManufacturer(selectedOption.value);
                                                        localStorage.setItem("lastManufacturer", selectedOption.value);
                                                    } else {
                                                        setSelectedManufacturer(null);
                                                        localStorage.removeItem("lastManufacturer"); // или установи значение по умолчанию
                                                    }
                                                    }}
                                >
                                <option value={selectedManufacturer}>{selectedManufacturer !== ""? selectedManufacturer : "Производитель"}</option>
                                {manufacturer.map((item, index) => (
                                    <option key={index} value={item.guidIdManufacturer}>
                                        {item.nameManufacturer}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-select aca-input-form__unit"
                                value={selectedUnit}
                                onChange={(e) => {
                                    setSelectedUnit(e.target.value);
                                    localStorage.setItem("lastUnit", e.target.value);
                                }}
                            >
                                <option value={selectedUnit}>{selectedUnit !== "" ? selectedUnit :"Ед. изм."}</option>
                                {unitMeasurement.map((item, index) => (
                                    <option key={index} value={item.nameUnitMeasurement}>
                                        {item.nameUnitMeasurement}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            {/* // Преобразуй данные поставщиков в формат, понятный React Select */}
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                value={providerOptions.find(option => option.value === providerId) || null}
                                onChange={(selectedOption) => {
                                    setProviderId(selectedOption?.value || "");
                                    localStorage.setItem("lastProviderId", selectedOption?.value || "");
                                }}
                                options={providerOptions}
                                placeholder="Выбери поставщика"
                                isClearable
                                isSearchable
                            />

                            <button
                                type="button"
                                className="btn btn-outline-success mt-2 aca-input-form__edit-button"
                                onClick={handleSavePrice}
                            >
                                Записать
                            </button>
                        </>
                    )}

                    {/* Выводим имеющиеся предложения */}
                    <div className="offers-list">
                            {combinedOffers.length === 0 ? "" : (
                                <>
                                    <button
                                        className="btn btn-outline-secondary aca__analyze-offers-button"
                                        onClick={() => handleAnalyzeClick(components, selectedIds, navigate)}
                                        disabled={selectedIds.size === 0}
                                    >
                                        Анализировать предложения
                                    </button>
                                    {combinedOffers.map((offer, index) => (
                                        <div key={index} className="offer-item border rounded p-2 mb-2">
                                            <p><strong>Поставщик:</strong> {offer.nameProvider}</p>
                                            <p><strong>Цена:</strong> {offer.priceComponent > 0 ? `${offer.priceComponent} ₽` : '—'}</p>
                                            <p><strong>Срок поставки:</strong> {offer.deliveryTimeComponent}</p>
                                            <p><strong>Обновлено:</strong> {new Date(offer.saveDataPrice).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default AddComponentApplication;
