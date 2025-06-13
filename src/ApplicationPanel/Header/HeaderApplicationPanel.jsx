
import "./headerApplicationPanel.css";
import clearRoleId from "../../js/clearRoleId.js";

const HeaderApplicationPanel = ({role, title}) => {

    return (
        <>
        <div className="header-application__container">
           <div className="header-application__top-block">
                <h6 className="ha-top-block__role-discr">Роль в системе: {role}</h6>
                <button
                    type="button"
                    className="btn btn-outline-warning ha-top-block__botton"
                    onClick={clearRoleId}
                >
                    Выход
                </button>
            </div>
            <div className="header-application__title">{title}</div>
            <div className="header-application__title__line"></div>
        </div>
 
        </>
    );
};

export default HeaderApplicationPanel;
