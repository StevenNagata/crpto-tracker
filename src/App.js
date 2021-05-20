import React, { Component, useCallback } from 'react';
import './App.css';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { Button, Dropdown, Menu, Label, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../node_modules/react-vis/dist/style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
      isAuth: false,
      user: null,
    };
  }
  componentDidMount() {
    let path = window.location.pathname.slice(1);
    if (localStorage.getItem('user')) {
      this.setState({
        isAuth: true,
        user: JSON.parse(localStorage.getItem('user')),
        activeItem: path,
      });
    } else {
      if (path === 'login') {
        this.setState({ activeItem: path, isAuth: false });
      } else {
        this.setState({ activeItem: path, isAuth: true });
      }
    }
  }
  handleItemClick = (e, { name }) => {
    if (name !== 'login') {
      this.setState({ activeItem: name, isAuth: true });
    } else {
      this.setState({ activeItem: name, isAuth: false });
    }
  };
  changeState = (type, value, id, stateId) => {
    fetch(`/${type}${id ? `/${id}` : ''}`, {
      method: 'put',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(value),
    })
      .then((resp) => resp.json())
      .then((data) => {
        this.setState({ [stateId]: data });
      });
  };
  handleLogin = async (callback, username, password) => {
    try {
    } catch (err) {
      console.log(err);
      callback(400);
    }
    let user = await fetch(
      `${process.env.REACT_APP_API_URL}/v2/user/${username}/${password}`
    ).then((resp) => resp.json());
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.setState({ isAuth: true, user, activeItem: 'home' });
      callback(200);
    } else {
      callback(400);
    }
  };
  updateUserProfile = (callback, info) => {
    let updatedUser = Object.assign({}, this.state.user);
    updatedUser.name = info.name;
    updatedUser.phoneNum = info.phone;

    console.log(JSON.stringify(updatedUser))
    console.log(`${process.env.REACT_APP_API_URL}/v2/user-update/${updatedUser._id}`)
    fetch('https://vert-spread-backend.herokuapp.com/v2/user-update/5f9f06322d2faaadd255f715', {
      method: 'POST',
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify({name: info.name, phoneNum: info.phone})
    })
      .then((resp) =>  {
        console.log(resp)
        return resp.json()
      })
      .then((data) => {

        console.log(data)
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(data));
        this.setState({ user: data });
        callback(200);
      })
      .catch((err) => {
        console.log(err)
      });
  };
  render() {
    if(!this.state.user) {
      return null
    }
    const { activeItem } = this.state;
    return (
      <div>
        <BrowserRouter>
          <div style={{ display: 'flex' }}>
            {this.state.isAuth && (
              <Menu pointing secondary inverted vertical>
                <Link
                  onClick={() => this.setState({ activeItem: 'home' })}
                  to="/"
                >
                  <Menu.Item name="home" active={activeItem === 'home'} />
                </Link>

                <Link
                  onClick={() => this.setState({ activeItem: 'profile' })}
                  to="/profile"
                >
                  <Menu.Item name="Profile" active={activeItem === 'profile'} />
                </Link>

                <Link
                  onClick={() => {
                    localStorage.removeItem('user');
                    this.setState({ activeItem: 'login', isAuth: false });
                  }}
                  to="/login"
                >
                  <Menu.Item name="Logout" active={activeItem === 'login'} />
                </Link>
              </Menu>
            )}

            {/* <Menu fixed='top' size="tiny">
            <Menu.Item
              name="home"
              active={activeItem === "home"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="messages"
              active={activeItem === "messages"}
              onClick={this.handleItemClick}
            />

            <Menu.Menu position="right">

              <Menu.Item
                name="Profile"
                active={activeItem === "profile"}
                onClick={this.handleItemClick}
              />
              <Menu.Item>
                <Button primary>Sign Up</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu> */}

            <div
              style={{
                position: 'relative',
                width: '100%',
                padding: '1rem 2rem',
              }}
            >
              <Routes
                removeFromWatchlist={this.removeFromWatchlist}
                updateUserProfile={this.updateUserProfile}
                handleLogin={this.handleLogin}
                userInfo={this.state.user}
                updateAppState={this.changeState}
              />
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

// {
//   "users": [
//     {
//       "id": 1,
//       "username": "nagata.steven1@gmail.com",
//       "password": "123456",
//       "name": "Steven Nagata",
//       "phone": "+1(593) 393-3302",
//       "watchList": {
//         "AAPL": {
//           "name": "Apple Inc",
//           "notifications": {
//               "doji": true,
//               "hammer": false,
//               "inverseHammer": true,
//               "bullishEngulfing": true
//             },
//           "hisotry": [
//             {
//               "date": "2020-06-01",
//               "type": "doji"
//             }
//           ]
//         }
//       }
//     }
//   ]
// }
