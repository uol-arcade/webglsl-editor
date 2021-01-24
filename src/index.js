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

//Components
import CodeEditor from './components/CodeEditor'
import CodeEditorTab from './components/CodeEditorTab';


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

	render()
	{
		return(
			<CodeEditor tabs={["Vertex", "Fragment"]}>
				<CodeEditorTab title="Vertex"   defaultSrc={VERT_SHADER_TEMPLATE} />
				<CodeEditorTab title="Fragment" defaultSrc={FRAG_SHADER_TEMPLATE} />
			</CodeEditor>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("AppContainer"));