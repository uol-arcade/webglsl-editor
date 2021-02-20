import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default class Modal extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div className="ui-modal">
            <div className="body">
                <div className="top-bar">
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}