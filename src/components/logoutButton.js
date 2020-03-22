import React, { Component } from 'react'
import Utils from './utils'
import { NavLink } from 'reactstrap'

const config = require('../config-dev.json')

class LogoutButton extends Component {
  onClick () {
    console.log('Logoutcheck')
  }

  handleClick () {
    const token = window.localStorage.getItem('access_token')
        Utils.logout()
  }

  render () {
    return (
      <NavLink href='#' onClick={this.handleClick}>
        <u>Log Out</u>
      </NavLink>
    )
  }
}

export default LogoutButton
