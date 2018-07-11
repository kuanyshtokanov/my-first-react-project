import React, { Component } from 'react';
import logo from './img/alfabank-logo.png';
import './App.css';
import Heading from 'arui-feather/heading';
import Input from 'arui-feather/input';
import Button from 'arui-feather/button';
import Paragraph from 'arui-feather/paragraph';
import Icon from 'arui-feather/icon';
import { createStore, combineReducers } from 'redux';
import visibilityFilter from './visibilityFilter'
import userName from './userName'
import VotesController from './VotesController'
import votingButtons from './votingButtons'

const QUESTIONS = [
  { id: 1, category: 'IMPORTANT', name: 'First order question', description: 'Is Kuanysh good enough for us (accepted answers: YES, Yes of course, Hell yeah)' },
  { id: 2, category: 'Job Stuff', name: 'Project Ara', description: 'Shall we continue development of this project' },
  { id: 3, category: 'Job Stuff', name: 'AI module', description: 'Shall we implement AI module to our app logic' },
  { id: 4, category: 'Work place', name: 'Chairs', description: 'Do we need to change our chairs' }
];
const VOTEDESC = [
  { id: 1, description: 'Agree' },
  { id: 2, description: 'Disagree' },
  { id: 0, description: 'Undecided' }
];
const colors = {
  agreeColor: 'LightGreen',
  disagreeColor: 'LightCoral',
  neutralColor: 'LightSalmon',
  notChosenColor: 'LightGrey'
};
var votes = [];

const initialState = { userName: '', visibilityFilter: 'SHOW_SEARCH', VotesController: [] };
const reducers = combineReducers({ userName, visibilityFilter, VotesController });
const store = createStore(reducers, initialState);
store.subscribe(() => {
  console.log('state');
  console.log(store.getState());
});
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="heading heading_size_m heading_theme_alfa-on-color">Тестовое задание по списку вопросов</h1>
        </header>
        <UserName />
        {store.getState().visibilityFilter !== 'SHOW_SEARCH' ? <QuestionList /> : null}
      </div>
    );
  }
}

class UserName extends Component {
  constructor(props) {
    super(props);
    this.state = { userName: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ userName: event.target.value });
  }

  handleSubmit() {
    if (!this.state.userName) {
      alert('Enter your name first');
    }
    else {
      store.dispatch({
        type: 'ADD_USR',
        val: this.state.userName
      });
      store.dispatch({
        type: 'SHOW_QUESTIONS',
        filter: 'SHOW_QUESTIONS'
      });
      this.setState({ userName: this.state.userName });
    }
  }
  render() {
    return (
      <div>
        <span className="input input_type_text input_size_m input_has-value input_theme_alfa-on-white">
          <p className="paragraph paragraph_view_normal paragraph_theme_alfa-on-color">
            Чтобы увидеть список вопросов введите свое имя.
        </p>
          <form>
            <span className="input__inner">
              <span className="input__box">
                <input type="text" className="input__control" placeholder="Введите свое имя" value={this.state.userName} onChange={this.handleChange} />
              </span>
              <button type="button" className="button button_size_m button_theme_alfa-on-white" onClick={this.handleSubmit}>
                <span className="button__text">Добавить</span>
              </button>
            </span>
          </form>
        </span>
        {store.getState().visibilityFilter !== 'SHOW_SEARCH' ? <QuestionList /> : null}
      </div>
    );
  }
}

class QuestionList extends Component {
  render() {
    const questList = QUESTIONS.map((question) => {
      return (
        <SingleQuestion
          key={question.id}
          id={question.id}
          category={question.category}
          name={question.name}
          description={question.description}
          votes={question.votes}
        />
      );
    });
    return (
      <div >
        {questList}
      </div>
    );
  }
}

class SingleQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineColor: colors.notChosenColor
    };
    this.HandleVote = this.HandleVote.bind(this);
    // this.DisgreeHandle = this.DisgreeHandle.bind(this);
  }
  HandleVote(voteId) {
    if (voteId === 0) {
      this.setState({ lineColor: colors.neutralColor });
    }
    else if (voteId === 1) {
      this.setState({ lineColor: colors.agreeColor });
    }
    else if (voteId === 2) {
      this.setState({ lineColor: colors.disagreeColor });
    }
  }
  render() {
    const question = this.props;
    const questionId = question.id;
    return (
      <div className='items' id={questionId} style={{ backgroundColor: this.state.lineColor }}>
        <div className='questionItem'>
          {/* <a>
            {this.props.name}
          </a> */}
          <p>{question.description}</p>
        </div>
        <VotingArea
          questionId={questionId}
          onVote={this.HandleVote} />
      </div>
    );
  }
}
class VotingArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: props.questionId,
      showButtons: true,
      vote: 0
    };
    this.VoteHandle = this.VoteHandle.bind(this);

    // this.DisgreeHandle = this.DisgreeHandle.bind(this);
  }
  VoteHandle(voted) {
    var stateQList = {
      name: store.getState().userName.userName,
      questionId: this.state.questionId,
      voteId: voted
    };
    var answered = false;
    store.getState().VotesController.forEach(element => {
      if (element.questionId === this.state.questionId && element.voteId === voted) {
        answered = true;
      }
    });
    if (answered) {
      alert('You have already voted for this question');
    }
    else {
      this.setState({ showButtons: false });
      this.setState({ vote: voted });
      store.dispatch({
        type: 'ADD_VOTE',
        name: store.getState().userName.userName,
        questionId: this.state.questionId,
        voteId: voted
      });
      this.props.onVote(voted);
      // store.dispatch({
      //   type: 'HIDE'
      // });
    }
  }
  render() {
    var pTxt = '';
    if (this.state.vote === 0) {
      pTxt = 'Neutral selected';
    }
    else if (this.state.vote === 1) {
      pTxt = 'Agree selected';
    }
    else {
      pTxt = 'Disagree selected';
    }
    return (
      <div className='item' >
        <div className='buttons' style={{ display: this.state.showButtons ? 'block' : 'none' }}>
          <button type="button" className="button button_size_s button_theme_alfa-on-white" onClick={() => this.VoteHandle(1)}>
            <span className="button__text">Agree</span>
          </button>
          <button type="button" className="button button_size_s button_theme_alfa-on-white" onClick={() => this.VoteHandle(2)}>
            <span className="button__text">Disagree</span>
          </button>
          <button type="button" className="button button_size_s button_theme_alfa-on-white" onClick={() => this.VoteHandle(0)}>
            <span className="button__text">Neutral</span>
          </button>
        </div>
        <div className='pTxt' style={{ display: this.state.showButtons ? 'none' : 'block' }}>
          <p className="paragraph paragraph_view_normal paragraph_theme_alfa-on-white">{pTxt}</p>
        </div>
      </div>
    );
  }
}

export default App;
