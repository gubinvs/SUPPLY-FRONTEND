import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ApplicationPanel/applicationPanel.css";
import "./viewSuppliersOffers.css";
import { handleAnalyzeClick } from "../js/Utilits/handleAnalyzeClick.js";
import NomenclatureTable from "../ElementApplication/NomenclatureTable.jsx";
import PaginationNext from "../ElementApplication/PaginationNext.jsx";
import PaginationPage from "../ElementApplication/PaginationPage.jsx";
import allOffersResponse from "../js/Utilits/allOffersResponse.js";

const ViewSuppliersOffers = (
    {components, error}
) => {

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1); 
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 14;
    const navigate = useNavigate();
    const [offers, setOffers] = useState('');

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



    useEffect(() => {
        const fetchData = async () => {
            const { bestOffers } = await allOffersResponse(components);
            //console.log(bestOffers["1SAM201901R1001"].deliveryTimeComponent);
            setOffers(bestOffers);
        };

        fetchData();
    }, [components]);
    
    
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
                        {/* Таблица выдачи данных о номенклатуре приложения */}
                        <NomenclatureTable 
                            currentItems={currentItems}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                            offers={offers}
                        />
                       
                        <div className="pagination-controls__block"> 
                          <PaginationPage 
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                            {/* <PaginationNext
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            /> */}
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
