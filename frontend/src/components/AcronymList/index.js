import PropTypes from 'prop-types'
import _ from 'lodash'
import React, {Component} from 'react'
import {Card, Icon, Label, Button} from "semantic-ui-react";
import Linkify from 'react-linkify';
import axios from 'axios'
import {API_URL} from '../index'

const validURL = (url) =>  {
  var isValidUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return isValidUrl.test(url)
}

class AcronymList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
  }

  goToLink = (url) => {
    window.open(url, "_blank")
  }

  getAcronyms = () => {
    axios.get(`${API_URL}/${this.props.foundAcronym.type}/${this.props.foundAcronym.acronym}`).then(({data}) => {
      this.setState({data: data.data})
    })
  }

  getdata = (type, acronym, content) => {
    const request = new Request(`${API_URL}/${type}/${acronym}`, {
      mode: "cors", // no-cors, cors, *same-origin
    	headers: new Headers({
    		'Content-Type': content
    	})
    });
    fetch(request).then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${acronym}.${content== 'application/ld+json' ? 'json':'ttl'}`);

      // 3. Append to html page
      document.body.appendChild(link);

      // 4. Force download
      link.click();

      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
    })

  }

  componentWillMount() {
    this.getAcronyms()
  }

  componentDidUpdate(prevProps) {
    if (this.props.foundAcronym !== prevProps.foundAcronym) {
      this.getAcronyms()
    }
  }

  renderButton(url){
    if (validURL(url)) {
      return (<Button
      onClick={() => {this.goToLink(url)}}
      size="mini"
      color="green"
      icon="linkify"
      label="Find out More"
      labelPosition="left"
      floated="right"/>)
    } else {
      return (<Button
      disabled
      size="mini"
      color="green"
      icon="linkify"
      label="Find out More"
      labelPosition="left"
      floated="right"/>)
    }
  }

  statusRender(status) {
    if (status == "In Use") {
      return "teal"
    } else {
      return "grey"
    }
  }

  render() {

    return (<div>
      {
        this.state && this.state.data && this.state.data.map(item =>
        <Card key={item.index}>
          <Card.Content >
          <Label size="small" attached='top'>
              {item.acronymtype}
          </Label>
            <Card.Header>{item.title}</Card.Header>
            <Card.Meta>{item.fullname}</Card.Meta>
            <Card.Description>
              <Linkify>{item.description}</Linkify>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Label className="adjustedLabel" color={this.statusRender(item.status)} size="small">
              {item.status}
               <Label.Detail>{item.language}</Label.Detail>
            </Label>
            {this.renderButton(item.url)}

          </Card.Content>
          <Card.Content extra>
          <p>For the <strong><a alt="FAIR principles" href="https://www.force11.org/fairprinciples">FAIR</a></strong> data advocate in you</p>
            <div className='ui two buttons'>
            <Button
            onClick={() => {this.getdata(item.acronymtype, item.title, 'application/n-quads')}}
            basic
            color='green'>
              RDF/N-Quads
            </Button>
            <Button
            onClick={() => {this.getdata(item.acronymtype, item.title, 'application/ld+json')}}
            basic
            color='teal'>
              JSON-LD
            </Button>
            </div>
          </Card.Content>
        </Card>)
      }
    </div>);
  }
}

export default AcronymList;
