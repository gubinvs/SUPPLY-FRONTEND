import "./ordersPage.css";
import { useState } from "react";
import Spinners from "../ElementApplication/Spinners.jsx";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";


const OrdersPage =(
    {role, title, loading}
)=> {
        // Переключатель состояния боковой навигационной панели
        const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
        const handleShowMax = () => setIsNavMaxVisible(true);
        const handleHideMax = () => setIsNavMaxVisible(false);

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
         
                    </div>
                    :<Spinners/>
                }
            </>

        );

};

export default OrdersPage;