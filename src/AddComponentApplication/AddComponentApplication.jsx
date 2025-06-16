import React, { useState } from "react";
import "./addComponentApplication.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

const AddComponentApplication = ({role, title}) => {
    
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
            <div className="main-application-panel__container">
                <div className="main-application-panel__left-block">
             
                </div>
                <div className="main-application-panel__right-block">
          
                </div>
            </div>
                     
        </div>
    );
};

export default AddComponentApplication;