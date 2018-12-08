import React, { Component } from 'react';
import logo from './logo.png';
import ItemList from './Components/itemList.js';
import './App.css';

// you should feel free to reorganize the code however you see fit
// including creating additional folders/files and organizing your
// components however you would like.

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      membersToShow: []
    };
  }

  searchMembers(value = '') {
    let regexValue = '.*' + value.split(' ').join('.*|.*') + '.*';
    let values = this.state.members.filter(item => {
      let fullName = item.props.person.first_name + ' ' + (item.props.person.middle_name ? (item.props.person.middle_name + ' ') : '') + item.props.person.last_name;
      return value.split(' ').reduce((resp, val) => {
        let match = fullName.match(val) !== null;
        return resp && match;
      }, true);
    });
    this.setState({
      membersToShow: values
    });
  }

  componentWillMount() {
    const session = 115 // 115th congressional session
    const chamber = 'senate' // or 'house'

    // sample API call
    fetch(`https://api.propublica.org/congress/v1/${session}/${chamber}/members.json`, {
      headers: new Headers({
        'X-API-Key': 'd0ywBucVrXRlMQhENZxRtL3O7NPgtou2mwnLARTr',
      }),
    })
    .then((res) => res.json())
    .then((json) => json.results[0].members)
    .then((members) => {
      let array = [];
      members.forEach((member, id) => {
        array.push(<ItemList person={member} key={id} />);
      });
      this.setState({
        members: array.slice(0)
      });
      this.setState({
        membersToShow: array.slice(0)
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Programming Exercise</h1>
           <div className="form-inline position-absolute" id="search-form"> 
            <div className="input-group mb-2 mr-sm-2">
              <div className="input-group-prepend">
                <i className="input-group-text fas fa-search"></i>
              </div>
              <input type="text" className="form-control" id="search-input" placeholder="Search" onKeyUp={(e) => this.searchMembers(e.target.value)}></input>
            </div>
          </div>
        </header>
        <section className="container">
          <div className="list-group">
            {this.state.membersToShow}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
