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
      membersToShow: [],
      parties: [],
      states: [],
      years: [],
      genders: []
    };
  }

  searchMembers(members) {
    let value = document.getElementById('search-input').value;
    let party = document.getElementById('filterParty').value;
    let state = document.getElementById('filterState').value;
    let year = document.getElementById('filterYear').value;
    let gender = document.getElementById('filterGender').value;
    let values = members.filter(item => {
      let fullName = item.props.person.first_name + ' ' + (item.props.person.middle_name ? (item.props.person.middle_name + ' ') : '') + item.props.person.last_name;
      let matchParty = party === '' || item.props.person.party === party;
      let matchState = state === '' || item.props.person.state === state;
      let matchYear = year === '' || item.props.person.next_election === year;
      let matchGender = gender === '' || item.props.person.gender === gender;
      let nameMatch = value === '' || value.split(' ').reduce((resp, val) => {
        let matchName = fullName.toLowerCase().match(val.toLowerCase()) !== null;
        return resp && matchName;
      }, true);
      return matchParty && matchState && matchYear && matchGender && nameMatch;
    });
    this.setState({
      membersToShow: values
    });
  }

  getFilters(members) {
    let parties = [];
    let states = [];
    let years = [];
    let genders = [];
    members.forEach(member => {
      if (parties.indexOf(member.party) === -1 && member.party) {
        parties.push(member.party);
      }
      if (states.indexOf(member.state) === -1 && member.state) {
        states.push(member.state);
      }
      if (years.indexOf(member.next_election) === -1 && member.next_election) {
        years.push(member.next_election);
        console.log(member.next_election)
      }
      if (genders.indexOf(member.gender) === -1 && member.gender) {
        genders.push(member.gender);
      }
    });
    this.setState({
      parties: parties,
      states: states,
      years: years,
      genders: genders
    });
  }

  OptionList(options) {
      // const options = props.options;
      const listItems = options.map((option) =>
        <option value={ option } key={ option }>
            { option }
        </option>
      );
      return listItems;
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
        array.push(<ItemList person={ member } key={ id } />);
      });
      this.setState({
        members: array.slice(0),
        membersToShow: array.slice(0)
      });
      this.getFilters(members);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <h1 className="App-title">React Programming Exercise</h1>
        </header>
        <section className="container">
          <div className="mt-4" id="collapseExample">
            <div className="container">
              <form>
                <div className="form-row">
                  <div className="form-group col-xs-9 col-md-9">
                    <input id="search-input" className="form-control" type="text" placeholder="Search"></input>
                  </div>
                  <div className="form-group col-xs-3 col-md-3">
                    <button className="btn btn-block btn-primary" type="button" onClick={ (e) => this.searchMembers(this.state.members) }>Search</button>
                  </div>
                  </div>

                  <div className="form-row" id="filter">
                  <div className="form-group col-sm-3 col-xs-6">
                    <select id="filterParty" data-filter="make" className="filter-make filter form-control">
                      <option value="">Filter By Party</option>
                      { this.OptionList(this.state.parties) }
                    </select>
                  </div>
                  <div className="form-group col-sm-3 col-xs-6">
                    <select id="filterState" data-filter="model" className="filter-model filter form-control">
                      <option value="">Filter By State</option>
                      { this.OptionList(this.state.states) }
                    </select>
                  </div>
                  <div className="form-group col-sm-3 col-xs-6">
                    <select id="filterYear" data-filter="type" className="filter-type filter form-control">
                      <option value="">Filter By Year of Next Election</option>
                      { this.OptionList(this.state.years) }
                    </select>
                  </div>
                  <div className="form-group col-sm-3 col-xs-6">
                    <select id="filterGender" data-filter="price" className="filter-price filter form-control">
                      <option value="">Filter By Gender</option>
                      { this.OptionList(this.state.genders) }
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="list-group">
            { this.state.membersToShow }
          </div>
        </section>
      </div>
    );
  }
}

export default App;
