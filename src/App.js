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
    this.state = {members: []};
  }

  componentWillMount() {
    const session = 115 // 115th congressional session
    const chamber = 'senate' // or 'house'
    this.members = []

    // sample API call
    fetch(`https://api.propublica.org/congress/v1/${session}/${chamber}/members.json`, {
      headers: new Headers({
        'X-API-Key': 'd0ywBucVrXRlMQhENZxRtL3O7NPgtou2mwnLARTr',
      }),
    })
    .then((res) => res.json())
    .then((json) => json.results[0].members)
    .then((members) => {
      console.log(members)
      let array = [];
      members.forEach((member, id) => {
        array.push(<ItemList person={member} key={id} />);
      });
      this.setState({
        members: array
      })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Programming Exercise</h1>
        </header>
        <section className="container">
          <div className="list-group">
            {this.state.members}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
