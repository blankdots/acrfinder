import PropTypes from 'prop-types'
import _ from 'lodash'
import React, {Component} from 'react'
import {Search, Header, Segment} from 'semantic-ui-react'
import axios from 'axios'
import {API_URL} from '../index'
import LongText from './LongText'

const categoryRenderer = ({ name }) => <span className={name}> {name} </span>

categoryRenderer.propTypes = {
  name: PropTypes.string,
}

const resultRenderer = ({ title, description, fullname}) => <div>
    <span><strong> {title} </strong> - {fullname}</span><br/>
    <LongText content={description} limit={100}/>
    </div>

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  fullname: PropTypes.string,
}


class AcronymSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      posts: []
    }
  }

  componentWillMount() {
    this.resetComponent()
  }

  getAcronyms = () => {
    axios.get(`${API_URL}/search?term=${this.state.value}`)
      .then(({ data }) => {
        this.setState({
          // isLoading: true,
          posts: data.data
        })
      })
  }


  resetComponent = () => {
    this.setState({isLoading: false, results: [], value: ''})
    this.props.foundData(null);
  }

  handleResultSelect = (e, {result}) => {
    this.setState({value: result.title})
    this.props.foundData({acronym: result.title, type: result.acronymtype});
  }

  handleResultChange = (e, {result}) => {
    this.props.foundData({acronym: result.title, type: result.acronymtype});
  }

  handleSearchChange = (e, {value}) => {
    this.setState({isLoading: true, value})

    setTimeout(() => {
      if (this.state.value.length < 1)
        return this.resetComponent()

      if (this.state.value && this.state.value.length > 1) {
          this.getAcronyms()
      }

      this.setState({isLoading: false, results: this.state.posts})
    }, 300)
  }

  render() {
    const {isLoading, value, results} = this.state

    return (<div>
      <Search
         category
         categoryRenderer={categoryRenderer}
         fluid
         size='large'
         minCharacters={2}
         loading={isLoading}
         onResultSelect={this.handleResultSelect}
         onSelectionChange={this.handleResultChange}
         onSearchChange={_.debounce(this.handleSearchChange, 400, {
           leading: true,
         })}
         resultRenderer={resultRenderer}
         results={results}
         value={value}
         {...this.props.foundData}
       />
      </div>)
  }
}

AcronymSearch.propTypes = {
  foundData: PropTypes.func
}

export default AcronymSearch;
