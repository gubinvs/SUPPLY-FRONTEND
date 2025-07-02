import { useState } from "react";
import "./purchasePage.css";
import NavigationBarMax from "../NavigationBar/NavigationBarMax";
import NavigationBarMin from "../NavigationBar/NavigationBarMin";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel";
import CreatePurchaseBlock from "./CreatePurchaseBlock.jsx";
import ListPurchaseBlock from "./ListPurchaseBlock.jsx";


// Страница с данными о закупках
const PurchasePage =(
    {role, title, components}
)=> {

    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);
    const [createPurchase, setCreatePurchase] = useState(false);

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
                    <div className="purchase-page-left-block">
                        <ListPurchaseBlock 
                            createPurchase={createPurchase} 
                            setCreatePurchase={setCreatePurchase}
                        />
                    </div>
                    {createPurchase?
                        <div className="purchase-page-right-block">
                            <CreatePurchaseBlock
                                createPurchase={createPurchase} 
                                setCreatePurchase={setCreatePurchase}
                            />
                        </div>
                    :""}
                </div>
            </div>
        </>
    );

};

export default PurchasePage;