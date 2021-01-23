import $ from 'jquery';
import React from "react";
import ReactDOM from "react-dom";

//ACE
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/snippets/glsl";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/keybinding-vscode"

//Sass
import './sass/main.sass';

//GLSL template imports
import VERT_SHADER_TEMPLATE from './glsl/templates/vert.glsl'
import FRAG_SHADER_TEMPLATE from './glsl/templates/frag.glsl'


class App extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	
	onChange(newValue) 
	{
		console.log(newValue)
	
	}

	getAceEditor()
	{
		return (
			<AceEditor
				className="ace-editor"
				mode="glsl"
				theme="tomorrow_night"
				value={VERT_SHADER_TEMPLATE}
				onChange={this.onChange.bind(this)}
				name="glsl_code_editor"
				fontSize={16}
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true
				}}
			/>
		);
	}

	render()
	{
		let aceEditor = this.getAceEditor();

		console.log(aceEditor);

		return(
			aceEditor
		);
	}
}

ReactDOM.render(<App />, document.getElementById("AppContainer"));