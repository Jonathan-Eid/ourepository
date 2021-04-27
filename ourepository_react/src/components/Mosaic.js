import React from 'react';
import '../App.css';
import {
  Button, Card, CardBody, CardHeader, CardFooter, CardText, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

const {REACT_APP_PHP_DOMAIN, REACT_APP_PHP_PORT} = process.env;
const baseURL = `http://${REACT_APP_PHP_DOMAIN}:${REACT_APP_PHP_PORT}/`;

class MosaicCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      thumbnail: props.thumbnail,
      preview: props.preview,
      // name: props.name,
      // desc: props.desc,
      // details: props.details,
      // added: false,
      // openModal: false
    };

    // // what to display when course is selected
    // this.selectionText = this.state.name + ' -- ' + this.state.desc;
    //
    // this.toggleCourse = this.toggleCourse.bind(this);
    // this.toggleModal = this.toggleModal.bind(this);
  }

  // // add or remove course from selected courses
  // toggleCourse() {
  //   this.state.added ? this.props.removeCourse(this.state.id) : this.props.addCourse(this.state.id);
  //
  //   this.setState({
  //     added: !this.state.added
  //   });
  // }
  //
  // // display or dismiss informational modal
  // toggleModal() {
  //   this.setState({
  //     openModal: !this.state.openModal
  //   });
  // }

  // // render informational modal
  // renderModal() {
  //   return (
  //     <Modal isOpen={this.state.openModal} backdrop={false} fade={true}>
  //       <ModalHeader>
  //         {this.state.name}
  //         <button className="close" style={{position: 'absolute', top: '15px', right: '15px'}}
  //                 onClick={this.toggleModal}>&times;</button>
  //       </ModalHeader>
  //       <ModalBody>{this.state.details}</ModalBody>
  //       <ModalFooter>
  //         <Button color="primary" onClick={this.toggleModal}>Close</Button>
  //       </ModalFooter>
  //     </Modal>
  //   )
  // }

  render() {
    return (
      <Col className="mosaic-card">
        <Card className="m-3">
          <CardBody>
            {/*<CardHeader tag="h5">*/}
            {/*  <Row className="mosaic-card">*/}
            {/*    {this.state.name}*/}
            {/*    <img src={"information.png"} alt="information" onClick={this.toggleModal} height="10%" width="10%"/>*/}
            {/*  </Row>*/}
            {/*</CardHeader>*/}

            <img src={baseURL + this.state.thumbnail} alt="thumbnail" height="75%" width="75%"/>
            {/*<CardText>{this.state.desc}</CardText>*/}

            {/*<CardFooter>*/}
            {/*  <Button color="primary" className="add"*/}
            {/*          onClick={this.toggleCourse}>{this.state.added ? "Remove" : "Add"}</Button>*/}
            {/*</CardFooter>*/}
          </CardBody>
        </Card>

        {/*{this.renderModal()}*/}
      </Col>
    );
  }
}

export default MosaicCard;