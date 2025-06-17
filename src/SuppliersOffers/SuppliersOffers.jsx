import React from "react";
import {useState} from "react";
import "./suppliersOffers.css";
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


const SuppliersOffers = ({role, title}) => {
    // Состояние страницы поиска по артикулам, групповое или одиночное. по умолчанию одиночное
    const [groopSearchArticle, setGroopSearchArticle] = useState(false);

    const editSearchState = () => {
        if (groopSearchArticle == false) {
            setGroopSearchArticle(true);
        } else {
            setGroopSearchArticle(false);
        }

    }

    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);

    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    return (
        <>
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
                {groopSearchArticle?"-> Групповой поиск":"-> Одиночный поиск"}
            </button>
            {groopSearchArticle?
                <ViewSuppliersOffers />
                :
                <GroopSearchSuppliersOffers />
            }
        </div>
            
        </>
    );

};

export default SuppliersOffers;