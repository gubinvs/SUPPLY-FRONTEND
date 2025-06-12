
import "./headerApplicationPanel.css";
import clearRoleId from "../../js/clearRoleId.js";

const HeaderApplicationPanel = ({role, title}) => {

    return (
        <>
        <div className="header-application-panel__container">
           <div className="application-panel__header">
                <h6 className="application-panel-header__role-discr">Роль в системе: {role}</h6>
                <button
                    type="button"
                    className="btn btn-outline-warning application-panel-header__botton"
                    onClick={clearRoleId}
                >
                    Выход
                </button>
            </div>
            <div className="application-panel-header__title">{title}</div>
            <div className="application-panel-header__line"></div>
        </div>
 
        </>
    );
};

export default HeaderApplicationPanel;
