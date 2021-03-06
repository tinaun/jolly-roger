import React from 'react';
import { BreadcrumbsProvider } from 'react-breadcrumbs-context';
import DocumentTitle from 'react-document-title';
import {
  IndexRedirect,
  Route,
  Router,
  browserHistory,
} from 'react-router';
import AllProfileListPage from './AllProfileListPage';
import AnnouncementsPage from './AnnouncementsPage';
import App from './App';
import Authenticator from './Authenticator';
import EnrollForm from './EnrollForm';
import GuessQueuePage from './GuessQueuePage';
import HuntApp from './HuntApp';
import HuntListPage from './HuntListPage';
import HuntProfileListPage from './HuntProfileListPage';
import LoginForm from './LoginForm';
import PasswordResetForm from './PasswordResetForm';
import ProfilePage from './ProfilePage';
import PuzzleListPage from './PuzzleListPage';
import PuzzlePage from './PuzzlePage';
import SetupPage from './SetupPage';
import SplashPage from './SplashPage';
import UserInvitePage from './UserInvitePage';

class Routes extends React.Component {
  render() {
    return (
      <DocumentTitle title="Jolly Roger">
        <BreadcrumbsProvider>
          <Router history={browserHistory}>
            {/* Authenticated routes */}
            {/*
             // @ts-ignore (hopefully this will go away with react-router v5 anyway) */}
            <Route path="/" component={Authenticator} authenticated>
              <IndexRedirect to="hunts" />
              <Route path="" component={App}>
                <Route path="hunts/:huntId" component={HuntApp}>
                  <Route path="announcements" component={AnnouncementsPage} />
                  <Route path="guesses" component={GuessQueuePage} />
                  <Route path="hunters" component={HuntProfileListPage} />
                  <Route path="hunters/invite" component={UserInvitePage} />
                  <Route path="puzzles/:puzzleId" component={PuzzlePage} />
                  <Route path="puzzles" component={PuzzleListPage} />
                  <IndexRedirect to="puzzles" />
                </Route>
                <Route path="hunts" component={HuntListPage} />
                <Route path="users/:userId" component={ProfilePage} />
                <Route path="users" component={AllProfileListPage} />
                <Route path="setup" component={SetupPage} />
              </Route>
            </Route>
            {/* Unauthenticated routes */}
            {/*
             // @ts-ignore (hopefully this will go away with react-router v5 anyway) */}
            <Route path="/" component={Authenticator} authenticated={false}>
              <Route path="" component={SplashPage}>
                <Route path="login" component={LoginForm} />
                <Route path="reset-password/:token" component={PasswordResetForm} />
                <Route path="enroll/:token" component={EnrollForm} />
              </Route>
            </Route>
            {/* Routes available to both authenticated and unauthenticated users */}
          </Router>
        </BreadcrumbsProvider>
      </DocumentTitle>
    );
  }
}

export default Routes;
