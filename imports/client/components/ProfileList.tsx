import * as PropTypes from 'prop-types';
import * as React from 'react';
import { _ } from 'meteor/underscore';
import * as Alert from 'react-bootstrap/lib/Alert';
import * as Button from 'react-bootstrap/lib/Button';
import * as ControlLabel from 'react-bootstrap/lib/ControlLabel';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as FormGroup from 'react-bootstrap/lib/FormGroup';
import * as InputGroup from 'react-bootstrap/lib/InputGroup';
import * as ListGroup from 'react-bootstrap/lib/ListGroup';
import * as ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import * as RRBS from 'react-router-bootstrap';
import ProfilesSchema, { ProfileType } from '../../lib/schemas/profiles';

interface ProfileListProps {
  huntId?: string;
  canInvite?: boolean;
  profiles: ProfileType[];
}

interface ProfileListState {
  searchString: string;
}

class ProfileList extends React.Component<ProfileListProps, ProfileListState> {
  static propTypes = {
    huntId: PropTypes.string,
    canInvite: PropTypes.bool,
    profiles: PropTypes.arrayOf(
      PropTypes.shape(
        ProfilesSchema.asReactPropTypes()
      ).isRequired
    ).isRequired,
  };

  state = {
    searchString: '',
  };

  // The type annotation on FormControl is wrong here - the event is from the
  // input element, not the FormControl React component
  onSearchStringChange = (e: React.FormEvent<FormControl>) => {
    this.setState({
      searchString: (e as unknown as React.FormEvent<HTMLInputElement>).currentTarget.value,
    });
  };

  compileMatcher = () => {
    const searchKeys = this.state.searchString.split(' ');
    const toMatch = _.chain(searchKeys)
      .filter(s => !!s)
      .map(s => s.toLowerCase())
      .value();
    const isInteresting = (profile: ProfileType) => {
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
  };

  clearSearch = () => {
    this.setState({
      searchString: '',
    });
  };

  inviteToHuntItem = () => {
    if (!this.props.huntId || !this.props.canInvite) {
      return null;
    }

    return (
      <RRBS.LinkContainer to={`/hunts/${this.props.huntId}/hunters/invite`}>
        <ListGroupItem>
          <strong>Invite someone...</strong>
        </ListGroupItem>
      </RRBS.LinkContainer>
    );
  };

  globalInfo = () => {
    if (this.props.huntId) {
      return null;
    }

    return (
      <Alert bsStyle="info">
        This shows everyone registered on Jolly Roger, not just those hunting in this year&apos;s
        Mystery Hunt. For that, go to the hunt page and click on &quot;Hunters&quot;.
      </Alert>
    );
  };

  render() {
    const profiles = _.filter(this.props.profiles, this.compileMatcher());
    return (
      <div>
        <h1>List of hunters</h1>
        <div className="profiles-summary">
          <div>
            Total hunters:
            {' '}
            {this.props.profiles.length}
          </div>
        </div>

        <FormGroup>
          <ControlLabel htmlFor="jr-profile-list-search">
            Search
          </ControlLabel>
          <InputGroup>
            <FormControl
              id="jr-profile-list-search"
              type="text"
              placeholder="search by name..."
              value={this.state.searchString}
              onChange={this.onSearchStringChange}
            />
            <InputGroup.Button>
              <Button onClick={this.clearSearch}>
                Clear
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>

        {this.globalInfo()}

        <ListGroup>
          {this.inviteToHuntItem()}
          {profiles.map(profile => (
            <RRBS.LinkContainer key={profile._id} to={`/users/${profile._id}`}>
              <ListGroupItem>
                {profile.displayName || '<no name provided>'}
              </ListGroupItem>
            </RRBS.LinkContainer>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default ProfileList;