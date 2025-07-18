
import { useState, useEffect } from "react";
import "./addItemPurchase.css"
import ApiUrl from "../../js/ApiUrl";



// Блок с формой выбора номенклатуры для добавления ее в закупку
const AddItemPurchase = (
    {components, purchase, setPurchase}
) => {

    // Отфильтрованные данные о номенклатуре на основании соответствия введенных данных в input
    const [searchTerm, setSearchTerm] = useState("");
    // Состояние блока выдачи результата поискового запроса
    const [resultSearch, setResultSearch] = useState(false)
    // Начинаем выдавать данные для отображения на странице только после изменения (вводе данных в форму)
    const [filteredComponents, setFilteredComponents] = useState([]);
    // Состав закупки по номенклатуре
    const [listItem, setListItem] = useState(purchase[0].purchaseItem);
    // Достаем guidIdCollaborator
    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
  
    useEffect(() => {
        const filtered = components.filter(item =>
            item.vendorCodeComponent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nameComponent?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 25); // Ограничение до ......;

        setFilteredComponents(filtered);

        if (searchTerm === "") {
            setResultSearch(false)
        } else {
            setResultSearch(true)
        }
    }, [searchTerm, components]);


    // Метод добавления номенклатуры в закупку
    const handleAddItem = (item) => {
        const newItem = {
            guidIdPurchase: listItem[0].guidIdPurchase,
            guidIdComponent: item.guidIdComponent,
            vendorCodeComponent: item.vendorCodeComponent,
            nameComponent: item.nameComponent,
            requiredQuantityItem: 1,
            purchaseItemPrice: 0,
            bestComponentProvider: "нет данных",
            deliveryTimeComponent: "нет данных",
            otherOffers:[]
        };

        setListItem((listItem) => [...listItem, newItem]);

        setPurchase((prev) =>
            prev.map((p, index) =>
                index === 0
                    ? {
                        ...p,
                        purchaseItem: [...p.purchaseItem, newItem]
                    }
                    : p
            )
        );
    };

    // Функция обновления цен и предложений поставщиков
    const priceUpdate = () => {
        const bodyRequest = listItem.map((item) => item.vendorCodeComponent);

        fetch(ApiUrl + "/api/ReturnPriceProviderListArticle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ articles: bodyRequest })
        })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            const updatedPurchase = purchase.map(p => ({
                ...p,
                purchaseItem: p.purchaseItem.map(item => {
                    const match = data.found.find(d => d.article === item.vendorCodeComponent);

                    if (match && Array.isArray(match.offers) && match.offers.length > 0) {
                        const bestOffer = match.offers[0]; // Можно заменить на сортировку по цене или сроку при необходимости
                        return {
                            guidIdPurchase: item.guidIdPurchase,
                            guidIdComponent: item.guidIdComponent,
                            vendorCodeComponent: item.vendorCodeComponent,
                            nameComponent: item.nameComponent,
                            requiredQuantityItem: item.requiredQuantityItem > 1 ? item.requiredQuantityItem : 1,
                            purchaseItemPrice: item.purchaseItemPrice === 0 ? bestOffer.priceComponent : item.purchaseItemPrice,
                            bestComponentProvider: item.bestComponentProvider === "нет данных" ? bestOffer.nameProvider : item.bestComponentProvider,
                            deliveryTimeComponent: item.deliveryTimeComponent === "нет данных" ? bestOffer.deliveryTimeComponent : item.deliveryTimeComponent,
                            otherOffers: !item.otherOffers || item.otherOffers.length === 0 ? 
                                    match.offers.map((x)=>{
                                        return {
                                            guidIdComponent:  item.guidIdComponent,
                                            purchaseItemPrice: x.priceComponent,
                                            bestComponentProvider: x.nameProvider,
                                            deliveryTimeComponent: x.deliveryTimeComponent
                                        };
                                        
                                    })
                                : item.otherOffers
                        };
                    }

                    return item;
                })
            }));

            setPurchase(updatedPurchase);
            setResultSearch(false);
        })

        .catch((error) => {
            console.error("Ошибка получения данных:", error);
        });
    };

 
    // Запрос на схранение данных о составе номенклатуры в закупке в базе данных
    const requestAddItemPurchaseData = () => {
       const i = purchase[0]; // первый объект

        const requestData = {
            guidIdCollaborator: guidIdCollaborator,
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

        const jsonData = JSON.stringify(requestData)


        fetch(ApiUrl + "/api/SaveSupplyPurchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
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

    return(
        <>
            <div className="add-item-purchase-section">
                <div className="add-item-purchase__form-block">
                    <div className="aip-block__input-block">
                        <div className="aip-block__input_closed"
                            onClick={()=>{setResultSearch(false)}}
                        >X</div>
                        <input 
                                className="form-control aip-block__input" 
                                type="text" 
                                placeholder="Добавить номенклатуру" 
                                aria-label="default input example" 
                                value={searchTerm}
                                onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        /> 
                    </div>
                    <button type="button" className="btn btn-outline-secondary aip-block__button"
                        onClick={()=>priceUpdate()}
                    >Обновить цены</button> 
                    <button className="btn btn-outline-success aip-block__purchase-save"
                        onClick={()=> requestAddItemPurchaseData()}
                    >Сохранить изменения</button>
                </div>
                {resultSearch?
                <>
                    <div className="add-item-purchase__result-search_close" onClick={()=> setResultSearch(false)}>Свернуть список</div>
                    <div className="add-item-purchase__result-search">
                        <ul className="aip-result-search__list">
                            {filteredComponents.map((item, index) => {
                                const isAlreadyInPurchase = purchase[0]?.purchaseItem?.some(p => p.guidIdComponent === item.guidIdComponent);
                               
                                return (
                                    <li key={index} className="aip-result-search__item">
                                        <div className="aip-rs-item__content-block">
                                            <div className="aip-rs-item_vendor">{item.vendorCodeComponent}</div>
                                            <div className="aip-rs-item_name">{item.nameComponent}</div> 
                                        </div>
                                        <div
                                            className={
                                                isAlreadyInPurchase
                                                    ? "aip-rs-item_button aip-rs-item_button_add"
                                                    : "aip-rs-item_button"
                                            }
                                            onClick={() => !isAlreadyInPurchase && handleAddItem(item)}
                                        >
                                            +
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
                :""}
            </div>
            
        </>
    );

};

export default AddItemPurchase;