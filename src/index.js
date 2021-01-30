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
import { faArrowsAlt, faRobot, faCog } from "@fortawesome/free-solid-svg-icons";
import { SideBarContent, SideBarItem } from "./components/SideBarContent";

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
			previewMode: "manual",
			errors: {}
		}

		this.timer = null;
		this.statusBoxRef = React.createRef();
		this.previewViewRef = React.createRef();
		this.fragTabRef = React.createRef();
		this.vertTabRef = React.createRef();

		this.tempVertSrc = VERT_SHADER_TEMPLATE;
		this.tempFragSrc = FRAG_SHADER_TEMPLATE;
	}
	
	updateVertFragState()
	{
		console.log("compiling..");

		//Find status of compilation by compiling shader sources 
		let status = this.previewViewRef.current.validateShaderSources(this.tempVertSrc, this.tempFragSrc);

		//Prepends str to each elem of array
		const prepend = (x, str) => x.map(x => str + x);

		//Prepend file
		const fragErrors = prepend(status.frag.errors, "(frag) ");
		const vertErrors = prepend(status.vert.errors, "(vert) ");

		//Build errors array
		const errors = [ ...fragErrors, ...vertErrors ];

		//Get first error
		const firstError = errors[0];

		//Set status of status box:
		if(!status.compiled)
			this.statusBoxRef.current.setCompileStatus(this.state.compileStatus, "fail", firstError, errors.length);
		else
			this.statusBoxRef.current.setCompileStatus(this.state.compileStatus, "pass", "Pass");

		if(!status.compiled)
		{
			const errorMsgToObject = x => x.map(y => 
			{
				const groups = y.match(/^ERROR:\s*(\d+?)\:(\d+?)\:/);

				return {
					column: +groups[1],
					row: +groups[2],
					text: y
				};
			});

			//All errors
			let allErrors = [ ...status.frag.errors, ...status.vert.errors ];

			//Map errors to objects
			let mappedErrors = errorMsgToObject(allErrors);

			//Map frag & vert errors
			let editorErrors = {
				vert: errorMsgToObject(status.vert.errors),
				frag: errorMsgToObject(status.frag.errors)
			};

			//Set errors
			this.statusBoxRef.current.setErrors(mappedErrors);

			//Set errors for editor
			this.setState({ errors: editorErrors });
		}

		
		//Update the state of this app ONLY if the shader has compiled
		if(status.compiled)
		{
			console.log("state update: compiled");
			this.setState({ vertShaderSrc: this.tempVertSrc, fragShaderSrc: this.tempFragSrc, errors: [] });
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

	onSideBarSettingsClick(event)
	{
		alert("This feature isn't implemented yet. Sorry!");
	}

	onTabChange(idx, editor)
	{
		//Set frag & vert shader src
		this.setState({ fragShaderSrc: this.tempFragSrc, vertShaderSrc: this.tempVertSrc });
	}

	render()
	{
		return(
			<main>
				<aside className="left-bar">
					<div className="top">
						<img src="assets/logos/logomono-lod.png" title={`${config.projectName}\n${this.getVersion()}`} />
					</div>
					<div className="middle">
						<SideBarContent>
							<SideBarItem onClick={this.onSideBarSettingsClick} icon={faCog} title="Settings" />
							{/* <SideBarItem icon={faArrowsAlt} title="Settings" /> */}
						</SideBarContent>
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
						<CodeEditor onTabChange={this.onTabChange.bind(this)} tabs={["Vertex", "Fragment"]}>
							<CodeEditorTab errors={this.state.errors?.vert} onChange={this.onVertexShaderChange.bind(this)}   title="Vertex"   defaultSrc={this.tempVertSrc} />
							<CodeEditorTab errors={this.state.errors?.frag} onChange={this.onFragmentShaderChange.bind(this)} title="Fragment" defaultSrc={this.tempFragSrc} />
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