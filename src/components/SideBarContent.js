import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function SideBarItem(props)
{
    let innerContent = props.children;

    if(props.icon)
        innerContent = <FontAwesomeIcon icon={props.icon}/>
    
    if(props.activePane == props.paneKey)
        return <li onClick={props.onClick} className="side-bar-item active" title={props.title}>{innerContent}</li>;
    else
        return <li onClick={props.onClick} className="side-bar-item" title={props.title}>{innerContent}</li>;
}

export class SideBarContent extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div className="side-bar-content">
            {this.props.children}
        </div>;
    }
}