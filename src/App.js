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
      session: 115,
      chamber: 'senate',
      members: [],
      membersToShow: [],
      searchResults: [],
      parties: [],
      states: [],
      years: [],
      genders: [],
      pages: [],
      resultsPerPage: 20,
      actualPage: 1,
      lastPage: 1
    };
  }

  componentDidMount() {
    this.callAPI();
  }

  searchMembers(members) {
    let value = document.getElementById('search-input').value;
    let party = document.getElementById('filterParty').value;
    let state = document.getElementById('filterState').value;
    let year = document.getElementById('filterYear').value;
    let gender = document.getElementById('filterGender').value;
    if (value || party || state || year || gender) {
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
        searchResults: values,
        actualPage: 1,
        lastPage: Math.ceil(values.length / this.state.resultsPerPage) || 1
      });
    } else {
      this.setState({
        searchResults: [],
        actualPage: 1,
        lastPage: 1
      });
    }
    setTimeout(() => {
      this.showResults();
    }, 0);
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

  callAPI() {
    if (document.getElementById('loader')) {
      document.getElementById('loader').classList.add('modal', 'fade', 'show');
    }
    fetch(`https://api.propublica.org/congress/v1/${this.state.session}/${this.state.chamber}/members.json`, {
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
        lastPage: Math.ceil(array.length / this.state.resultsPerPage)
      });
      this.showResults();
      this.getFilters(members);
      if (document.getElementById('loader')) {
        document.getElementById('loader').classList.remove('modal', 'fade', 'show');
      }
    });
  }

  updateResultsPerPage(number) {
    this.setState({
      resultsPerPage: number,
      actualPage: 1
    });
  }

  changePage(_this, e) {
    _this.setState({
      actualPage: Number(e.currentTarget.text)
    });
    setTimeout(() => {
      _this.showResults();
    }, 10);
  }

  updatePages() {
    let pages = [];
    let initPage = this.state.actualPage - 2 < 1 ? 1 : this.state.actualPage - 2;
    let lastPage = initPage + 4 > this.state.lastPage ? this.state.lastPage : initPage + 4;
    if (initPage + 4 > this.state.lastPage) {
      initPage = lastPage - 4 < 1 ? 1 : lastPage - 4;
    }
    for (var i = initPage - 1; i < lastPage; i++) {
      let classes = 'page-item' + (i + 1 === this.state.actualPage ? ' disabled' : '');
      pages.push(<li className={ classes } key={ i }><a className="page-link" href="#" onClick={ (e) => this.changePage(this, e) }>{ i + 1 }</a></li>);
    }
    this.setState({
      pages: pages
    });
  }

  showResults() {
    let init = (this.state.actualPage - 1) * this.state.resultsPerPage;
    let results = this.state.searchResults.length ? this.state.searchResults : this.state.members;
    this.setState({
      membersToShow: results.slice(init, init + this.state.resultsPerPage)
    });
    setTimeout(() => {
      this.updatePages();
    }, 10);
  }

  openModal(_this) {
    let setting = document.getElementById('collapseSetting');
    document.getElementById('resultsPerPage').value = _this.state.resultsPerPage;
    setting.classList.remove('collapse');
  }

  closeModal() {
    let setting = document.getElementById('collapseSetting');
    setting.classList.add('collapse');
  }

  saveSettings(_this) {
    let resultsPerPage = Number(document.getElementById('resultsPerPage').value);
    let chamber = document.getElementById('chamber').value;
    let session = Number(document.getElementById('session').value);
    let changeConfig = (chamber !== _this.state.chamber) || (session !== _this.state.session);
    _this.setState({
      session: session,
      chamber: chamber,
      resultsPerPage: resultsPerPage,
      actualPage: 1,
      lastPage: Math.ceil((this.state.searchResults.length || this.state.members.length) / resultsPerPage),
      members: changeConfig ? [] : this.state.members,
      membersToShow: changeConfig ? [] : this.state.membersToShow,
      searchResults: changeConfig ? [] : this.state.searchResults
    });
    _this.closeModal();
    setTimeout(() => {
      if (changeConfig) {
        this.callAPI();
      } else {
        _this.showResults();
      }
    }, 10);
  }

  changeChamber() {
    let chamber = document.getElementById('chamber').value;
    let session = document.getElementById('session');
    session.min = chamber === 'senate' ? '80' : '102';
    session.value = chamber !== 'senate' && Number(session.value) < 102 ? '102' : session.value;
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <h1 className="App-title">React Programming Exercise</h1>
          <div id="setting" className="position-absolute p-4"><i className="fas fa-cog" onClick={ (e) => this.openModal(this) }></i></div>
        </header>

        <div id="loader">
          <div className="ring">
            Loading
            <span></span>
          </div>
        </div>

        <section className="container">
          <div className="collapse" id="collapseSetting">
            <div className="card card-body">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Settings</h5>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>Results Per Page</label>
                      <input type="number" className="form-control" id="resultsPerPage" min={ 1 } defaultValue={ this.state.resultsPerPage } placeholder="Results Per Page"></input>
                    </div>
                    <div className="form-group">
                      <label>Chamber</label>
                      <select className="form-control" id="chamber" defaultValue={ this.state.chamber } onChange={ (e) => this.changeChamber(this) }>
                        <option value="senate">Senate</option>
                        <option values="house">House</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Congressional Session</label>
                      <input type="number" className="form-control" id="session" min={ 80 } max={ 115 } defaultValue={ this.state.session } placeholder="Congressional Session"></input>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={ this.closeModal }>Close</button>
                  <button type="button" className="btn btn-primary" onClick={ (e) => this.saveSettings(this) }>Save changes</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4" id="collapseSearch">
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

          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              { this.state.pages }
            </ul>
          </nav>
        </section>

      </div>
    );
  }
}

export default App;
