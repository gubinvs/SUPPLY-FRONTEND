import { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./viewSuppliersOffers.css";

// выводит полный список предложений поставщиков
const ViewSuppliersOffers = () => {
    const [components, setComponents] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40; // количество строк на странице

    useEffect(() => {
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
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                setError("Ошибка загрузки данных: " + error.message);
            });
    }, []);

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = components.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(components.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="view-suppliers-offers__container">
            {error && <p className="error">{error}</p>}

            {components.length > 0 ? (
                <>
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
                    <table className="table-borderless">
                        <thead className="table-borderless__theder">
                            <tr>
                                <th scope="col" className="table-borderless__check-coll"></th>
                                <th scope="col" className="table-borderless__article">Артикул</th>
                                <th scope="col" className="table-borderless__name">Наименование</th>
                            </tr>
                        </thead>
                        <tbody className="table-borderless__tbody">
                            {currentItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <input class="form-check-input" type="checkbox" value="" id="" />
                                    </td>
                                    <td>{item.vendorCodeComponent}</td>
                                    <td>{item.nameComponent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                !error && <p>Загрузка данных...</p>
            )}
        </div>
    );
};

export default ViewSuppliersOffers;
