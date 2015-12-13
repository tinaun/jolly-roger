const {
  IndexRedirect,
  Route,
  Router,
} = ReactRouter;

const history = ReactRouter.history.useQueries(ReactRouter.history.createHistory)();

Routes = React.createClass({
  render() {
    return (
      <Router history={history}>
        {/* Authenticated routes */}
        <Route path="/" component={Authenticator} authenticated={true}>
          <IndexRedirect to="hunts"/>
          <Route path="" component={App}>
            <Route path="hunts" component={HuntList}/>
          </Route>
        </Route>
        {/* Unauthenticated routes */}
        <Route path="/" component={Authenticator} authenticated={false}>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
    );
  },
});