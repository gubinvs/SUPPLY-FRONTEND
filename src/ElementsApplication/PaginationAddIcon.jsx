import React from "react";
import "./paginationAddIcon.css";



const PaginationAddIcon = ({
    addState,
    currentIndex,
    goToIndex,
    company,
    addNewCompany,
    clearAddNewCompany
}) => {


    return (
        // <>
        //     {company.map((_, index) => (
        //         <div key={index} className="pagination-icon-block__icon" onClick={() => goToIndex(index)} style={{backgroundColor: index === currentIndex ? "#ffc107" : "#e0e0e0",}}> {index + 1}</div>
        //     ))}
        //     {/* Кнопка для отображения формы заполнения информации о новой компании, либо (+) либо (-) */}
        //     {addState?
        //         <div className="pagination-icon-block__icon pagination-icon-block__add-icon" onClick={clearAddNewCompany}>-</div>
        //         :
        //         <div className="pagination-icon-block__icon pagination-icon-block__add-icon" onClick={addNewCompany}>+</div>
        //     }
        // </>
        <h1>Я кнопка</h1>
    );

};

export default PaginationAddIcon;
