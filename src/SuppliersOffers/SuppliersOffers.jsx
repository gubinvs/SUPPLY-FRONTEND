import {useEffect, useState} from "react";
import "./suppliersOffers.css";
import Spinners from "../ElementApplication/Spinners.jsx";
import ViewSuppliersOffers from "./ViewSuppliersOffers.jsx";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import GroopSearchSuppliersOffers from "./GroopSearchSuppliersOffers.jsx";

// Главный компонент раздела про предложения поставщиков
//  компонент выводит на экран строку поиска комплектующих по артикулу
//  и информацию по лучшему предложению по цене, срокам, по цене и срокам
//  Реализовать: 
//  - скрывать название компании поставщика, показывать только разрешенным пользователям.


const SuppliersOffers = (
    {role, title, components, loading, error}
) => {
    // Состояние страницы поиска по артикулам, групповое или одиночное. по умолчанию одиночное
    const [groupSearchArticle, setGroupSearchArticle] = useState(false);

  
    // Переключатель состояния боковой навигационной панели
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);
    
    // Переключатель состояния поисковой формы по одному или группой
    const editSearchState = () => {
        if (groupSearchArticle === false) {
            setGroupSearchArticle(true);
        } else {
            setGroupSearchArticle(false);
        }
    }


    return (
        <>
            {!loading?
                <div className="main-application-panel">
                    <NavigationBarMin
                        onShowMax={handleShowMax}
                        onHideMax={handleHideMax}
                        isNavMaxVisible={isNavMaxVisible}
                    />

                    {isNavMaxVisible && <NavigationBarMax />}
                    <HeaderApplicationPanel role={role} title={title} />
                    {/* Кнопка изменения состояния ввода данных */}
                    <button
                        className="btn btn-outline-secondary suppliers-offers__groop-search-button"
                        onClick={editSearchState}
                    >
                        {groupSearchArticle?"<- Одиночный поиск":"-> Групповой поиск"}
                    </button>
                    {!groupSearchArticle?
                        // Поисковая форма одиночного запроса
                        <ViewSuppliersOffers 
                            components={components}
                            error={error}
                        />
                        :
                        // Поисковая форма группового запроса
                        <GroopSearchSuppliersOffers 
                            components={components}
                            error={error}
                        />
                    }
                </div>
            :<Spinners/>}
        </>
    );
};

export default SuppliersOffers;