import { useState, useEffect } from "react";
import "./addComponentApplication.css";
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

    useEffect(() => {
        async function loadComponents() {
            const result = await ReturnListDataComponent();
            setComponents(result);
            console.log("Полученные компоненты:", result);
        }

        loadComponents();
    }, []);

    // Отфильтрованные по строке поиска элементы
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
            } else {
                newSet.add(id);
            }
            return newSet;
        });
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
                <div className="add-component-application-block">
                    <h6>Можно проверить наличие в базе</h6>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Поисковая строка"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    {searchTerm.trim() && filteredItems.length > 0 && (
                        <>
                            <table className="table">
                                <thead className="table-borderless__theder">
                                    <tr>
                                        <th scope="col" className="table-borderless__check-coll"></th>
                                        <th scope="col" className="table-borderless__article">Артикул</th>
                                        <th scope="col" className="table-borderless__name">Наименование</th>
                                    </tr>
                                </thead>
                                <tbody className="table-borderless__tbody">
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
                            <div className="pagination-controls__block">
                                <div className="pagination-controls">
                                    <button
                                        className="btn btn-outline-primary me-2 pagination-controls__button"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        &#8592;
                                    </button>
                                    <span>Страница {currentPage} из {totalPages}</span>
                                    <button
                                        className="btn btn-outline-primary ms-2 pagination-controls__button"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        &#8594;
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Сообщение, если ничего не найдено */}
                    {searchTerm.trim() && filteredItems.length === 0 && (
                        <div className="mt-3 text-muted">Ничего не найдено по запросу.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddComponentApplication;
