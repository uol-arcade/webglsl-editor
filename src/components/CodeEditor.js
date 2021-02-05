import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../redux/selectors'
import { editorUpdateVertFragSrc, editorUpdateVertFragErrors, editorUpdateCompileStatus } from '../redux/actions'

import CodeEditorTab from './CodeEditorTab';
import config from '../cfg/config.json'
import * as GLSLCompiler from '../glsl/compiler/GLSLCompiler'

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
        this.compileTimer = null;

        this.tempSrc = { "Vertex": this.props.src.Vertex, "Fragment": this.props.src.Fragment };
    }

    onTabTitleClick(idx)
    {
        //Set selected index based on this (if changed)
        if(this.state.selectedIndex === idx)
            return;

        //Otherwise set state
        this.setState({ selectedIndex: idx });

        //Tab has changed, update source so it saves
        //
        const sources = { vert: this.tempSrc.Vertex, frag: this.tempSrc.Fragment };
        this.props.editorUpdateVertFragSrc(sources.vert, sources.frag);

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

    updateCompileTimer(key, src)
    {
        //Set compile status to "compiling"
        this.props.editorUpdateCompileStatus(GLSLCompiler.COMPILE_STATUS_COMPILING);

        //Clear the timer
        if (this.timer) 
        {
            //Clear the timer
            clearTimeout(this.timer);
        }

        //Set new timer
        this.timer = setTimeout(this.updateVertFragState.bind(this, key, src), config.compileUpdateDelay);
    }

    updateVertFragState(key, src)
    {
        //Compile
        //---------

        //Get sources, update local sources with this new one (whatever it is)
        let sources = this.props.src;
        sources[key] = src;

        //Try compile it
        const status = GLSLCompiler.validateShaderSources(this.props.renderer, sources.Vertex, sources.Fragment);

        //Compiled? Update with pass
        if(GLSLCompiler.hasCompiled(status))
            this.props.editorUpdateCompileStatus(GLSLCompiler.COMPILE_STATUS_PASS);
        
        //Failed? Update with fail
        else
            this.props.editorUpdateCompileStatus(GLSLCompiler.COMPILE_STATUS_FAIL);            

        //Not good? do stuff
        if(!GLSLCompiler.hasCompiled(status))
        {
            //Dispatch errors update
            this.props.editorUpdateVertFragErrors(GLSLCompiler.getDetailedErrors(status), GLSLCompiler.getPrettyPrintErrors(status));
        }

        //If good, update src
        else
        {
            //Otherwise.. Set to no errors
            this.props.editorUpdateVertFragErrors({ detailed: [], pretty: [] });

            //It's compiled properly
            this.props.editorUpdateCompileStatus(GLSLCompiler.COMPILE_STATUS_PASS);
            
            //And update source
            this.props.editorUpdateVertFragSrc(sources.Vertex, sources.Fragment);
        }
    }

    onEditorChangeSrc(key, src) 
    {
        //Set temporary 
        this.tempSrc[key] = src;

        //Update compile timer
        this.updateCompileTimer(key, src);
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

                    // console.log(this.props.detailedErrors)

                    return <CodeEditorTab errors={this.props.errors[tab]} key={tab} title={tab} onChange={this.onEditorChangeSrc.bind(this)} title={tab} defaultSrc={this.props.src[tab]} />
                })}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { 
        ...store, src: {
            "Vertex":   selectors.getVertSrc(store),
            "Fragment": selectors.getFragSrc(store) 
        }, 
        errors: {
            "Vertex":   selectors.getDetailedErrors(store).vert,
            "Fragment": selectors.getDetailedErrors(store).frag,
        },
        renderer: selectors.getThreeJsRenderer(store)
    } 
};

export default connect(mapStateToProps, { editorUpdateVertFragSrc, editorUpdateVertFragErrors, editorUpdateCompileStatus }, null, { forwardRef: true })(CodeEditor);