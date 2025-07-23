  // Временные массива данных для отладки в нем собрана информация о самой закупке, в которой находятся элементы
 
 
 const [purchase, setPurchase] = useState(
        [{
        guidIdPurchase : "f0e61c84-7c57-46d0-897b-b0843af0ce80",
        purchaseId : "ВП25-008",
        purchaseName: "Шкаф управления (ШУ) балластными насосами",
        purchasePrice: 150000,
        purchaseCostomer: "ООО \"Кронштадт\"", //Заказчик
        // Содержимое закупки
        purchaseItem: [
            {
                guidIdPurchase : "f0e61c84-7c57-46d0-897b-b0843af0ce80",
                guidIdComponent: "87127a71-a08f-44f4-9fcb-6b72fd7539fa",
                vendorCodeComponent:"LC1D32BD",
                nameComponent:"Пускатель магнитный 32А катушка управления 24В DС 1НО+1НЗ LC1D (LC1D32BD)",
                requiredQuantityItem: 2, // Требуемое количество
                purchaseItemPrice: 23000,
                bestComponentProvider: "ООО '\"Паритет\"",
                deliveryTimeComponent: "от 24 до 28 нед",
                // Другие предложения
                otherOffers: [{
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 100000,
                        bestComponentProvider: "ООО '\"ПТЦ\"",
                        deliveryTimeComponent: "от 20 до 24 нед"
                    },
                    {
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 4000,
                        bestComponentProvider: "ООО '\"ЭЛЕКТРО-ПРОФИ\"",
                        deliveryTimeComponent: "от 16 до 20 нед"
                    }]
            },
            {
                guidIdPurchase : "f0e61c84-7c57-46d0-897b-b0843af0ce80",
                guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                vendorCodeComponent:"A9V41263",
                nameComponent:"Блок дифференциальной защиты Vigi iC60 2П 63A 30mA  AC",
                requiredQuantityItem: 4, // Требуемое количество
                purchaseItemPrice: 26000,
                bestComponentProvider: "ООО '\"ПТЦ\"",
                deliveryTimeComponent: "от 8 до 16 нед",
                // Другие предложения
                otherOffers: [{
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 1000,
                        bestComponentProvider: "ООО '\"ПТЦ\"",
                        deliveryTimeComponent: "от 4 до 8 нед"
                    },
                    {
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 2000,
                        bestComponentProvider: "ООО '\"ЭЛЕКТРО-ПРОФИ\"",
                        deliveryTimeComponent: "от 1 до 4 нед"
                    }]
            }
        ],

    }]);