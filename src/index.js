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
import StatusBox from './components/StatusBox'


class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = 
		{
			vertShaderSrc: VERT_SHADER_TEMPLATE,
			fragShaderSrc: FRAG_SHADER_TEMPLATE,
			compileStatus: { compiled: true }
		}

		this.statusBoxRef = React.createRef();
	}

	shouldComponentUpdate(nextProps, nextState)
	{
		return !((this.state.vertShaderSrc == nextState.vertShaderSrc) && (this.state.fragShaderSrc == nextState.fragShaderSrc));
	}
	
	onVertexShaderChange(editor, src) 
	{
		this.setState({ vertShaderSrc: src });
	}

	onFragmentShaderChange(editor, src) 
	{
		this.setState({ fragShaderSrc: src });
	}

	onCompile(status)
	{
		//Status box ref is null? Get outta here
		if(this.statusBoxRef.current == null)
			return;

		//Status class
		const statusClass = (status.compiled) ? ("pass") : ("fail");

		//And status title
		let title = (status.compiled) ? ("Compiled!") : ("Compile failed: ");

		if(!status.compiled)
		{
			let errs = [];

			if(!status.vert.compiled)
				errs.push("Vertex");
			
			if(!status.frag.compiled)
				errs.push("Fragment");

			title += errs.join(" and ");
		}
	
		//Set compile status
		this.statusBoxRef.current.setCompileStatus(status, statusClass, title);
	}

	render()
	{
		return(
			<main>
				<header>
					<img src="logos/logocol-round-lod.png" />
					<StatusBox ref={this.statusBoxRef}></StatusBox>
				</header>
				<div className="split-pane">
					<CodeEditor tabs={["Vertex", "Fragment"]}>
						<CodeEditorTab onChange={this.onVertexShaderChange.bind(this)}   title="Vertex"   defaultSrc={VERT_SHADER_TEMPLATE} />
						<CodeEditorTab onChange={this.onFragmentShaderChange.bind(this)} title="Fragment" defaultSrc={FRAG_SHADER_TEMPLATE} />
					</CodeEditor>
					<aside className="threejs-view" id="threejs-mount">
						<PreviewView onCompile={this.onCompile.bind(this)} vertexShader={this.state.vertShaderSrc} fragmentShader={this.state.fragShaderSrc} />
					</aside>
				</div>
			</main>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("AppContainer"));