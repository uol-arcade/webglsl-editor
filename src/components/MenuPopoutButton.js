import React from 'react'
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome'

export default class MenuPopoutButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div title={this.props.title} onClick={this.props.onClick} className="menu-popout"><FontAwesomeIcon icon={this.props.icon} /></div>;
    }
}