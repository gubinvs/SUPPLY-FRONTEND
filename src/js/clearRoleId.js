
// Удаляем роль пользователя в системе и токен, для повторной авторизации
function clearRoleId () {
    localStorage.clear("roleId");
    localStorage.clear("token");

    window.location = "/";
};


export default clearRoleId;
