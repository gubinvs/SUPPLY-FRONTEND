
// Функция меняет состояние
export function wordingOfState (state, setState) {

    if (state === true) {
        setState(false);
    } else {
        setState(true);
    }
};