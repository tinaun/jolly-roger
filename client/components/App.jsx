const BS = ReactBootstrap;
const {Link} = ReactRouter;

App = React.createClass({
  render() {
    return (
      <div>
        <BS.Navbar fixedTop>
          <BS.Navbar.Header>
            <BS.Navbar.Brand>
              <Link to="/">
                <img src="/images/brand.png"/>
              </Link>
            </BS.Navbar.Brand>
          </BS.Navbar.Header>
          <BS.Navbar.Collapse>
            {/* TODO: Construct some sort of breadcrumbs here? */}
            <BS.Nav>
              <li className={this.props.location.pathname == '/hunts' && 'active'}>
                <Link to="/hunts">
                  All hunts
                </Link>
              </li>
            </BS.Nav>
            <BS.Nav pullRight>
              <BlazeToReact blazeTemplate="atNavButton"/>
            </BS.Nav>
          </BS.Navbar.Collapse>
        </BS.Navbar>

        <div className="container">
          <ConnectionStatus/>

          {this.props.children}
        </div>
      </div>
    );
  },
});