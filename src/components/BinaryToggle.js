import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

//Redux
import { connect } from 'react-redux'
import { toggleChangedMessage } from '../redux/actions'
import { getPreviewMode } from '../redux/selectors'

class BinaryToggle extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    handleOnClick()
    {
        //Dispatch
        this.props.toggleChangedMessage();
    }

    render()
    {
        let icons = this.props.icons.map((x, i) => 
        {
            let className = (this.props.previewMode == this.props.keys[i]) ? ("selected") : (null);
            return <span key={i} className={className}><FontAwesomeIcon  icon={x}/></span>;
        });

        return (
            // <div title="Preview Mode" onClick={this.props.onClick} className="binary-toggle">
            <div title="Preview Mode" onClick={this.handleOnClick.bind(this)} className="binary-toggle">
                {icons}
            </div>
        );
    }
}

const mapStateToProps = store => 
{
    const previewMode = getPreviewMode(store);

    return {
        previewMode: previewMode
    }
}

export default connect(mapStateToProps, { toggleChangedMessage })(BinaryToggle);