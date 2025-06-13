import React from "react";
import {useState} from "react";
import ViewSuppliersOffers from "./ViewSuppliersOffers.jsx";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

// Главный компонент раздела про предложения поставщиков
//  компонент выводит на экран строку поиска комплектующих по артикулу
//  и информацию по лучшему предложению по цене, срокам, по цене и срокам
//  Реализовать: 
//  - скрывать название компании поставщика, показывать только разрешенным пользователям.


const SuppliersOffers = ({role, title}) => {

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
            <ViewSuppliersOffers />
        </div>
            
        </>
    );

};

export default SuppliersOffers;