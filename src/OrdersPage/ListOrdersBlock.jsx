import "./listOrdersBlock.css";


const ListOrdersBlock  = (
    {ordersList}
) => {

    return(
        <>
            <table className="table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Идентификатор</th>
                        <th scope="col">Наименование</th>
                        <th scope="col">Стоимость</th>
                        <th scope="col">Заказчик</th>
                        <th scope="col">Статус заказа</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {ordersList.map((item)=>{
                        return(
                            <>
                              <tr>
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
                            <td>{item.supplyOrderUserStatus }</td>
                        </tr>
                            </>
                        );
                    })}
                </tbody>
            </table>
        
        </>
    );

};

export default ListOrdersBlock;