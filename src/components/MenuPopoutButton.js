import React from 'react'
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome'

export default class MenuPopoutButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { menuVisible: false };
    }

    componentDidMount()
    {
        window.addEventListener("click", function(event)
        {
            // TODO: Fix this. its awful
            //..

            //Get the target
            const target = event.target;

            //Check if child or this elem, if so, return
            if(document.getElementById(this.props.id).contains(target) || target == document.getElementById(this.props.id))
                return;

            //Otherwise hide
            this.setState({ menuVisible: false });
        }.bind(this))
    }

    onClick()
    {
        this.setState({ menuVisible: !this.state.menuVisible });
    }

    render()
    {
        let children = null;

        if(this.state.menuVisible)
            children = this.props.children;

        return <div title={this.props.title} onClick={this.onClick.bind(this)} id={this.props.id} className="menu-popout"><FontAwesomeIcon icon={this.props.icon} />
            {children}
        </div>;
    }
}