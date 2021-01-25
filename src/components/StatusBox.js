import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog, faTimes } from '@fortawesome/free-solid-svg-icons'


export default class StatusBox extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    
    getIconFromStatus(status)
    {
        if(status == "fail")
            return <FontAwesomeIcon icon={faTimes}/>
            
        else if(status == "pass")
            return <FontAwesomeIcon icon={faCheck}/>

        else
            return <FontAwesomeIcon className="spin" icon={faCog}/>            
    }

    render()
    {
        let className = "neutral";

        if(this.props.status)
            className = this.props.status;

        return (
            <div className={`status-box ${className}`}>
                <span>{this.getIconFromStatus(this.props.status)}</span>
                <span>{this.props.title}</span>
            </div>
        );
    }
}