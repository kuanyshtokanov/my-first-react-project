const VotesController = (state = [], action) => {
    switch (action.type) {
        case 'ADD_VOTE':
            var localState = { name: action.name, questionId: action.questionId, voteId: action.voteId };
            state.push(localState);
            return state;
        default:
            return state;
    }
};

export default VotesController;