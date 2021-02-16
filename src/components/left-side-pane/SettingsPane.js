import React from 'react'
import Checkbox from '../ui/CheckBox'

export default class SettingsPane extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onChangeTransparent(status)
    {
        console.log(status);
    }

    render()
    {
        return <div className="left-pane settings">
            <h1>Settings</h1>
            <Checkbox title="Transparent background?" onChange={this.onChangeTransparent.bind(this)}/>
        </div>;
    }
}