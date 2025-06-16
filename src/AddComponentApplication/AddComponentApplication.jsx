import { useState, useEffect } from "react";
import "./addComponentApplication.css";
import ApiUrl from "../js/ApiUrl.js";
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
    // const [selectedIds, setSelectedIds] = useState(new Set());
    const [article, setArticle] = useState("");
    const [name, setName] = useState('');

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

    // const handleCheckboxToggle = (id) => {
    //     setSelectedIds((prev) => {
    //         const newSet = new Set(prev);
    //         if (newSet.has(id)) {
    //             newSet.delete(id);
    //         } else {
    //             newSet.add(id);
    //         }
    //         return newSet;
    //     });
    // };

    const handleAddComponent = async () => {
        if (!article || !name) {
            alert('Заполните оба поля');
            return;
        }

        try {
            const response = await fetch(ApiUrl + '/api/AddComponent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vendorCodeComponent: article, nameComponent: name })
            });

            if (response.ok) {
                alert('Компонент успешно добавлен!');
                sessionStorage.setItem('lastAddedArticle', article);
                localStorage.setItem("newArticle", article)
                window.location.reload();
            } else {
                const errorText = await response.text();
                alert(`Ошибка при добавлении: ${errorText}`);
            }
        } catch (error) {
            alert(`Ошибка соединения: ${error}`);
        }
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
                <div className="add-component-application__left-block">
                    <h6><b>Можно проверить наличие в базе данных:</b></h6>
                    <input
                        className="form-control aca-searh-form"
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
                                        <th scope="col" className="table-borderless__article">Артикул</th>
                                        <th scope="col" className="table-borderless__name">Наименование</th>
                                    </tr>
                                </thead>
                                <tbody className="table-borderless__tbody">
                                    {currentItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.vendorCodeComponent}</td>
                                            <td>{item.nameComponent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-controls__block aca-pagination-controls__block">
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
                <div className="add-component-application__right-block">
                    <h6><b>Не нашли, добавьте в базу данных:</b></h6>
                        <div className="add-component-application__input-form">
                        <input
                            type="text"
                            className="form-control aca-input-form__article"
                            placeholder="Артикул"
                            value={article}
                            onChange={(e) => setArticle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control aca-input-form__name"
                            placeholder="Наименование"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary aca-input-form__add-button" type="button" onClick={handleAddComponent}>
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddComponentApplication;
