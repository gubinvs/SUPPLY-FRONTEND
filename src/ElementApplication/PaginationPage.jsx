import "./pagination.css";

const PaginationPage = ({ currentPage, setCurrentPage, totalPages }) => {
    if (totalPages <= 1) return null;

    const groupSize = 10;
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const handlePreviousGroup = () => {
        const prevGroupPage = Math.max(startPage - groupSize, 1);
        setCurrentPage(prevGroupPage);
    };

    const handleNextGroup = () => {
        const nextGroupPage = startPage + groupSize;
        if (nextGroupPage <= totalPages) {
            setCurrentPage(nextGroupPage);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap pagination-page-section">
            <div className="mb-2">
                {startPage > 1 && (
                    <button className="btn btn-sm btn-outline-secondary mx-1" onClick={handlePreviousGroup}>
                        « Назад
                    </button>
                )}

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const page = startPage + i;
                    return (
                        <button
                            key={page}
                            className={`btn btn-sm mx-1 ${currentPage === page ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    );
                })}

                {endPage < totalPages && (
                    <button className="btn btn-sm btn-outline-secondary mx-1" onClick={handleNextGroup}>
                        Вперёд »
                    </button>
                )}
            </div>

            <div className="text-muted small mx-2">
                Всего страниц: {totalPages}
            </div>
        </div>
    );
};

export default PaginationPage;

