import React, { Component } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

export default class MyModal extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  handleAccept = () => {
    this.props.handleAccept();
    this.handleClose();
  };
  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  render() {
    return (
      <Modal
        trigger={
          <Button basic color='red' inverted onClick={this.handleOpen}>{this.props.buttonLabel}</Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size="small"
      >
        {/* <Header icon="browser" content="Cookies policy" /> */}
        <Modal.Content>
          <h3 style={{color: 'white'}}>{this.props.modalMessage}</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={() => this.setState({modalOpen: false})} inverted>
            <Icon name="remove" /> No
          </Button>
          <Button loading={this.props.isLoading} color="green" onClick={this.handleAccept} inverted>
            <Icon name="checkmark" /> Accept
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
