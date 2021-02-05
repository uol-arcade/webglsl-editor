import React from 'react'
import { connect } from 'react-redux'
import CodeEditorTab from './CodeEditorTab';
import * as selectors from '../redux/selectors'

class CodeEditor extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            selectedIndex: 0,
        }

        this.editorTabs = props.children;
    }

    onTabTitleClick(idx)
    {
        //Set selected index based on this (if changed)
        if(this.state.selectedIndex === idx)
            return;

        //Otherwise set state
        this.setState({ selectedIndex: idx });

        //Call external callback if needed
        // if(this.props.onTabChange)
            // this.props.onTabChange(idx, this.props.src[]);
    }

    getTabList()
    {
        //Just map tabs
        return this.props.tabs.map(((x,i) => 
        {
            let selected = (i == this.state.selectedIndex) ? ("selected") : (null);

            return <li className={`tab ${selected}`} key={i} onClick={this.onTabTitleClick.bind(this, i)}>{x}</li>
        }).bind(this));
    }

    render()
    {
        return (
            <div className="code-editor">
                <ul>{this.getTabList()}</ul>
                {this.props.tabs.map((tab, index) => 
                {
                    if(index != this.state.selectedIndex)
                        return undefined;

                    return <CodeEditorTab title={tab} defaultSrc={this.props.src[tab]} />
                })}
            </div>
        );

        // return (
        //     <div className="code-editor">
        //         <ul>{this.getTabList()}</ul>
        //         {this.props.children.map(((child, index) => 
        //         {
        //             if(index != this.state.selectedIndex) 
        //                 return undefined;

        //             return child;
        //         }).bind(this))}
        //     </div>
        // );
        //// <CodeEditorTab errors={this.state.errors?.vert} onChange={this.onVertexShaderChange.bind(this)}   title="Vertex"   defaultSrc={this.tempVertSrc} />
    }
}

const mapStateToProps = store => {
     return { 
        ...store, src: {
            "Vertex":   selectors.getVertSrc(store),
            "Fragment": selectors.getFragSrc(store) 
        }
     } 
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(CodeEditor);