import React, { Component } from 'react'
import {Header, Segment, Image, Container, Message, Sticky, Grid} from 'semantic-ui-react'

import {Navbar, AcronymSearch, AcronymList} from 'components'
import 'styling/semantic.less'
import 'styling/custom.less'

// import logo from 'resources/logo.svg'

const leftItems = [
  {
    as: 'a',
    content: 'Google',
    href: 'https://google.com/',
    icon: 'feed',
    key: 'google',
    target: '_blank'
  }
]
const rightItems = [
   {
    as: 'a',
    content: 'Github',
    icon: 'github',
    href: 'https://github.com/',
    key: 'github',
    target: '_blank'
  }
]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.foundAcronymHandler = this.foundAcronymHandler.bind(this);
    this.state = {
        foundAcronym: null
    }
  }

  foundAcronymHandler = (result) => {
      this.setState({ foundAcronym: result });
  }

  render() {
    const test = this.state.foundAcronym
    let results

    if ( test === null ) {
      results = null
    } else {
      results = <AcronymList foundAcronym={this.state.foundAcronym} />
    }
    return (<Container>
    <Navbar leftItems={leftItems} rightItems={rightItems}>
    </Navbar>
    <Grid>
    <Grid.Column width={10}>
    <Segment basic textAlign='left'>
      <Header as='h1'>
        {/* <Image src={logo}/> */}
        <Header.Content>
        Acronym Finder
        <Header.Subheader>the meaning behind that buzzword</Header.Subheader>
        </Header.Content>
      </Header>
      <AcronymSearch foundData={this.foundAcronymHandler}/>
    </Segment>
    {results}
    </Grid.Column>
    <Grid.Column width={6} />
    </Grid>

    <Message success compact id="acknowledge">This is a prototype.
     By using this service you accept that you might not find everything and that things are ephemeral.
     </Message>
    </Container>);
  }
}

export default App;
