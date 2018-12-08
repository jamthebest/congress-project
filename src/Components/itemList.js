import React, { Component } from 'react';

class ItemList extends Component {
	getPartyClass(party) {
		return 'btn btn-' + (party === 'D' ? 'success' : party === 'I' ? 'primary' : 'info');
	}

	render() {
		return (
			<div className="card text-center mt-4">
				<div className="card-header">
					{ this.props.person.short_title } { this.props.person.first_name } { this.props.person.middle_name ? (this.props.person.middle_name + ' ') : '' }{ this.props.person.last_name }
				</div>
				<div className="card-body">
					<h5 className="card-title">
						Party: <button type="button" href="#" className={ this.getPartyClass(this.props.person.party) }>{ this.props.person.party }</button>
					</h5>
					<h5 className="card-title">
						State: <button type="button"  href="#" className="btn btn-light">{ this.props.person.state }</button>
					</h5>
					<p className="card-text">{ this.props.person.title }</p>
					<div className="btn-group" role="group">
						<a href={ 'https://www.facebook.com/' + this.props.person.facebook_account } target="_blank" className="btn social-link"><i className="fab fa-facebook-f"></i></a>
						<a href={ 'https://twitter.com/' + this.props.person.twitter_account } target="_blank" className="btn social-link"><i className="fab fa-twitter"></i></a>
						<a href={ 'https://www.youtube.com/' + this.props.person.youtube_account } target="_blank" className="btn social-link"><i className="fab fa-youtube"></i></a>
						<a href={ this.props.person.contact_form } target="_blank" className="btn social-link"><i className="fas fa-envelope"></i></a>
						<a href={ this.props.person.url } target="_blank" className="btn social-link"><i className="fas fa-globe"></i></a>
					</div>
				</div>
				<div className="card-footer text-muted">
					Next Election: <b>{ this.props.person.next_election }</b>
				</div>
			</div>
		);
	}
}

export { ItemList as default };