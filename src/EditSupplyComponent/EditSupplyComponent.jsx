import { useState, useEffect } from "react";
import "./editSupplyComponent.css";
import ApiUrl from "../js/ApiUrl.js";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

const EditSupplyComponent = ({ role, components, title, error }) => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    const [vendorCode, setVendorCode] = useState("");
    const [name, setName] = useState("");
    const [manufacturer, setManufacturer] = useState([]); // Данные о наименовании производителей
    const [unitMeasurement, setUnitMeasurement] = useState([]); // Данные о единицах измерения
    const [selectedManufacturer, setSelectedManufacturer] = useState(''); // данные из выбранного списка про производителя
    const [selectedUnit, setSelectedUnit] = useState(''); // данные из выбранного списка по единицам измерения
  
    
    // Поиск и редактирование
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredComponents, setFilteredComponents] = useState(components);
    const [selectedComponent, setSelectedComponent] = useState(null);

    // Пагинация (если нужна)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const currentItems = filteredComponents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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


    useEffect(() => {
        if (selectedComponent) {
            setVendorCode(selectedComponent.vendorCodeComponent);
            setName(selectedComponent.nameComponent);
        }
    }, [selectedComponent]);

    // Удаление номенклатуры
    const handleDeleteComponent = async () => {
        if (!selectedComponent) return;

        const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот компонент?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(ApiUrl+`/api/AddComponent/${selectedComponent.vendorCodeComponent}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Компонент успешно удалён.");
                setSelectedComponent(null);
                // Можно либо обновить components вручную, либо перезагрузить:
                window.location.reload();
            } else {
                const err = await response.json();
                alert("Ошибка при удалении: " + (err.message || response.status));
            }
        } catch (error) {
            alert("Сетевая ошибка: " + error.message);
        }
    };

    // подгружается информация по редактируемой номенклатуре
    useEffect(() => {
        const article = localStorage.getItem("edit-article");
        if (article) {
            setSearchQuery(article);
            const filtered = components.filter(c =>
                c.vendorCodeComponent?.toLowerCase().includes(article.toLowerCase()) ||
                c.nameComponent?.toLowerCase().includes(article.toLowerCase())
            );
            setFilteredComponents(filtered);

            if (filtered.length === 1) {
                setSelectedComponent(filtered[0]);
                
            }
        } else {
            setFilteredComponents(components);
        }
    }, [components]);





    // Отправляем данные на сервер
    const handleSaveComponent = async () => {
        try {
            const response = await fetch(ApiUrl+"/api/AddComponent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendorCodeComponent: vendorCode,
                    nameComponent: name,
                }),
            });

            if (response.ok) {
                alert("Компонент успешно записан.");
                window.location.reload();
            } else {
                const err = await response.json();
                alert("Ошибка при сохранении: " + (err.message || response.status));
            }
        } catch (error) {
            alert("Сетевая ошибка: " + error.message);
        }
    };

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filtered = components.filter(c =>
            c.vendorCodeComponent?.toLowerCase().includes(value.toLowerCase()) ||
            c.nameComponent?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredComponents(filtered);
        setCurrentPage(1);
    };
    // Функция обработки клика на иконку редактировать компонент
    const handleEditClick = (vendorCode) => {
        localStorage.setItem("edit-article", vendorCode);
        window.location.reload();
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
                <div className={selectedComponent === null?"edit-supply-component__content-block":"edit-supply-component__left-block"}>
                    <input
                        className="form-control edit-supply-component__search"
                        type="text"
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Артикул или наименование"
                    />

                    {filteredComponents.length > 0 ? (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className=""></th>
                                        <th scope="col" className="">Артикул</th>
                                        <th scope="col" className="">Наименование</th>
                                        <th scope="col" className="table-borderless__th-edit">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.vendorCodeComponent} className="ts-tbody__tr">
                                            <td>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={selectedComponent?.vendorCodeComponent === item.vendorCodeComponent}
                                                    // На проверку: если уже выбран этот компонент — снимаем выделение (setSelectedComponent(null)), иначе выбираем:
                                                    onChange={() => {
                                                        if (selectedComponent?.vendorCodeComponent === item.vendorCodeComponent) {
                                                            // Снимаем выбор и очищаем поиск
                                                            setSelectedComponent(null);
                                                            setSearchQuery('');
                                                            setFilteredComponents(components); // сброс фильтра
                                                        } else {
                                                            // Выбираем новый компонент
                                                            setSelectedComponent(item);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>{item.vendorCodeComponent}</td>
                                            <td>{item.nameComponent}</td>
                                            <td className="table-borderless__edit">
                                                <img
                                                    className="table-borderless__icon-edit"
                                                    src="../images/file-pen-line__table.svg"
                                                    alt="Редактировать"
                                                    onClick={() => handleEditClick(item.vendorCodeComponent)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* // Пагинация страниц */}
                            <div className="pagination">
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    &#8592;
                                </button>
                                <span>Страница {currentPage} из {Math.ceil(filteredComponents.length / itemsPerPage)}</span>
                                <button
                                    className="btn btn-sm btn-outline-primary ms-2"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredComponents.length / itemsPerPage)))}
                                    disabled={currentPage === Math.ceil(filteredComponents.length / itemsPerPage)}
                                >
                                     &#8594;
                                </button>
                            </div>
                        </>
                    ) : (
                        !error && <p>Данных не найдено.</p>
                    )}
                </div>
                {/* Блок редактирования */}
                <div className={selectedComponent === null?"":"edit-supply-component__right-block"}>
                    {selectedComponent === null?
                    "":
                        <>
                            <button 
                                type="button" 
                                class="btn btn-outline-danger dit-supply-component__clear-botton"
                                onClick={handleDeleteComponent}
                            >
                                Удалить номенклатуру
                            </button>
                            <h5 className="edit-supply-component__title">Данные для редактирования:</h5>
                            <div className="edit-supply-component__title_fon"></div>
                        </>
                    }
                        {selectedComponent && (
                            <div>
                                <label className="edit-supply-component__label" htmlFor="Артикул">Артикул:</label>
                               <input
                                    type="text"
                                    className="form-control mb-2 dit-supply-component__edit-input"
                                    value={vendorCode}
                                    // onChange={(e) => setVendorCode(e.target.value)}
                                    readOnly
                                />
                                <label className="edit-supply-component__label"  htmlFor="Наименование">Наименование:</label>
                                <textarea
                                    className="form-control mb-2 dit-supply-component__edit-textarea"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="aca-input-form__manufacturer-block">
                                    <select
                                        className="form-select aca-input-form__manufacturer"
                                        value={selectedManufacturer}
                                        onChange={(e) => {
                                            setSelectedManufacturer(e.target.value);
                                            localStorage.setItem("lastManufacturer", e.target.value);
                                        }}
                                    >
                                        <option value="">Производитель</option>
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
                                        <option value="">Ед. изм.</option>
                                        {unitMeasurement.map((item, index) => (
                                            <option key={index} value={item.guidIdUnitMeasurement}>
                                                {item.nameUnitMeasurement}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    type="button" 
                                    class="btn btn-outline-secondary dit-supply-component__save-botton"
                                    onClick={handleSaveComponent}
                                >
                                    Сохранить изменения
                                </button>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default EditSupplyComponent;
