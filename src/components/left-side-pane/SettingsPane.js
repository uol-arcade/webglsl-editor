import React from 'react'
import Checkbox from '../ui/CheckBox'

export default class SettingsPane extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div className="left-pane settings">
            <h1>Settings</h1>
            <Checkbox/>
        </div>;
    }
}