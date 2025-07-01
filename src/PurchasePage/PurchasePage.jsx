import { useState } from "react";
import "./purchasePage.css";
import NavigationBarMax from "../NavigationBar/NavigationBarMax";
import NavigationBarMin from "../NavigationBar/NavigationBarMin";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel";


// Страница с данными о закупках
const PurchasePage =(
    {role, title, components}
)=> {

    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    return(
        <>
            <div className="main-application-panel">
                <NavigationBarMin
                    onShowMax={handleShowMax}
                    onHideMax={handleHideMax}
                    isNavMaxVisible={isNavMaxVisible}
                />
                {isNavMaxVisible && <NavigationBarMax />}
                <HeaderApplicationPanel role={role} title={title} />
                <div className="main-application-panel__container">
                    <div className="purchase-page-left-block">d</div>
                    <div className="purchase-page-right-block">
                        <div className="purchase-page__create-purchase-block">
                            <h6 className="create-purchase-block__title">Создайте новую закупку:</h6>
                            <input className="form-control create-purchase-block__create-form-purchaseId" type="text" placeholder="Идентификатор закупки" aria-label="purchaseId"/>
                            <button type="button" className="btn btn-outline-secondary create-purchase-block__create-form-button">Создать</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default PurchasePage;