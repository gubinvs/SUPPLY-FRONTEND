
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListComponent from './ListComponent/ListComponent';
import AuthorizationForm from './RegistrationForm/AuthorizationForm.jsx';
import RegistrationForm from './RegistrationForm/RegistrationForm.jsx';
import ApplicationPanelCustomer from "./ApplicationPanel/ApplicationPanelCustomer.jsx";
import ApplicationPanelProvider from './ApplicationPanel/ApplicationPanelProvider.jsx';
import ApplicationPanelAdmin from './ApplicationPanel/ApplicationPanelAdmin.jsx';
import PrivateRoute from './js/PrivateRoute.jsx'; // добавили данные о роли пользователя
import UpdatePassword from "./RegistrationForm/UpdatePassword.jsx";
import ApplicationPanelRouter from "./ApplicationPanel/ApplicationPanelRouter.jsx";
import { roleMap } from "./js/roleMap.js";
import SuppliersOffers from "./SuppliersOffers/SuppliersOffers.jsx";
import AllOffersForSelected from "./SuppliersOffers/AllOffersForSelected.jsx";
import AddComponentApplication from "./AddComponentApplication/AddComponentApplication.jsx";

// Константы ролей
const ROLE_ADMIN = "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3"; // Роль администратора системы
const ROLE_PROVIDER = "a5219e2b-12f3-490e-99f5-1be54c55cc6d"; // Роль поставщика
const ROLE_CUSTOMER = "52910536-2b8a-47e7-9d5a-8cca0a0b865a"; // Роль заказчика


const App = () => {
  const [roleId] = useState(() => localStorage.getItem("roleId")); // ✅ кэшируем значение
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");

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

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<EditPriceComponent />} /> */}
        <Route path="/" element={<ApplicationPanelRouter />} />
        <Route path="/AuthorizationForm" element={<AuthorizationForm />} />
        <Route path="/Registration" element={<RegistrationForm />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />

        {/* Роут первоначальный для упрошенного отображения, работает пока не введено новое приложение, потом удалить */}
        <Route path="/ListComponent" element={
          <PrivateRoute allowedRoles={[ROLE_ADMIN]}>
            <ListComponent />
          </PrivateRoute>} />


        <Route path="/ApplicationPanelAdmin" element={
          <PrivateRoute allowedRoles={[ROLE_ADMIN]}>
            <ApplicationPanelAdmin />
          </PrivateRoute>
        } />

        <Route path="/ApplicationPanelProvider" element={
          <PrivateRoute allowedRoles={[ROLE_PROVIDER, ROLE_ADMIN]}>
            <ApplicationPanelProvider />
          </PrivateRoute>
        } />

        <Route path="/ApplicationPanelCustomer" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <ApplicationPanelCustomer role={role} title={title} />
          </PrivateRoute>
        } />

        {/* Страница c формой добавления компонентов в систему */}
        <Route path="/AddComponentApplication" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_PROVIDER, ROLE_ADMIN]}>
            <AddComponentApplication role={role} title="Добавление товара в базу данных" />
          </PrivateRoute>
        } />

        {/* Страница для заказчика, на ней посковая строка и выдача результатов по лучшим предложениям */}
        <Route path="/SuppliersOffers" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <SuppliersOffers role={role} title="Предложения поставщиков" />
          </PrivateRoute>
        } />

        {/* Страница для заказчика, на ней посковая строка и выдача результатов по лучшим предложениям */}
        <Route path="/AllOffersForSelected" element={
          <PrivateRoute allowedRoles={[ROLE_CUSTOMER, ROLE_ADMIN]}>
            <AllOffersForSelected role={role} title="Предложения по выбранным артикулам" />
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
};

export default App;