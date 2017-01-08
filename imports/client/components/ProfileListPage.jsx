import React from 'react';
import { _ } from 'meteor/underscore';
import BS from 'react-bootstrap';
import RRBS from 'react-router-bootstrap';
import { JRPropTypes } from '/imports/client/JRPropTypes.js';
import { navAggregatorType } from '/imports/client/components/NavAggregator.jsx';
import { ReactMeteorData } from 'meteor/react-meteor-data';

const ProfileList = React.createClass({
  propTypes: {
    profiles: React.PropTypes.arrayOf(
      React.PropTypes.shape(
        Schemas.Profiles.asReactPropTypes()
      ).isRequired
    ).isRequired,
  },

  getInitialState() {
    return {
      searchString: '',
    };
  },

  onSearchStringChange(e) {
    this.setState({
      searchString: e.target.value,
    });
  },

  compileMatcher() {
    const searchKeys = this.state.searchString.split(' ');
    const toMatch = _.chain(searchKeys)
                     .filter((s) => !!s)
                     .map((s) => s.toLowerCase())
                     .value();
    const isInteresting = (profile) => {
      for (let i = 0; i < toMatch.length; i++) {
        const searchKey = toMatch[i];
        if (profile.displayName.toLowerCase().indexOf(searchKey) === -1 &&
            profile.primaryEmail.toLowerCase().indexOf(searchKey) === -1 &&
            (!profile.slackHandle || profile.slackHandle.toLowerCase().indexOf(searchKey) === -1) &&
            (!profile.phoneNumber || profile.phoneNumber.toLowerCase().indexOf(searchKey) === -1)) {
          return false;
        }
      }

      return true;
    };

    return isInteresting;
  },

  clearSearch() {
    this.setState({
      searchString: '',
    });
  },

  render() {
    const profiles = _.filter(this.props.profiles, this.compileMatcher());
    return (
      <div>
        <h1>List of hunters</h1>
        <div className="profiles-summary">
          <div>Total hunters: {this.props.profiles.length}</div>
        </div>

        <BS.FormGroup>
          <BS.ControlLabel htmlFor="jr-profile-list-search">
            Search
          </BS.ControlLabel>
          <BS.InputGroup>
            <BS.FormControl
              id="jr-profile-list-search"
              type="text"
              placeholder="search by name..."
              value={this.state.searchString}
              onChange={this.onSearchStringChange}
            />
            <BS.InputGroup.Button>
              <BS.Button onClick={this.clearSearch}>
                Clear
              </BS.Button>
            </BS.InputGroup.Button>
          </BS.InputGroup>
        </BS.FormGroup>

        <BS.ListGroup>
          {profiles.map((profile) => (
            <RRBS.LinkContainer key={profile._id} to={`/users/${profile._id}`}>
              <BS.ListGroupItem>
                {profile.displayName || '<no name provided>'}
              </BS.ListGroupItem>
            </RRBS.LinkContainer>
          ))}
        </BS.ListGroup>
      </div>
    );
  },
});

const ProfileListPage = React.createClass({
  contextTypes: {
    subs: JRPropTypes.subs,
    navAggregator: navAggregatorType,
  },

  mixins: [ReactMeteorData],

  getMeteorData() {
    const profilesHandle = this.context.subs.subscribe('mongo.profiles');
    const ready = profilesHandle.ready();
    const profiles = ready ? Models.Profiles.find({}, { sort: { displayName: 1 } }).fetch() : [];
    return {
      ready,
      profiles,
    };
  },

  render() {
    let body;
    if (!this.data.ready) {
      body = <div>loading...</div>;
    } else {
      body = <ProfileList profiles={this.data.profiles} />;
    }

    return (
      <this.context.navAggregator.NavItem
        itemKey="users"
        to="/users"
        label="Users"
      >
        {body}
      </this.context.navAggregator.NavItem>
    );
  },
});

export { ProfileListPage };
