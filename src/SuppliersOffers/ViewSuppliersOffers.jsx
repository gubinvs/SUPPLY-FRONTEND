import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ApplicationPanel/applicationPanel.css";
import "./viewSuppliersOffers.css";
import { handleAnalyzeClick } from "../js/Utilits/handleAnalyzeClick.js";


const ViewSuppliersOffers = (
    {components, error}
) => {

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1); 
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 15;
    const navigate = useNavigate();

    const handleCheckboxToggle = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Функция обработки клика на иконку редактировать компонент
    const handleEditClick = (vendorCode) => {
        localStorage.setItem("edit-article", vendorCode);
        navigate("/EditSupplyComponent");
    };

    // Начинаем выдавать данные для отображения на странице только после изменения (вводе данных в форму)
    const [filteredComponents, setFilteredComponents] = useState([]);
    useEffect(() => {
        const filtered = components.filter(item =>
            item.vendorCodeComponent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nameComponent?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredComponents(filtered);
    }, [searchTerm, components]);
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredComponents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="main-application-panel__container">
            <div className="view-suppliers-offers__block">

                <input
                    className="form-control view-suppliers-offers__search"
                    type="text"
                    placeholder="Одиночный поиск: артикул или наименование"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <button
                    className="btn btn-outline-secondary analyze-offers-button"
                    onClick={() => handleAnalyzeClick(components, selectedIds, navigate)}
                    disabled={selectedIds.size === 0}
                >
                    Анализировать предложения
                </button>


                {error && <p className="error">{error}</p>}

                {components.length > 0 ? (
                    <>
                        <table className="table">
                            <thead className="table-borderless__theder">
                                <tr>
                                    <th scope="col" className="table-borderless__check-coll"></th>
                                    <th scope="col" className="table-borderless__article">Артикул</th>
                                    <th scope="col" className="table-borderless__name">Наименование</th>
                                    <th scope="col" className="table-borderless__manuf">Производитель</th>
                                    <th scope="col" className="table-borderless__um">Ед. изм</th>
                                    <th scope="col" className="table-borderless__th-edit">Edit</th>
                                </tr>
                            </thead>
                            <tbody className="table-borderless__tbody">
                                {/* Заполнение таблицы */}
                                {currentItems.map((item) => (
                                    <tr key={item.id} className="ts-tbody__tr">
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
                ) : (
                    !error && <p>Данных не найдено.</p>
                )}
            </div>
        </div>
    );
};

export default ViewSuppliersOffers;
