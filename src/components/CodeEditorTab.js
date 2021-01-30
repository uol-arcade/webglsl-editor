import React from 'react'

//ACE
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/snippets/glsl";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/keybinding-vscode"

export default class CodeEditorTab extends React.Component 
{
    constructor(props)
    {
        super(props);

        this.src = (props.defaultSrc) ? (props.defaultSrc) : ("");
    }

    onChange(src)
    {
        this.src = src;

        if(this.props.onChange)
            this.props.onChange(this.props.title, this.src);
    }


    getRenderedEditor()
    {
        this.props.errors?.forEach(x => {
           x.type = 'error';
           x.row -= 1;
        });

        return (
            <AceEditor
                className="ace-editor"
                mode="glsl"
                theme="tomorrow_night"
                value={this.src}
                onChange={this.onChange.bind(this)}
                name="glsl_code_editor"
                fontSize={16}
                showError={true}
                highlightActiveLine={true}
                annotations={this.props.errors}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                }}
            />
        );
    }

    getTabTitle()
    {
        return <header>{this.props.title}</header>
    }

    render() 
    {
        return this.getRenderedEditor();
    }
}