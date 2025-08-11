import React from "react";
import { useState } from "react";
import "./listOrdersBlock.css";
import { roleMap } from "../js/roleMap";

const ListOrdersBlock = ({ ordersList }) => {
    const [checked, setChecked] = useState({});
    const [filterStatus, setFilterStatus] = useState("all");

    const handleToggle = (index) => {
        setChecked((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };


    // Фильтрация заказов по статусу
    const filteredOrders = ordersList.filter((order) => {
        if (filterStatus === "all") return true;
        return order.supplyOrderUserStatus?.toLowerCase().includes(filterStatus);
    });

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
                    <option value="новый">Новый</option>
                    <option value="в работе">В работе</option>
                    <option value="отгружен">Отгружен</option>
                    <option value="завершен">Завершен</option>
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
                                
                                <td>{item.supplyOrderUserStatus}</td>
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
