import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog, faTimes } from '@fortawesome/free-solid-svg-icons'


export default class StatusBox extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            status: "pass",
            title: "Compiled!"
        }

        this.statusObj = {};
    }

    setCompileStatus(statusObj, status, title)
    {
        this.statusObj = statusObj;

        this.setState({ status: status, title: title });
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

        if(this.state.status)
            className = this.state.status;

        return (
            <div className={`status-box ${className}`}>
                <span>{this.getIconFromStatus(this.state.status)}</span>
                <span>{this.state.title}</span>
            </div>
        );
    }
}