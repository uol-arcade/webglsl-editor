import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


export default class Checkbox extends React.Component
{
    constructor(props)
    {
        super(props);

        const defaultValue = props.defaultValue;

        this.state = { checked: defaultValue }
    }

    onClick()
    {
        this.setState({ checked: !this.state.checked });

        if(this.props.onChange)
            this.props.onChange(this.props.inputKey, !this.state.checked);
    }

    render()
    {

        let icon = <FontAwesomeIcon icon={faCheck} />
        let className = "";

        if(this.state.checked)
        {
            icon = <FontAwesomeIcon icon={faCheck} />
            className = "checked"
        }

        return <div className={`ui checkbox ${className}`} onClick={this.onClick.bind(this)}>
            {icon}
            <p>{this.props.title}</p>
        </div>;
    }
}