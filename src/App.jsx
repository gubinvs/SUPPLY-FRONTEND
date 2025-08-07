import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiUrl from "./js/ApiUrl.js";
import ListComponent from './ListComponent/ListComponent';
import AuthorizationForm from './RegistrationForm/AuthorizationForm.jsx';
import RegistrationForm from './RegistrationForm/RegistrationForm.jsx';
import ApplicationPanelCustomer from "./ApplicationPanel/ApplicationPanelCustomer.jsx";
import ApplicationPanelProvider from './ApplicationPanel/ApplicationPanelProvider.jsx';
import ApplicationPanelAdmin from './ApplicationPanel/ApplicationPanelAdmin.jsx';
import PrivateRoute from './js/PrivateRoute.jsx'; // добавили данные о роли пользователя
import UpdatePassword from "./RegistrationForm/UpdatePassword.jsx";
import ApplicationPanelRouter from "./ApplicationPanel/ApplicationPanelRouter.jsx";
import { roleMap, ROLE_ADMIN, ROLE_PROVIDER, ROLE_CUSTOMER, ROLE_USER} from "./js/roleMap.js";
import SuppliersOffers from "./SuppliersOffers/SuppliersOffers.jsx";
import AllOffersForSelected from "./SuppliersOffers/AllOffersForSelected.jsx";
import AddComponentApplication from "./AddComponentApplication/AddComponentApplication.jsx";
import ExcelPasteInput from "./ExcelPasteInput.jsx";
import EditSupplyComponent from "./EditSupplyComponent/EditSupplyComponent.jsx";
import PurchasePage from "./PurchasePage/PurchasePage.jsx";
import OrdersPage from "./OrdersPage/OrdersPage.jsx";


const App = () => {
  const [roleId] = useState(() => localStorage.getItem("roleId")); // ✅ кэшируем значение
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const profitability = 1.1; // Рентабельность по которой работает сервис



  useEffect(() => {
      const currentRole = roleMap[roleId] || "Неизвестная роль";
      setRole(currentRole);
  }, [roleId]);

  useEffect(() => {
      const location = window.location.pathname;
      
      setTitle(location === "/ApplicationPanelCustomer"
          ? "Информационная панель"
          : "");
  }, []);


  // Запрос полного списка номенклатуры в базе данных
  useEffect(() => {
      fetch(ApiUrl + "/api/ReturnListDataComponent", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      })
          .then((response) => {
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return response.json();
          })
          .then((data) => {
              setComponents(data || []);
              setLoading(false);
          })
          .catch((error) => {
              console.error("Ошибка получения данных:", error);
              setError("Ошибка загрузки данных: " + error.message);
              setLoading(false);
          });
  }, []);

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<EditPriceComponent />} /> */}
        <Route path="/" element={<ApplicationPanelRouter />} />
        <Route path="/AuthorizationForm" element={<AuthorizationForm />} />
        <Route path="/Registration" element={<RegistrationForm />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />
        <Route path='/ExcelPasteInput' element={<ExcelPasteInput />} />

        {/* Роут первоначальный для упрошенного отображения, работает пока не введено новое приложение, потом удалить */}
        <Route path="/ListComponent" element={
          <PrivateRoute allowedRoles={[ROLE_ADMIN]}>
            <ListComponent />
          </PrivateRoute>} />


        <Route path="/ApplicationPanelAdmin" element={
          <PrivateRoute allowedRoles={[ROLE_ADMIN]}>
            <ApplicationPanelAdmin role={role} title="Панель администратора" />
          </PrivateRoute>
        } />

        <Route path="/ApplicationPanelProvider" element={
          <PrivateRoute allowedRoles={[ROLE_PROVIDER, ROLE_ADMIN]}>
            <ApplicationPanelProvider />
          </PrivateRoute>
        } />

        <Route path="/ApplicationPanelCustomer" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN, ROLE_USER]}>
            <ApplicationPanelCustomer role={role} title={title} />
          </PrivateRoute>
        } />

        {/* Страница c формой добавления компонентов в систему */}
        <Route path="/AddComponentApplication" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_PROVIDER, ROLE_ADMIN]}>
            <AddComponentApplication 
              role={role} 
              title="Добавление данных"
              components={components} 
              
            />
          </PrivateRoute>
        } />

        {/* Страница для заказчика, на ней посковая строка и выдача результатов всех предложеий */}
        <Route path="/SuppliersOffers" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN, ROLE_USER]}>
            <SuppliersOffers 
              role={role} 
              title="Предложения поставщиков" 
              components={components}
              loading={loading}
              error={error}
            />
          </PrivateRoute>
        } />

        {/* Страница для заказчика, на ней посковая строка и выдача результатов по лучшим предложениям */}
        <Route path="/AllOffersForSelected" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN, ROLE_USER]}>
            <AllOffersForSelected role={role} title="Предложения по выбранным артикулам" />
          </PrivateRoute>
        } />

        {/* Страница для Редактирование номенклатуры в приложении, корректировка артикулов и наименований */}
        <Route path="/EditSupplyComponent" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN, ROLE_PROVIDER]}>
            <EditSupplyComponent 
              role={role} 
              title="Редактирование номенклатуры"
              components={components}
              error={error}
            />
          </PrivateRoute>
        } />

        {/* Страница c данными о спецификациях */}
          <Route path="/Purchase" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN, ROLE_USER]}>
            <PurchasePage
              role={role} 
              title="Спецификации пользователя"
              components={components}
              profitability={profitability}
              error={error}
              loading={loading}
            />
          </PrivateRoute>
        } />

        {/* Страница c данными о заказах (закупке) */}
          <Route path="/OrdersPage" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN, ROLE_USER]}>
            <OrdersPage 
              role={role} 
              title="Заказы пользователя"
              loading={loading}
            />
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
};

export default App;