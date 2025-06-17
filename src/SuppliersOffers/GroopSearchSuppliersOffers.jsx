import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // 📘 Импорт библиотеки XLSX
import ApiUrl from "../js/ApiUrl.js";
import "../ApplicationPanel/applicationPanel.css";
import "./viewSuppliersOffers.css";

const GroopSearchSuppliersOffers = () => {
    const [components, setComponents] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchList, setSearchList] = useState([]);
    const [textareaValue, setTextareaValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        fetch(ApiUrl + "/api/ReturnListDataComponent", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setComponents(data.component || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                setError("Ошибка загрузки данных: " + error.message);
                setIsLoading(false);
            });
    }, []);

    const processSearchList = (list) => {
        const cleaned = list.map(v => v.trim().toLowerCase()).filter(Boolean);
        setSearchList(cleaned);
        setCurrentPage(1);
        const matchedIds = new Set(
            components
                .filter(item => cleaned.includes(item.vendorCodeComponent?.toLowerCase()))
                .map(item => item.id)
        );
        setSelectedIds(matchedIds);
    };

    const handlePasteOrChange = (e) => {
        const value = e.target.value;
        setTextareaValue(value);
        const parsed = value.split(/[\n\r\t;,]+/).map(v => v.trim().toLowerCase()).filter(Boolean);
        processSearchList(parsed);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            const flatValues = rows.flat().map(String);
            processSearchList(flatValues);
            setTextareaValue(flatValues.join("\n")); // для наглядности заполним textarea
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAnalyzeClick = () => {
        const selectedComponents = components.filter(item => selectedIds.has(item.id));
        const analyzeComponents = JSON.parse(localStorage.getItem("analyzeComponents") || "[]");
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

        const dataToAnalyze = { selectedComponents, analyzeComponents, cartItems };
        localStorage.setItem("analyzeData", JSON.stringify(dataToAnalyze));
        navigate("/AllOffersForSelected");
    };

    const filteredComponents = components.filter(item =>
        searchList.includes(item.vendorCodeComponent?.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredComponents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);

    return (
        <div className="main-application-panel__container">
            <div className="view-suppliers-offers__block">

                <textarea
                    className="form-control mb-3 view-suppliers-offers__search"
                    rows={6}
                    placeholder="Вставьте артикулы из Excel"
                    value={textareaValue}
                    onChange={handlePasteOrChange}
                    // style={{ height: "150px", resize: "none" }} // ← фиксируем высоту и отключаем растягивание
                />

                {/* <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="form-control mb-3"
                /> */}

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
                ) : filteredComponents.length > 0 ? (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Артикул</th>
                                    <th>Наименование</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(item.id)}
                                                onChange={() => {
                                                    setSelectedIds((prev) => {
                                                        const newSet = new Set(prev);
                                                        newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td>{item.vendorCodeComponent}</td>
                                        <td>{item.nameComponent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &#8592;
                            </button>
                            <span>Страница {currentPage} из {totalPages}</span>
                            <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &#8594;
                            </button>
                        </div>
                    </>
                ) : (
                    !error && <p>Точных совпадений не найдено.</p>
                )}
            </div>
        </div>
    );
};

export default GroopSearchSuppliersOffers;
