import { useState, useEffect } from "react";
import "./editSupplyComponent.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

const EditSupplyComponent = ({ role, components, title, error }) => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    // Поиск и редактирование
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredComponents, setFilteredComponents] = useState(components);
    const [selectedComponent, setSelectedComponent] = useState(null);

    // Пагинация (если нужна)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const currentItems = filteredComponents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Автозагрузка артикула из localStorage
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
                <div className="edit-supply-component__left-block">
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.vendorCodeComponent}>
                                            <td>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={selectedComponent?.vendorCodeComponent === item.vendorCodeComponent}
                                                    onChange={() => setSelectedComponent(item)}
                                                />
                                            </td>
                                            <td>{item.vendorCodeComponent}</td>
                                            <td>{item.nameComponent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        !error && <p>Данных не найдено.</p>
                    )}
                </div>
                {/* Блок редактирования */}
                <div className="edit-supply-component__right-block">
                        <h5 className="edit-supply-component__title">Данные для редактирования:</h5>
                        <div className="edit-supply-component__title_fon"></div>
                        {selectedComponent && (
                            <div>
                                <label className="edit-supply-component__label" htmlFor="Артикул">Артикул:</label>
                                <input
                                    type="text"
                                    className="form-control mb-2 dit-supply-component__edit-input"
                                    value={selectedComponent.vendorCodeComponent}
                                    readOnly
                                />
                                <label className="edit-supply-component__label"  htmlFor="Наименование">Наименование:</label>
                                <textarea
                                    type="text"
                                    className="form-control mb-2 dit-supply-component__edit-textarea"
                                    value={selectedComponent.nameComponent}
                                    readOnly
                                />
                                <button type="button" class="btn btn-outline-secondary dit-supply-component__save-botton">Записать</button>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default EditSupplyComponent;
