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

//Import config
import config from './cfg/config.json'
import BinaryToggle from "./components/BinaryToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faRobot } from "@fortawesome/free-solid-svg-icons";

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = 
		{
			vertShaderSrc: VERT_SHADER_TEMPLATE,
			fragShaderSrc: FRAG_SHADER_TEMPLATE,
			compileStatus: { compiled: true },
			previewMode: "manual"
		}

		this.timer = null;
		this.statusBoxRef = React.createRef();
		this.previewViewRef = React.createRef();

		this.tempVertSrc = VERT_SHADER_TEMPLATE;
		this.tempFragSrc = FRAG_SHADER_TEMPLATE;
	}
	
	updateVertFragState()
	{
		console.log("compiling..");

		//Find status of compilation by compiling shader sources 
		let status = this.previewViewRef.current.validateShaderSources(this.tempVertSrc, this.tempFragSrc);


		//Set status of status box:
		if(!status.compiled)
			this.statusBoxRef.current.setCompileStatus(this.state.compileStatus, "fail", "Failed");
		else
			this.statusBoxRef.current.setCompileStatus(this.state.compileStatus, "pass", "Pass");

		
		//Update the state of this app ONLY if the shader has compiled
		if(status.compiled)
		{
			console.log("state update: compiled");
			this.setState({ vertShaderSrc: this.tempVertSrc, fragShaderSrc: this.tempFragSrc });
		}
	}

	updateCompileTimer()
	{
		//Set compile status to "compiling"
		this.statusBoxRef.current.setCompileStatus(this.state.compileStatus, "neutral", "Compiling");

		//Clear the timer
		if (this.timer) 
		{
			console.log("clear timer");

			//Clear the timer
			clearTimeout(this.timer);
		}

		//Set new timer
		this.timer = setTimeout(this.updateVertFragState.bind(this), config.compileUpdateDelay);
	}

	onVertexShaderChange(editor, src) 
	{
		//Set src
		this.tempVertSrc = src;

		//Call update timer
		this.updateCompileTimer();
	}

	onFragmentShaderChange(editor, src) 
	{
		//Set src
		this.tempFragSrc = src;

		//Call update timer
		this.updateCompileTimer();
	}

	onBinaryToggleClick()
	{		
		if(this.state.previewMode == "manual")
			this.setState({ previewMode: "auto" });

		else
			this.setState({ previewMode: "manual" });
	}

	getVersion(long=true)
	{
		if(long)
			return `${config.projectVersion}-${VERSION}-${BRANCH}`;
		else
			return `${config.projectVersion}`;
	}

	render()
	{
		return(
			<main>
				<aside className="left-bar">
					<div className="top">
						<img src="logos/logocol-round-lod.png" title={`${config.projectName}\n${this.getVersion()}`} />
					</div>
					<div className="middle">
						{/* <p>hello</p> */}
					</div>
				</aside>
				<div className="right-view">
					<header>
						<div className="right-pane">
							<StatusBox status={this.state.statusBoxStatus} ref={this.statusBoxRef}></StatusBox>
							<BinaryToggle onClick={this.onBinaryToggleClick.bind(this)} selected={this.state.previewMode} keys={["manual", "auto"]} icons={[ faArrowsAlt, faRobot ]}/>
						</div>
					</header>
					<div className="split-pane">
						<CodeEditor tabs={["Vertex", "Fragment"]}>
							<CodeEditorTab onChange={this.onVertexShaderChange.bind(this)}   title="Vertex"   defaultSrc={VERT_SHADER_TEMPLATE} />
							<CodeEditorTab onChange={this.onFragmentShaderChange.bind(this)} title="Fragment" defaultSrc={FRAG_SHADER_TEMPLATE} />
						</CodeEditor>
						<aside className="threejs-view" id={config.threeJSMountName}>
							<PreviewView mode={this.state.previewMode} ref={this.previewViewRef} vertexShader={this.state.vertShaderSrc} fragmentShader={this.state.fragShaderSrc} />
						</aside>
					</div>
				</div>
			</main>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("AppContainer"));