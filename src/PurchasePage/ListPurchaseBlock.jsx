import { useEffect, useState } from "react";
import "./listPurchaseBlock.css";
import ApiUrl from "../js/ApiUrl";
import ListPurchaseComponent from "./ListPurchaseComponent.jsx";

const ListPurchaseBlock = (
    { components, createPurchase, setCreatePurchase, purchase, setPurchase }
) => {
    const [search, setSearch] = useState('');
    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");

    const [checkedPurchaseId, setCheckedPurchaseId] = useState([]);
    const [editPurchaseName, setEditPurchaseName] = useState([]);
    const [mapPurchaseId, setMapPurchaseId] = useState([]);
    const [mapPurchaseName, setMapPurchaseName] = useState([]);
    const [mapPurchaseCostomer, setMapPurchaseCostomer] = useState([]);

    // Форма отправки данных для предоставления доступа к закупке
    const [shareForm, setShareForm] = useState([]);
    useEffect(() => {
    if (purchase.length > 0) {
        setShareForm(new Array(purchase.length).fill(false));
    }
    }, [purchase]);

    useEffect(() => {
        if (purchase.length > 0) {
            if (checkedPurchaseId.length !== purchase.length) {
                setCheckedPurchaseId(new Array(purchase.length).fill(false));
            }
            if (editPurchaseName.length !== purchase.length) {
                setEditPurchaseName(new Array(purchase.length).fill(false));
            }

            setMapPurchaseId(purchase.map(p => p.purchaseId));
            setMapPurchaseName(purchase.map(p => p.purchaseName));
            setMapPurchaseCostomer(purchase.map(p => p.purchaseCostomer));
        }
    }, [purchase]);

    const handleCheck = (index) => {
        setCheckedPurchaseId((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    // Обновление данных закупки и ее компонентов
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
            return response.json();
        })
        .catch((error) => {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка при сохранении данных!");
        });
    };

    // Сохранение нового названия закупки
    const saveNewNamePurchase = async (index) => {
        const updatedPurchaseData = {
            guidIdPurchase: purchase[index].guidIdPurchase,
            purchaseId: mapPurchaseId[index],
            purchaseName: mapPurchaseName[index],
            purchasePrice: purchase[index].purchasePrice,
            purchaseCostomer: mapPurchaseCostomer[index]
        };

        try {
            const response = await fetch(ApiUrl + "/api/SaveNewDataPurchaseName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPurchaseData)
            });

            if (response.ok) {
                const updatedPurchase = [...purchase];
                updatedPurchase[index] = {
                    ...updatedPurchase[index],
                    ...updatedPurchaseData
                };
                setPurchase(updatedPurchase);
                
            } else {
                const errorText = await response.text();
                console.error("Ошибка от API:", errorText);
                alert("Ошибка при сохранении данных!");
            }
        } catch (error) {
            console.error("Ошибка получения данных:", error);
            alert("Ошибка при отправке запроса!");
        }
    };



    // Удаление закупки
    const deletePurchase = async (guidIdPurchase) => {
                try {
            const response = await fetch(ApiUrl + "/api/SaveSupplyPurchase/" + guidIdPurchase, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const errorText = await response.text();
                console.error("Ошибка от API:", errorText);
                alert("Ошибка при удалении данных!");
            }
        } catch (error) {
            console.error("Ошибка получения данных:", error);
            alert("Ошибка при отправке запроса!");
        }
    };

    return (
        <>
            <div className="list-purchase-block__form-block">
                <input
                    className={createPurchase ? "form-control lp-form-block__input" : "form-control lp-form-block__input mr-10"}
                    type="text"
                    placeholder="Поиск закупки по идентификатору"
                    aria-label="purchaseId"
                    value={search}
                    onChange={(e) => {
                        setCreatePurchase(false);
                        setSearch(e.target.value);
                    }}
                />
                {!createPurchase && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary lp-form-block__button"
                        onClick={() => setCreatePurchase(true)}
                    >
                        Создать закупку
                    </button>
                )}
            </div>

            <div className="list-purchase-block__list-block">
                <ul className="list-purchase">
                    {purchase.map((item, index) => (
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
                                    {editPurchaseName[index] ?
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
                                        :
                                        <div className="lp-item__purchase-id">{item.purchaseId}</div>
                                    }
                                    {editPurchaseName[index] ?
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
                                        :
                                        <div className="lp-item__purchase-name">{item.purchaseName}</div>
                                    }
                                    <div className="lp-item__purchase-price">
                                        {item.purchasePrice ? Intl.NumberFormat("ru").format(item.purchasePrice) : "нет данных"} р.
                                    </div>
                                    {editPurchaseName[index] ?
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
                                        :
                                        <div className="lp-item__purchase-name-costomer">{item.purchaseCostomer}</div>
                                    }
                                </div>

                                {editPurchaseName[index] ?
                                    <div className="lp-item__purchase__icon-groop">
                                        <img
                                            className="lpip-icon-groop__save"
                                            src="../images/save-icon.svg"
                                            alt="Сохранить"
                                            onClick={() => {
                                                const updated = [...editPurchaseName];
                                                updated[index] = false;
                                                setEditPurchaseName(updated);
                                                saveNewNamePurchase(index);
                                            }}
                                        />
                                    </div>
                                    :
                                    <div className="lp-item__purchase__icon-groop">
                                        <img
                                            className="lpip-icon-groop__edit"
                                            src="../images/edit-icon.svg"
                                            alt="Редактировать"
                                            onClick={() => {
                                                const updated = [...editPurchaseName];
                                                updated[index] = true;
                                                setEditPurchaseName(updated);
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
                                            onClick={()=>deletePurchase(item.guidIdPurchase)}
                                        />
                                    </div>
                                }
                            </div>

                            {checkedPurchaseId[index] &&
                                <ListPurchaseComponent
                                    count={index}
                                    components={components}
                                    purchase={purchase}
                                    setPurchase={setPurchase}
                                    purchasePrice={item.purchasePrice}
                                    setPurchasePrice={(newPrice) => {
                                        const currentPrice = purchase[index].purchasePrice;
                                        if (currentPrice !== newPrice) {
                                            const updated = [...purchase];
                                            updated[index] = { ...updated[index], purchasePrice: newPrice };
                                            setPurchase(updated);
                                        }
                                    }}
                                    requestAddItemPurchaseData={requestAddItemPurchaseData}
                                />
                            }

                            {/* Форма предоставления доступа к закупке другому пользователю */}
                            {shareForm[index] ?
                            <>
                                <div className="share-form-purchase">
                                    <div className="share-form-purchase__title">
                                        Введите email пользователя для предоставления доступа к закупке
                                    </div>
                                    <input type="hidden" value="12345-abcde-67890" />
                                    <input type="email" placeholder="email" />
                                    <button>Предоставить доступ</button>
                                </div>
                            </>:""}
                            
                        </li>   
                    ))}
                </ul>
            </div>
        </>
    );
};

export default ListPurchaseBlock;
