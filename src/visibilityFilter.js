
const visibilityFilter = (state = 'SHOW_SEARCH', action) => {
    switch (action.type) {
        case 'SHOW_QUESTIONS':
            state = { visibilityFilter: action.filter }
            return state;
        default:
            return state;
    }
};

export default visibilityFilter;