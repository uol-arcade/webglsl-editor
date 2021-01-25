import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

export default class BinaryToggle extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        let icons = this.props.icons.map((x, i) => 
        {
            let className = (this.props.selected == this.props.keys[i]) ? ("selected") : (null);
            return <span key={i} className={className}><FontAwesomeIcon  icon={x}/></span>;
        });

        return (
            <div title="Preview Mode" onClick={this.props.onClick} className="binary-toggle">
                {icons}
            </div>
        );
    }
}