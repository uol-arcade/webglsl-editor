import React from 'react'
import codeExamples from '../cfg/examples.json'
import { connect } from 'react-redux'
import * as actionTypes from '../redux/actionTypes'
import axios from 'axios'

import { threejsUpdateLoadStatus } from '../redux/actions'


class ExamplesMenu extends React.Component
{
    constructor(props)
    {
        super(props);
    }


    onExampleClick(item)
    {
        //Load the shader
        this.props.loadShader(item.vert, item.frag);
    }

    getItems()
    {
        //Get categories
        const categories = Object.keys(codeExamples);
        
        //Map each category
        const mapped = categories.map(cat => {
            return <div className="category" key={cat}>
                <h1>{cat}</h1>
                <ul>
                    {
                        codeExamples[cat].map(x => 
                        {
                            return <li onClick={this.onExampleClick.bind(this, x)} key={x.title}>{x.title}</li>;
                        })
                    }
                </ul>
            </div>
        });

        //Return the mapped cats
        return mapped;
    }

    render()
    {
        //Get the items
        const items = this.getItems();
        
        return <div className="menu-popout-menu">{items}</div>;
    }
}


const mapDispatchToProps = dispatch => ({
    loadShader: (vert, frag) => dispatch(async () =>
    {
        //Dispatch load status update
        dispatch(threejsUpdateLoadStatus("loading"));

        //Get vert + frag
        const vertSrc = await axios.get(vert);
        const fragSrc = await axios.get(frag);

        //Dispatch load status update
        dispatch(threejsUpdateLoadStatus("not-loading"));

        //Dispatch with that data
        dispatch({
            type: actionTypes.ASYNC_LOAD_SHADER_EXAMPLE,
            payload: {
                vert: vertSrc.data,
                frag: fragSrc.data
            }
        })
    })
});

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(ExamplesMenu);