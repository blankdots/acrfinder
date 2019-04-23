import PropTypes from 'prop-types'
import React, {Component} from 'react'

class LongText extends Component {
    state = { showAll: false }
    render() {
        const {content, limit} = this.props;
        let results
        if(content.length<=limit) {
            // there is nothing more to show
            results=<p>{content}</p>
        } else {
          const toShow = content.substring(0,limit)+" ...";
          console.log(content)
          console.log(toShow)
          results= <p>{toShow}</p>
        }
        return(
          <div className="searchDescription">
          {results}
          </div>
        )

}
}

export default LongText;
