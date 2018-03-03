import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Button, StyleSheet, Text, View } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { dispatchSignInWithGoogle, dispatchSignInWithFacebook } from '../auth/actions';


class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      password:'',
    };
  }
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };
  static navigationOptions = {
    title: 'Log In',
  };
  render(){
    let {email, password} = this.state;
    let {isLoginPending, isLoggedIn, loginError, navigation} = this.props;
    return (
      <Container>
        {(isLoginPending)? 
          <Content>
            <Text style={{textAlign: 'center'}}>Signing in...</Text>
          </Content> :
          <Content>
            <Button block primary onPress={this.props.signinWithGoogle} >
              <Text>Sign In With Google</Text>
            </Button>

            <Text>...</Text>

            <Button onPress={this.props.signinWithFacebook} >
              <Text>Sign In With Facebook</Text>
            </Button>

            <Text>
              {isLoginPending? "Login pending...":"--"}
              {isLoggedIn? "Logged in":"Not logged in"}
              {loginError && loginError.toString()}
            </Text>
          </Content> 
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoginPending: state.auth.isLoginPending,
    isLoggedIn: state.auth.isLoggedIn,
    loginError: state.auth.loginError,
  };
}

const mapDispatchToProps = {
  signinWithGoogle: dispatchSignInWithGoogle,
  signinWithFacebook: dispatchSignInWithFacebook,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
