import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../redux/selectors'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCog, faTimes } from '@fortawesome/free-solid-svg-icons'

import * as GLSLCompiler from '../glsl/compiler/GLSLCompiler'

const STATUS_BOX_DATA = 
{
    [GLSLCompiler.COMPILE_STATUS_FAIL]:
    {
        icon: <FontAwesomeIcon icon={faTimes} />,
        className: "fail",
        title: "Failed"
    },

    [GLSLCompiler.COMPILE_STATUS_PASS]:
    {
        icon: <FontAwesomeIcon icon={faCheck} />,
        className: "pass",
        title: "Pass"
    },

    [GLSLCompiler.COMPILE_STATUS_COMPILING]:
    {
        icon: <FontAwesomeIcon className="spin" icon={faCog} />,
        className: "neutral",
        title: "Compiling..."
    }
}

class StatusBox extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    getDataFromCompileStatus(status)
    {
        return STATUS_BOX_DATA[status];
    }

    getErrorCount()
    {
        if(!this.props.errors)
            return 0;
        else
            return this.props.errors.length;
    }


    render()
    {
        //Get status from compile status
        const compileStatusData = this.getDataFromCompileStatus(this.props.compileStatus);

        //Error counter element is null initially
        let errorCountElement = null;
        
        //Get title
        let title = compileStatusData.title;

        //More than 0 errors? Show a little count
        if(this.props.compileStatus === GLSLCompiler.COMPILE_STATUS_FAIL && this.getErrorCount() > 0)
        {
            //Show a count
            errorCountElement = <span className="error-count"><p>{this.getErrorCount()}</p></span>;

            //And change title to first error
            title = this.props.errors[0];
        }

        return (
            <div title="Compile Status" className={`status-box ${compileStatusData.className}`}>
                <span>{compileStatusData.icon}</span>
                {errorCountElement}
                <span>{title}</span>
            </div>
        );
    }
}

const mapStateToProps = store =>
{
    return { 
        errors:        selectors.getPrettyErrors(store),
        compileStatus: selectors.getCompileStatus(store)
    };
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(StatusBox);