import "./pagination.css";


// Блок пагинации страниц кнопками вперед назад

const PaginationNext = (
    {currentPage, setCurrentPage, totalPages}
) => {

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    
    return (
        <>
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
        </>
    );
};

export default PaginationNext;