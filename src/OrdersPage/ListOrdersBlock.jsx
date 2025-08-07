import "./listOrdersBlock.css";


const ListOrdersBlock  = (
    {ordersList}
) => {

    

    return(
        <>
            <div className="orders-block-section">
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
                        {ordersList.map((item, count)=>{
                            return(
                                <>
                                    <tr key={count}>
                                        <td>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </td>
                                        <td>{item.purchaseId}</td>
                                        <td>{item.purchaseName}</td>
                                        <td>{item.purchasePrice}</td>
                                        <td>{item.purchaseCostomer}</td>
                                        <td>{item.supplyOrderUserStatus}</td>
                                    </tr>
                                    {item.orderComponent.map((comp)=>{  
                                        return(
                                            <>
                                                <tr>  
                                                    <td className="obs_td-component"></td>
                                                    <td className="obs_td-component">{comp.vendorCodeComponent}</td>
                                                    <td className="obs_td-component">{comp.nameComponent}</td>
                                                    <td className="obs_td-component">{comp.quantityComponent}</td>
                                                    <td className="obs_td-component">{comp.priceComponent}</td>
                                                    <td className="obs_td-component">{comp.deliveryTimeComponent}</td>
                                                   
                                                </tr>
                                            </>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default ListOrdersBlock;