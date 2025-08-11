import { useEffect, useState, useCallback } from "react";
import "./listPurchaseBlock.css";
import ApiUrl from "../js/ApiUrl";
import ListPurchaseComponent from "./ListPurchaseComponent.jsx";
import { changeProcurementStatusTrue } from "../js/Utilits/changeProcurementStatus.js";

const ListPurchaseBlock = ({ components, purchase, setPurchase, profitability }) => {
    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
    const [checkedPurchaseId, setCheckedPurchaseId] = useState([]);
    const [editPurchaseName, setEditPurchaseName] = useState([]);
    const [editPurchaseStatus, setEditPurchaseStatus] = useState([]);

    const [mapPurchaseId, setMapPurchaseId] = useState([]);
    const [mapPurchaseName, setMapPurchaseName] = useState([]);
    const [mapPurchaseCostomer, setMapPurchaseCostomer] = useState([]);
    const [mapPurchaseStatus, setMapPurchaseStatus] = useState([]);
    const [shareEmail, setShareEmail] = useState([]);
    const [shareGuidIdPurchase, setShareGuidIdPurchase] = useState([]);
    const [purchaseState, setPurchaseState] = useState([]);
    const [shareForm, setShareForm] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        if (purchase.length > 0) {
            setShareForm(new Array(purchase.length).fill(false));
        }
    }, [purchase.length]);

    useEffect(() => {
    // Инициализируем purchaseState нужной длины при загрузке purchase
    if (purchase.length > 0) {
        setPurchaseState(prev => {
        // Если длина не совпадает — создаём новый массив
        if (prev.length !== purchase.length) {
            return new Array(purchase.length).fill(false);
        }
        return prev; // иначе оставляем без изменений
        });
    }
    }, [purchase.length]);

    const handleCheck = (index) => {
        setCheckedPurchaseId((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };


    const saveAllPurchaseData = async (index) => {
        const updatedPurchaseData = {
            guidIdPurchase: purchase[index].guidIdPurchase,
            purchaseId: mapPurchaseId[index] || purchase[index].purchaseId,
            purchaseName: mapPurchaseName[index] || purchase[index].purchaseName,
            purchasePrice: purchase[index].purchasePrice,
            purchaseCostomer: mapPurchaseCostomer[index] || purchase[index].purchaseCostomer,
            supplyPurchaseStatus: mapPurchaseStatus[index] || purchase[index].supplyPurchaseStatus
        };

        try {
            const response = await fetch(ApiUrl + "/api/SaveNewDataPurchaseName", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPurchaseData)
            });

            if (response.ok) {
                const updated = [...purchase];
                updated[index] = { ...updated[index], ...updatedPurchaseData };
                setPurchase(updated);

                const editName = [...editPurchaseName];
                const editStatus = [...editPurchaseStatus];
                editName[index] = false;
                editStatus[index] = false;
                setEditPurchaseName(editName);
                setEditPurchaseStatus(editStatus);

                alert("Изменения сохранены.");
            } else {
                const errorText = await response.text();
                console.error("Ошибка от API:", errorText);
                alert("Ошибка при сохранении данных!");
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            alert("Ошибка при отправке запроса!");
        }
    };

    const requestAddItemPurchaseData = (index) => {
        const i = purchase[index];

        const requestData = {
            guidIdCollaborator,
            guidIdPurchase: i.guidIdPurchase,
            purchaseId: i.purchaseId,
            purchaseName: i.purchaseName,
            purchasePrice: i.purchasePrice,
            purchaseCostomer: i.purchaseCostomer,
            purchaseItem: i.purchaseItem.map(x => ({
                guidIdComponent: x.guidIdComponent,
                vendorCodeComponent: x.vendorCodeComponent,
                nameComponent: x.nameComponent,
                requiredQuantityItem: x.requiredQuantityItem,
                purchaseItemPrice: x.purchaseItemPrice,
                bestComponentProvider: x.bestComponentProvider,
                deliveryTimeComponent: x.deliveryTimeComponent
            }))
        };

        fetch(ApiUrl + "/api/SaveSupplyPurchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                alert("Данные успешно записаны!");
                changeProcurementStatusTrue(index, purchaseState, setPurchaseState);
                return response.json();
            })
            .catch((error) => {
                console.error("Ошибка при отправке данных:", error);
                alert("Ошибка при сохранении данных!");
            });
    };

    const deletePurchase = async (guidIdPurchase) => {
        if (!window.confirm("Вы уверены, что хотите удалить эту спецификацию?")) return;

        try {
            const response = await fetch(ApiUrl + "/api/SaveSupplyPurchase/" + guidIdPurchase, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const errorText = await response.text();
                console.error("Ошибка от API:", errorText);
                alert("Ошибка при удалении данных!");
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            alert("Ошибка при удалении!");
        }
    };

    const grantAccess = async (guidId, email) => {
        const request = { guidIdPurchase: guidId, emailCollaborator: email };
        try {
            const response = await fetch(ApiUrl + "/api/SharePurchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request)
            });

            const text = await response.text();
            const message = JSON.parse(text);
            alert(message.message);
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка при отправке запроса!");
        }
    };

    // ✅ мемоизированный обработчик для setPurchasePrice
    const setPurchasePriceHandler = useCallback((index, newPrice) => {
        setPurchase(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], purchasePrice: newPrice };
            return updated;
        });
    }, [setPurchase]);

    const filteredPurchase = purchase.filter((p) => {
        if (filterStatus === "all") return true;
        return p.supplyPurchaseStatus?.toLowerCase().includes(filterStatus);
    });

    return (
        <div className="list-purchase-block__list-block">
            <div className="filter-section" style={{ marginBottom: "1rem" }}>
                <label htmlFor="status-filter" style={{ marginRight: "10px" }}>
                    Фильтр по статусу спецификации:
                </label>
                <select
                    className="form-select"
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Все</option>
                    <option value="в работе">В работе</option>
                    <option value="в архиве">В архиве</option>
                </select>
            </div>

            <ul className="list-purchase">
                {filteredPurchase.map((item, index) => (
                    <li key={item.purchaseId} className="list-purchase__item">
                        <div className="list-purchase__item_title">
                            <div className="lp-item__context-block">
                                <div className="lp-item__check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={checkedPurchaseId[index] || false}
                                        onChange={() => handleCheck(index)}
                                    />
                                </div>

                                {editPurchaseName[index] ? (
                                    <>
                                        <input
                                        
                                            className="lp-item__purchase-id lp-item__purchase-id_input"
                                            type="text"
                                            value={mapPurchaseId[index] || ""}
                                            onChange={(e) => {
                                                const newMap = [...mapPurchaseId];
                                                newMap[index] = e.target.value;
                                                setMapPurchaseId(newMap);
                                            }}
                                        />
                                        <input
                                            className="lp-item__purchase-name lp-item__purchase-name_input"
                                            type="text"
                                            value={mapPurchaseName[index] || ""}
                                            onChange={(e) => {
                                                const newMap = [...mapPurchaseName];
                                                newMap[index] = e.target.value;
                                                setMapPurchaseName(newMap);
                                            }}
                                        />
                                        <input
                                            className="lp-item__purchase-name-costomer lp-item__purchase-name-costomer_input"
                                            type="text"
                                            value={mapPurchaseCostomer[index] || ""}
                                            onChange={(e) => {
                                                const newMap = [...mapPurchaseCostomer];
                                                newMap[index] = e.target.value;
                                                setMapPurchaseCostomer(newMap);
                                            }}
                                        />
                                        <select
                                            className="form-select form-select-sm list-purchase__form-select"
                                            value={mapPurchaseStatus[index] || ""}
                                            onChange={(e) => {
                                                const newMap = [...mapPurchaseStatus];
                                                newMap[index] = e.target.value;
                                                setMapPurchaseStatus(newMap);
                                            }}
                                        >
                                            <option value="В работе">В работе</option>
                                            <option value="В архиве">В архиве</option>
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <div className="lp-item__purchase-id">{item.purchaseId}</div>
                                        <div className="lp-item__purchase-name">{item.purchaseName}</div>
                                        <div className="lp-item__purchase-price">
                                            {item.purchasePrice ? Intl.NumberFormat("ru").format(item.purchasePrice) : "нет данных"} р.
                                        </div>
                                        <div className="lp-item__purchase-name-costomer">{item.purchaseCostomer}</div>
                                    </>
                                )}
                            </div>

                            <div className="lp-item__purchase__icon-groop">
                                {editPurchaseName[index] ? (
                                    <img
                                        className="lpip-icon-groop__save"
                                        src="../images/save-icon.svg"
                                        alt="Сохранить"
                                        onClick={() => saveAllPurchaseData(index)}
                                    />
                                ) : (
                                    <>
                                        <img
                                            className="lpip-icon-groop__edit"
                                            src="../images/edit-icon.svg"
                                            alt="Редактировать"
                                            onClick={() => {
                                                const editName = [...editPurchaseName];
                                                const editStatus = [...editPurchaseStatus];
                                                editName[index] = true;
                                                editStatus[index] = true;
                                                setEditPurchaseName(editName);
                                                setEditPurchaseStatus(editStatus);

                                                // 📌 Заполняем mapPurchase... начальными данными
                                                const newMapId = [...mapPurchaseId];
                                                const newMapName = [...mapPurchaseName];
                                                const newMapCostomer = [...mapPurchaseCostomer];
                                                const newMapStatus = [...mapPurchaseStatus];

                                                newMapId[index] = purchase[index].purchaseId;
                                                newMapName[index] = purchase[index].purchaseName;
                                                newMapCostomer[index] = purchase[index].purchaseCostomer;
                                                newMapStatus[index] = purchase[index].supplyPurchaseStatus;

                                                setMapPurchaseId(newMapId);
                                                setMapPurchaseName(newMapName);
                                                setMapPurchaseCostomer(newMapCostomer);
                                                setMapPurchaseStatus(newMapStatus);
                                            }}
                                        />
                                        <img
                                            className="lpip-icon-groop__share"
                                            src="../images/share-icon.svg"
                                            alt="Поделиться"
                                            onClick={() => {
                                                const updated = [...shareForm];
                                                updated[index] = true;
                                                setShareForm(updated);
                                            }}
                                        />
                                        <img
                                            className="lpip-icon-groop__save"
                                            src="../images/save-icon.svg"
                                            alt="Сохранить"
                                            onClick={() => requestAddItemPurchaseData(index)}
                                        />
                                        <img
                                            className="lpip-icon-groop__save"
                                            src="../images/delete-icon.svg"
                                            alt="Удалить"
                                            onClick={() => deletePurchase(item.guidIdPurchase)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {checkedPurchaseId[index] && (
                            <ListPurchaseComponent
                                count={index}
                                components={components}
                                profitability={profitability}
                                purchase={purchase}
                                setPurchase={setPurchase}
                                purchaseState={purchaseState}
                                setPurchaseState={setPurchaseState}
                                setPurchasePrice={(newPrice) => setPurchasePriceHandler(index, newPrice)}
                                requestAddItemPurchaseData={requestAddItemPurchaseData}
                            />
                        )}

                        {shareForm[index] && (
                            <div className="share-form-purchase">
                                <img
                                    className="share-form-purchase__close-icon"
                                    src="../images/close-icon.svg"
                                    alt="@"
                                    onClick={() => {
                                        const updateShareForm = [...shareForm];
                                        updateShareForm[index] = false;
                                        setShareForm(updateShareForm);
                                    }}
                                />
                                <div className="share-form-purchase__title">
                                    Для предоставления доступа к спецификации введите email пользователя
                                </div>
                                <input
                                    className="form-control share-form-purchase__input"
                                    type="email"
                                    placeholder="email"
                                    value={shareEmail[index]}
                                    onChange={(e) => {
                                        const newShareGuidIdPurchase = [...shareGuidIdPurchase];
                                        newShareGuidIdPurchase[index] = item.guidIdPurchase;
                                        setShareGuidIdPurchase(newShareGuidIdPurchase);
                                        const newEmails = [...shareEmail];
                                        newEmails[index] = e.target.value;
                                        setShareEmail(newEmails);
                                    }}
                                />
                                <button
                                    className="btn btn-outline-warning"
                                    onClick={() => {
                                        grantAccess(shareGuidIdPurchase[index], shareEmail[index]);
                                        const updatedShareForm = [...shareForm];
                                        updatedShareForm[index] = false;
                                        setShareForm(updatedShareForm);
                                    }}
                                >
                                    Предоставить доступ
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListPurchaseBlock;
