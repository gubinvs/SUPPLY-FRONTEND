import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiUrl from "../js/ApiUrl.js";
import "../ApplicationPanel/applicationPanel.css";
import "./viewSuppliersOffers.css";

const GroopSearchSuppliersOffers = () => {
    const [components, setComponents] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true); // начинаем загрузку
        fetch(ApiUrl + "/api/ReturnListDataComponent", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setComponents(data.component || []);
                setIsLoading(false); // завершение загрузки
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                setError("Ошибка загрузки данных: " + error.message);
                setIsLoading(false); // даже при ошибке убираем спиннер
            });
    }, []);

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

    const handleAnalyzeClick = () => {
        const selectedComponents = components.filter(item => selectedIds.has(item.id));
        const analyzeComponents = JSON.parse(localStorage.getItem("analyzeComponents") || "[]");
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

        const dataToAnalyze = {
            selectedComponents,
            analyzeComponents,
            cartItems
        };

        localStorage.setItem("analyzeData", JSON.stringify(dataToAnalyze));
        navigate("/AllOffersForSelected");
    };

    const filteredComponents = components.filter(item =>
        item.vendorCodeComponent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nameComponent?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    placeholder="Групповой поиск: можно вставить строки из Excel"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <button
                    className="btn btn-outline-secondary analyze-offers-button"
                    onClick={handleAnalyzeClick}
                    disabled={selectedIds.size === 0}
                >
                    Анализировать предложения
                </button>

                {error && <p className="error">{error}</p>}

                {isLoading ? (
                    <div className="custom-spinner-container">
                        <div className="custom-spinner"></div>
                    </div>
                ) : components.length > 0 ? (
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
                ) : (
                    !error && <p>Данных не найдено.</p>
                )}
            </div>
        </div>
    );
};

export default GroopSearchSuppliersOffers;
