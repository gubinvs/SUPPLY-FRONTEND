import "./pagination.css";


// Блок пагинации страниц кнопками с номерами страниц
const PaginationPage = (
    {currentPage, setCurrentPage, rowsPerPage, getFilteredOffers}
) => {
    return(
        <>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    {Array.from({ length: Math.ceil(getFilteredOffers().length / rowsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                    ))}
                </div>
            </div> 
        </>
    );
};

export default PaginationPage;