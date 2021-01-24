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
import CodeEditorTab from './components/CodeEditorTab'
import PreviewView from './components/PreviewView'


class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = 
		{
			vertShaderSrc: VERT_SHADER_TEMPLATE,
			fragShaderSrc: FRAG_SHADER_TEMPLATE
		}
	}
	
	onVertexShaderChange(editor, src) 
	{
		this.setState({ vertShaderSrc: src });
	}

	onFragmentShaderChange(editor, src) 
	{
		this.setState({ fragShaderSrc: src });
	}

	render()
	{
		return(
			<main>
				<header>
					<img src="logos/logocol-round-lod.png" />
				</header>
				<div className="split-pane">
					<CodeEditor tabs={["Vertex", "Fragment"]}>
						<CodeEditorTab onChange={this.onVertexShaderChange.bind(this)}   title="Vertex"   defaultSrc={VERT_SHADER_TEMPLATE} />
						<CodeEditorTab onChange={this.onFragmentShaderChange.bind(this)} title="Fragment" defaultSrc={FRAG_SHADER_TEMPLATE} />
					</CodeEditor>
					<aside className="threejs-view" id="threejs-mount">
						<PreviewView vertexShader={this.state.vertShaderSrc} fragmentShader={this.state.fragShaderSrc} />
					</aside>
				</div>
			</main>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("AppContainer"));