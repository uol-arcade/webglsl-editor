import React from 'react'
import CodeEditorTab from './CodeEditorTab';

export default class CodeEditor extends React.Component
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
        if(this.props.onTabChange)
            this.props.onTabChange(idx, this.editorTabs[idx]);
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
                {this.props.children.map(((child, index) => 
                {
                    if(index != this.state.selectedIndex) 
                        return undefined;

                    return child;
                }).bind(this))}
            </div>
        );
    }
}