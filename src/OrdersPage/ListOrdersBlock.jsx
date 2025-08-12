import React from "react";
import { useState, useEffect } from "react";
import "./listOrdersBlock.css";
import ApiUrl from "../js/ApiUrl";

const ListOrdersBlock = ({  role, ordersList }) => {
    const [checked, setChecked] = useState({});
    const [filterStatus, setFilterStatus] = useState("all");
    const [statusOrder, setStatusOrder] = useState([]);

    const handleToggle = (index) => {
        setChecked((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Когда меняется ordersList — инициализируем массив статусов
    useEffect(() => {
        setStatusOrder(ordersList.map(o => o.supplyOrderUserStatus || "Новый"));
    }, [ordersList]);

    // Фильтрация заказов по статусу
    const filteredOrders = ordersList.filter((order) => {
        if (filterStatus === "all") return true;
        return order.supplyOrderUserStatus?.toLowerCase().trim() === filterStatus.toLowerCase();
    });


    // Запись изменений о состоянии заказа
    const saveStatusOrder = (guidId, statusOrder) => {
        const reguesteditInvoce = {
            guidIdSupplyOrder : guidId,
            supplyOrderUserStatus : statusOrder
        };

        fetch(ApiUrl + "/api/EditInvoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reguesteditInvoce)
        })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            alert("Запрос успешно отправлен");
            return response.json();
        })
        .catch((error) => {
            console.error("Ошибка отправки данных:", error);
            alert("Ошибка отправки данных:");
        });

    };

   

    return (
        <div className="orders-block-section">
            {/* Фильтр по статусу */}
            <div className="filter-section" style={{ marginBottom: "1rem" }}>
                <label htmlFor="status-filter" style={{ marginRight: "10px" }}>
                    Фильтр по статусу заказа:
                </label>
                <select 
                    className="form-select"
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Все</option>
                    <option value="Новый">Новый</option>
                    <option value="В работе">В работе</option>
                    <option value="Отгружен">Отгружен</option>
                    <option value="Завершен">Завершен</option>
                </select>
            </div>

            <table className="table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Идентификатор</th>
                        <th scope="col">Наименование</th>
                        <th scope="col">Стоимость / кол-во</th>
                        <th scope="col">Заказчик</th>
                        <th scope="col">Статус заказа / срок</th>
                        {role === "Администратор системы"?<><th></th></>:""}
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={!!checked[index]}
                                        onChange={() => handleToggle(index)}
                                    />
                                </td>
                                <td>{item.purchaseId}</td>
                                <td>{item.purchaseName}</td>
                                <td>{item.purchasePrice}</td>
                                <td>{item.purchaseCostomer}</td>
                                {role === "Администратор системы"?
                                    <>
                                        <td>
                                            <select 
                                                className="form-select"
                                                id="edit-status-filter"
                                                value={statusOrder[index]}
                                                onChange={(e) => {
                                                    var updateStatus = [...statusOrder];
                                                        updateStatus[index] = e.target.value;
                                                        setStatusOrder(updateStatus)
                                                    }
                                                }
                                            >
                                                <option value="Новый">Новый</option>
                                                <option value="В работе">В работе</option>
                                                <option value="Отгружен">Отгружен</option>
                                                <option value="Завершен">Завершен</option>
                                            </select>
                                        </td>
                                        <td className="obs-table-td__icon-save">
                                            <img
                                                className="orders-block-section__icon-save"
                                                src="../images/save-icon.svg" 
                                                alt="@" 
                                                onClick={()=>saveStatusOrder(item.guidIdSupplyOrder, statusOrder[index])}
                                            />
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td>{item.supplyOrderUserStatus}</td>
                                    </>
                                }
                            </tr>
                            {checked[index] &&
                                item.orderComponent.map((comp, compIndex) => (
                                    <tr key={`${index}-${compIndex}`}>
                                        <td className="obs_td-component"></td>
                                        <td className="obs_td-component">{comp.vendorCodeComponent}</td>
                                        <td className="obs_td-component">{comp.nameComponent}</td>
                                        <td className="obs_td-component">{comp.quantityComponent}</td>
                                        <td className="obs_td-component">{comp.priceComponent}</td>
                                        <td className="obs_td-component">{comp.deliveryTimeComponent}</td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListOrdersBlock;
