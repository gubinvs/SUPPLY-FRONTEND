// EditSupplyComponent.jsx
import { useState, useEffect } from "react";
import Select from "react-select";
import "./editSupplyComponent.css";
import { handleEditClick } from "../js/Utilits/nandleEditClick.js";
import { handleSaveComponent } from "../js/Utilits/handleSaveComponent.js";
import { handleDeleteComponent } from "../js/Utilits/handleDeleteComponent.js";
import { loadUnitMeasurement } from "../js/Utilits/loadUnitMeasurement.js";
import { loadManufacturer } from "../js/Utilits/loadManufacturer.js";
import { onSearchChange } from "../js/Utilits/onSearchChange.js";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

const EditSupplyComponent = (
    { role, components, title, error }
) => {
    
    // Артикул который меняли
    const hscChech = localStorage.getItem("handleSaveComponent");

    // Сочетание символов который вводили в поисковую форму, чтобы выдать окно как было
    const hsc = localStorage.getItem("searchQuery");

    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);
    // Предупреждение при смене компонента и не сохранении измененых данных
    const [isDirty, setIsDirty] = useState(false);
    
    const [vendorCode, setVendorCode] = useState("");
    const [name, setName] = useState("");
    const [manufacturer, setManufacturer] = useState([]);
    const [unitMeasurement, setUnitMeasurement] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredComponents, setFilteredComponents] = useState(components);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 100;
    
    const currentItems = filteredComponents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Отслеживание изменения данных
    useEffect(() => {
        if (selectedComponent) {
            const isChanged =
                name !== selectedComponent.nameComponent ||
                selectedManufacturer !== selectedComponent.manufacturerName ||
                selectedUnit !== selectedComponent.unitMeasurementName;

            setIsDirty(isChanged);
        }
    }, [name, selectedManufacturer, selectedUnit, selectedComponent]);


    useEffect(() => {
        const article = hsc || localStorage.getItem("edit-article");

        if (article) {
            setSearchQuery(article);

            const filtered = components.filter(c =>
                c.vendorCodeComponent?.toLowerCase().includes(article.toLowerCase()) ||
                c.nameComponent?.toLowerCase().includes(article.toLowerCase())
            );

            setFilteredComponents(filtered);

            // Явно выбрать по точному совпадению артикула
            const exactMatch = filtered.find(c =>
                c.vendorCodeComponent?.toLowerCase() === hscChech.toLowerCase()
            );

            if (exactMatch) {
                setSelectedComponent(exactMatch);
            } else if (filtered.length === 1) {
                setSelectedComponent(filtered[0]);
            }

        } else {
            setFilteredComponents(components);
        }
    }, [components, hsc, hscChech]);

    useEffect(() => {
        loadUnitMeasurement(setUnitMeasurement);
        loadManufacturer(setManufacturer);
    }, []);

    useEffect(() => {
        if (selectedComponent) {
            setVendorCode(selectedComponent.vendorCodeComponent);
            setName(selectedComponent.nameComponent);

            // Производитель
            if (selectedComponent.manufacturerName) {
                setSelectedManufacturer(selectedComponent.manufacturerName);
            } else {
                const lastManufacturer = localStorage.getItem("lastManufacturer");
                setSelectedManufacturer(lastManufacturer || '');
            }

            // Единица измерения
            if (selectedComponent.unitMeasurementName) {
                setSelectedUnit(selectedComponent.unitMeasurementName);
            } else {
                const lastUnit = localStorage.getItem("lastUnit");
                setSelectedUnit(lastUnit || '');
            }
        }
    }, [selectedComponent]);


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
                <div className={selectedComponent === null ? "edit-supply-component__content-block" : "edit-supply-component__left-block"}>
                    <input
                        className="form-control edit-supply-component__search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e, components, setSearchQuery, setFilteredComponents, setCurrentPage)}
                        placeholder="Артикул или наименование"
                    />

                    {filteredComponents.length > 0 ? (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Артикул</th>
                                        <th>Наименование</th>
                                        <th scope="col" className="table-borderless__manuf">Производитель</th>
                                        <th scope="col" className="table-borderless__um">Ед. изм</th>
                                        <th className="table-borderless__th-edit">Edit</th>
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
                                                    onChange={() => {
                                                            const isSame = selectedComponent?.vendorCodeComponent === item.vendorCodeComponent;

                                                            if (!isSame && isDirty) {
                                                                const confirmSwitch = window.confirm("Вы не сохранили изменения. Перейти без сохранения?");
                                                                if (!confirmSwitch) return;
                                                            }

                                                            if (isSame) {
                                                                setSelectedComponent(null);
                                                                setSearchQuery('');
                                                                setFilteredComponents(components);
                                                            } else {
                                                                setSelectedComponent(item);
                                                            }
                                                        }}
                                                />
                                            </td>
                                            <td>{item.vendorCodeComponent}</td>
                                            <td>{item.nameComponent}</td>
                                            <td>{item.manufacturerName}</td>
                                            <td className="table-borderless__um">{item.unitMeasurementName}</td>
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

                <div className={selectedComponent === null ? "" : "edit-supply-component__right-block"}>
                    {selectedComponent && (
                        <>
                            <button 
                                type="button" 
                                className="btn btn-outline-danger dit-supply-component__clear-botton"
                                onClick={() => handleDeleteComponent(selectedComponent, selectedComponent.vendorCodeComponent, setSelectedComponent)}
                            >
                                Удалить номенклатуру
                            </button>
                            <h5 className="edit-supply-component__title">Данные для редактирования:</h5>
                            <div className="edit-supply-component__title_fon"></div>
                            <div>
                                <label className="edit-supply-component__label" htmlFor="Артикул">Артикул:</label>
                                <input
                                    type="text"
                                    className="form-control mb-2 dit-supply-component__edit-input"
                                    value={vendorCode}
                                    readOnly
                                />
                                <label className="edit-supply-component__label" htmlFor="Наименование">Наименование:</label>
                                <textarea
                                    className="form-control mb-2 dit-supply-component__edit-textarea"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="aca-input-form__manufacturer-block">
                                <Select
                                    className="aca-input-form__manufacturer"
                                    options={manufacturer.map((item) => ({
                                        value: item.nameManufacturer,
                                        label: item.nameManufacturer
                                    }))}
                                    value={selectedManufacturer ? { value: selectedManufacturer, label: selectedManufacturer } : null}
                                    onChange={(selectedOption) => {
                                                if (selectedOption) {
                                                    setSelectedManufacturer(selectedOption.value);
                                                    localStorage.setItem("lastManufacturer", selectedOption.value);
                                                } else {
                                                    setSelectedManufacturer(null);
                                                    localStorage.removeItem("lastManufacturer"); // или установи значение по умолчанию
                                                }
                                                }}
                                    placeholder="Выберите производителя..."
                                    isClearable
                                    isSearchable
                                />
                                <select
                                    className="form-select aca-input-form__unit"
                                    value={selectedUnit}
                                    onChange={(e) => {
                                        setSelectedUnit(e.target.value);
                                        localStorage.setItem("lastUnit", e.target.value);
                                    }}
                                >
                                    <option value={selectedUnit}>{selectedUnit != null ? selectedUnit:"Ед. изм."}</option>
                                    {unitMeasurement.map((item, index) => (
                                        <option key={index} value={item.nameUnitMeasurement}>
                                            {item.nameUnitMeasurement}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary dit-supply-component__save-botton"
                                    onClick={() => {
                                            handleSaveComponent(vendorCode, name, selectedManufacturer, selectedUnit, manufacturer, unitMeasurement);
                                            setIsDirty(false);
                                        }}
                                >
                                    Сохранить изменения
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditSupplyComponent;