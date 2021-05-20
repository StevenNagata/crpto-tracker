import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { GoogleLogin } from 'react-google-login';
import { withSnackbar } from 'notistack';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      modalOpen: false,
      isLoading: false };
  }
  handleLogin = (e) => {
    this.setState({isLoading: true})
    this.props.handleLogin((status) => {
      if(status === 200) {
        this.setState({isLoading: false})
        this.props.history.push('/')
      } else {
        this.setState({isLoading: false})
        this.props.enqueueSnackbar('The email or password is incorrect', { 
          variant: 'error',
      });
      }
    },e.target.email.value,e.target.password.value)
  }
  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" style={{color: 'white'}} textAlign="center">
        Log-in to your account
          </Header>
          <Form onSubmit={this.handleLogin} size="large">
            <Segment color="grey">
              <Form.Input
              id="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
              />
              <Form.Input
                            id="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

              <Button 
              // onClick={() => {
              //     this.props.updateAppState('isAuth', true)
              //     this.props.updateAppState('activeItem', 'home')
              //     this.props.history.push('/')
              // }}
              type="submit"
              loading={this.state.isLoading}
              color="grey" 
              fluid 
              size="small">
                Login
              </Button>


              {/* <GoogleLogin
              style={{width: '100%'}}
    clientId="834056253277-a93ovtrt5v80ied47g16jq4die2428fr.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={this.responseGoogle}
    onFailure={this.responseGoogle}
    cookiePolicy={'single_host_origin'}
  /> */}
            </Segment>
          </Form>
          <Message size="small">
            Dont have an account? <a href="#">Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withSnackbar(Login);