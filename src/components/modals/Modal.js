import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default class Modal extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onClick(event)
    {
        //Terrible, needs fixing desperately
        //TODO: FIX THIS
        //..

        if(event.target.className == "ui-modal")
            this.props.onCancel();

        //Especially this part, GOSH:
        //..

        if(document.querySelector(".top-bar")?.contains(event.target))
            this.props.onCancel();
    }

    render()
    {
        return <div className="ui-modal" onClick={this.onClick.bind(this)}>
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