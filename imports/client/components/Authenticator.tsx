import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Location } from 'history';
import React from 'react';
import { browserHistory } from 'react-router';

interface AuthenticatorParams {
  route: {authenticated: boolean};
  children: React.ReactNode;
  location: Location;
}

interface AuthenticatorProps extends AuthenticatorParams {
  loggingIn: boolean;
  userId: string | null;
}

interface AuthenticatorState {
  loading: boolean;
}

class Authenticator extends React.Component<AuthenticatorProps, AuthenticatorState> {
  constructor(props: AuthenticatorProps) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.checkAuth();
  }

  componentDidUpdate() {
    this.checkAuth();
  }

  checkAuth = () => {
    if (this.state.loading) {
      if (this.props.loggingIn) {
        return;
      } else {
        this.setState({ loading: false });
      }
    }

    if (!this.props.userId && this.props.route.authenticated) {
      const stateToSave = _.pick(this.props.location, 'pathname', 'query');
      browserHistory.replace({
        pathname: '/login',
        state: stateToSave,
      });
    } else if (this.props.userId && !this.props.route.authenticated) {
      const state = _.extend({ path: '/', query: undefined }, this.props.location.state);
      browserHistory.replace({
        pathname: state.pathname,
        query: state.query,
      });
    }
  };

  render() {
    if (this.state.loading) {
      return <div />;
    }

    return React.Children.only(this.props.children);
  }
}

const AuthenticatorContainer = withTracker((_params: AuthenticatorParams) => {
  return {
    loggingIn: Meteor.loggingIn(),
    userId: Meteor.userId(),
  };
})(Authenticator);

export default AuthenticatorContainer;
