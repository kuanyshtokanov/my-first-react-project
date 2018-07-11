const userName = (state = '', action) => {
    switch (action.type) {
        case 'ADD_USR':
            state = { userName: action.val };
            return state;
        default:
            return state;
    }
};

export default userName;