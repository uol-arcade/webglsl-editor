import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../ui/CheckBox'
import { updateSettings } from '../../redux/actions'
import { update } from 'lodash';

export class SettingsPane extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onSettingsChange(key, value)
    {
        //Dispatch an action
        this.props.updateSettings(key, value);
    }

    render()
    {
        return <div className="left-pane settings">
            <h1>Settings</h1>
            <Checkbox title="Transparent background?" onChange={this.onSettingsChange.bind(this)} inputKey="transparentBackground" />
        </div>;
    }
}

export default connect(null, { updateSettings }, null, { forwardRef: true })(SettingsPane);