import React, { Component } from 'react';
import { Segment, Input, Form, Button } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import { withSnackbar } from 'notistack';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSave = (e) => {
    e.preventDefault();

    this.props.updateUserProfile((resp) => {
      if(resp === 200) {
        console.log('success')
      }
    },{
      name: e.target.name.value,
      phone: e.target.phone.value,
    })
  };
  render() {
    if (!this.props.userInfo) {
      return null;
    }
    return (
      <div>
        <Segment color="grey">
          <h2>Profile</h2>

          <Form onSubmit={this.handleSave}>
            <Form.Field>
              <label>Name</label>

              <Form.Input
                id="name"
                width={8}
                defaultValue={
                  this.props.userInfo ? this.props.userInfo.name : ''
                }
              />
            </Form.Field>

            <Form.Field>
              <label>Mobile Number</label>
              <InputMask
                mask="+1(999) 999-9999"
                maskChar=" "
                defaultValue={
                  this.props.userInfo ? this.props.userInfo.phoneNum : ''
                }
              >
                {() => (
                  <Form.Input
                    id="phone"
                    width={8}
                    icon="phone"
                    iconPosition="left"
                  />
                )}
              </InputMask>
            </Form.Field>
            <Button type="submit" color="black">
              Save
            </Button>
          </Form>
        </Segment>
      </div>
    );
  }
}

export default withSnackbar(Profile);
