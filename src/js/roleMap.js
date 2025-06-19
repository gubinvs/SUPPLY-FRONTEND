// Наименование ролей в системе

export const roleMap = {
    "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3": "Администратор",
    "a5219e2b-12f3-490e-99f5-1be54c55cc6d": "Поставщик",
    "52910536-2b8a-47e7-9d5a-8cca0a0b865a": "Заказчик",
    "ba246092-47bf-4bcc-9e97-5b59969c8976": "Пользователь"
};

export const ROLE_ADMIN = "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3";
export const ROLE_PROVIDER = "a5219e2b-12f3-490e-99f5-1be54c55cc6d";
export const ROLE_CUSTOMER = "52910536-2b8a-47e7-9d5a-8cca0a0b865a";
export const ROLE_USER = "ba246092-47bf-4bcc-9e97-5b59969c8976";


// Уровень доступа
// (Пользователь) может смотреть предложения поставщиков, не может редактировать и добавлять
