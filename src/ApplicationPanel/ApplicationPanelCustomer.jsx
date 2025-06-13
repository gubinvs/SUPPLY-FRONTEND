import React, { useState } from "react";
import "./applicationPanel.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "./Header/HeaderApplicationPanel.jsx";
import InformationPanel from "./InformationPanel/InformationPanel.jsx"

const ApplicationPanelCustomer = ({role, title}) => {
    
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);

    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    return (
        <div className="main-application-panel">
            <NavigationBarMin
                onShowMax={handleShowMax}
                onHideMax={handleHideMax}
                isNavMaxVisible={isNavMaxVisible}
            />

            {isNavMaxVisible && <NavigationBarMax />}

            <HeaderApplicationPanel role={role} title={title} />
            <InformationPanel />           
        </div>
    );
};

export default ApplicationPanelCustomer;
