import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ApplicationPanel/applicationPanel.css";
import "./viewSuppliersOffers.css";

const GroopSearchSuppliersOffers = ({ components, error }) => {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [parsedInput, setParsedInput] = useState([]); // [{ vendorCode, quantity }]
    const [textareaValue, setTextareaValue] = useState("");
    const itemsPerPage = 15;
    const navigate = useNavigate();
    const normalizeCode = (code) => code?.trim().toLowerCase();

    const processInputList = (list) => {
        
        
        const parsed = list.map((line) => {
            const parts = line.trim().split(/\s*[\t|,;]\s*/);
            const vendorCode = normalizeCode(parts[0]);
            const quantity = parseFloat(parts[1]) || 1;
            return { vendorCode, quantity };
        }).filter(item => item.vendorCode);

        setParsedInput(parsed);
        setCurrentPage(1);

        const matchedIds = new Set(
            components
                .filter(item => parsed.some(p => p.vendorCode === normalizeCode(item.vendorCodeComponent)))
                .map(item => item.id)
        );
        setSelectedIds(matchedIds);
    };

    const handlePasteOrChange = (e) => {
        const value = e.target.value;
        setTextareaValue(value);
        const lines = value.split(/[\r\n]+/).filter(Boolean);
        processInputList(lines);
    };

    const handleAnalyzeClick = () => {
        const normalizeCode = (code) => code?.trim().toLowerCase();

        const selectedComponents = components
            .filter(item => selectedIds.has(item.id))
            .map(item => {
                const match = parsedInput.find(p => p.vendorCode === normalizeCode(item.vendorCodeComponent));
                return {
                    ...item,
                    quantity: match?.quantity || 1
                };
            });

        const analyzeComponents = JSON.parse(localStorage.getItem("analyzeComponents") || "[]");
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

        const dataToAnalyze = { selectedComponents, analyzeComponents, cartItems };
        localStorage.setItem("analyzeData", JSON.stringify(dataToAnalyze));
        navigate("/AllOffersForSelected");
    };

    const filteredComponents = components
        .filter(item => parsedInput.some(p => p.vendorCode === normalizeCode(item.vendorCodeComponent)))
        .map(item => {
            const match = parsedInput.find(p => p.vendorCode === normalizeCode(item.vendorCodeComponent));
            return { ...item, quantity: match?.quantity || 1 };
        });

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
                    placeholder="Вставьте данные из Excel: Артикул | Кол-во (опционально)"
                    value={textareaValue}
                    onChange={handlePasteOrChange}
                />

                <button
                    className="btn btn-outline-secondary analyze-offers-button"
                    onClick={handleAnalyzeClick}
                    disabled={selectedIds.size === 0}
                >
                    Анализировать предложения
                </button>

                {error && <p className="error">{error}</p>}

                {filteredComponents.length > 0 ? (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Артикул</th>
                                    <th>Наименование</th>
                                    <th>Кол-во</th>
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
                                        <td>{item.quantity}</td>
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
