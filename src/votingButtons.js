
const votingButtons = (state = 'SHOW', action) => {
    switch (action.type) {
        case 'HIDE':
            state = { showButtons: false }
            return state;
        default:
            return state;
    }
};

export default votingButtons;