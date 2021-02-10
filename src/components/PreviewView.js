import React from 'react'
import { connect } from 'react-redux'
import { threejsUpdateRenderer } from '../redux/actions'

import * as THREE from 'three'
import { RawShaderMaterial, Vector2 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as ASyncObjLoader from '../glsl/AsyncObjLoader'

import config from '../cfg/config.json'
import * as selectors from '../redux/selectors';
import * as GLSLCompiler from '../glsl/compiler/GLSLCompiler'

function WebGLShader(gl, type, string) 
{
    const shader = gl.createShader(type);

    gl.shaderSource(shader, string);
    gl.compileShader(shader);

    return shader;
}

class PreviewView extends React.Component 
{
    constructor(props) 
    {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)

        this.mousePos = { x: 0, y: 0 };
        this.mouseLastPos = { x: 0, y: 0 };
        this.originalRot = { };
        this.mouseDown = false;

        this.uniforms = 
        {
            time: { value: 0.0 }
        };


        //Make the loader
        this.loader = new OBJLoader();

        //Old object path
        this.oldObjPath = null;
    }

    onWindowResize(event)
    {
        //Find dom element
        const domElement = document.getElementById(config.threeJSMountName);

        //Assign width + height
        const [ width, height ] = [ domElement.clientWidth, domElement.clientHeight ];

        //Make new vec2
        let rendererSize = new Vector2(width, height);

        //Find render size
        this.renderer.getSize(rendererSize);

        //Check if different
        if(rendererSize.x != width || rendererSize.y != height)
        {
            let aspectRatio = width / height;

            //Set new size
            this.renderer.setSize(width, height);

            //Update camera aspect ratio & force update of projection matrix
            this.camera.aspect = aspectRatio;
            this.camera.updateProjectionMatrix();
        }
    }

    onObjectLoaded(x)
    {

        //Save rot
        const rot = this.object.rotation;

        //Remove the current object
        this.scene.remove(this.object);

        //Set materials
        //..

        x.traverse(x => 
        {
            if (x instanceof THREE.Mesh) 
            {
                x.material = this.material;
                // x.material.flatShading = true;
            }
        });

        //Set material of parent, reset to (0,0,0), apply rot
        x.material = this.material;
        x.position.set(0, 0, 0);

        //Restore rotation?
        if(config.saveRotBetweenObjLoad)
            x.rotation.set(rot.x, rot.y, rot.z);

        //Add to scene and update refs
        this.scene.add(x);
        this.object = x;
    }

    componentDidUpdate()
    {
        if(this.oldObjPath != this.props.objPath)
        {
            //Object path has updated! So.. load it
            ASyncObjLoader.loadObjectData(this.props.objPath).then(this.onObjectLoaded.bind(this));

            //Set old path
            this.oldObjPath = this.props.objPath;
        }
    }

    componentDidMount() 
    {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        const material = new THREE.MeshBasicMaterial({ color: '#433F81' });
        const object = new THREE.Mesh(geometry, material);

        camera.position.z = 2
        renderer.setClearColor(0x000000, 0)
        renderer.setSize(width, height)

        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.object = object;

        this.props.threejsUpdateRenderer(this.renderer);

        //Load the object
        ASyncObjLoader.setLoadObjectPath('assets/obj/bunny_fixed.obj')

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.onWindowResize({});

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    componentWillUnmount() 
    {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start() 
    {
        if (!this.frameId)
            this.frameId = requestAnimationFrame(this.animate)

        //We've started. Update shader material
        this.updateShaderMaterial(); 
    }

    stop() 
    {
        cancelAnimationFrame(this.frameId)
    }

    onMouseMove(event)
    {
        this.mousePos.x = event.screenX;
        this.mousePos.y = event.screenY;

        if (this.mouseDown) 
        {
            const mouseXDelta = (this.mousePos.x - this.mouseLastPos.x) / screen.height;
            const mouseYDelta = (this.mousePos.y - this.mouseLastPos.y) / screen.height;

            this.object.rotation.x += mouseYDelta * config.manualRotateSpeed;
            this.object.rotation.y += mouseXDelta * config.manualRotateSpeed;
        }

        this.mouseLastPos.x = this.mousePos.x;
        this.mouseLastPos.y = this.mousePos.y;
    }

    onMouseDown(event)
    {
        this.mouseDown = true;

        this.mouseLastPos = {
            x: event.screenX,
            y: event.screenY
        };

        this.originalRot = this.object.rotation;
    }

    onMouseUp(event)
    {
        if(this.mouseDown)
            this.mouseDown = false;
    }

    animate() 
    {
        if(this.object == null)
            return;

        if(this.props.previewMode != "manual")
        {
            this.object.rotation.x += config.autoRotateSpeed;
            this.object.rotation.y += config.autoRotateSpeed;
        }

        //Update + pass uniforms
        this.updateAndPassUniforms();

        //Render the scene
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    updateAndPassUniforms()
    {
        //Update
        //-------
        this.uniforms.time.value += 1;

        //Pass
        //-------
        this.material.uniforms = this.uniforms;
    }

    renderScene() 
    {
        this.renderer.render(this.scene, this.camera);
    }

    updateShaderMaterial()
    {
        if(this.object == null)
            return;

        //Build shader material
        let shaderMaterial = new RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.props.vertSrc,
            fragmentShader: this.props.fragSrc
        });

        //Update material
        this.material = shaderMaterial;

        //Set mesh material to this
        this.object.traverse(x => {
            if(x instanceof THREE.Mesh)
            {
                x.material = this.material;
                // x.material.flatShading = true;
            }
        });
    }

    onWheel(event)
    {
        const delta = event.deltaY * config.zoomMultiplier;

        this.camera.translateZ(delta);

        this.camera.position.z = Math.max(this.camera.position.z, config.zoomClampZMin);
        this.camera.position.z = Math.min(this.camera.position.z, config.zoomClampZMax);
    }

    render() 
    {
        //Passed compiling? Update shader material
        if(this.props.compileStatus == GLSLCompiler.COMPILE_STATUS_PASS)
            this.updateShaderMaterial();

        //Is loading?
        const className = (this.props.loadStatus);

        //Render the canvas
        return (
            <aside className={`threejs-view ${className}`} id={config.threeJSMountName}>
                <div onWheel={this.onWheel.bind(this)} onMouseDown={this.onMouseDown.bind(this)}
                    style={{ width: '100%', height: '95%' }}
                    ref={(mount) => { this.mount = mount }}
                />
            </aside>
        )
    }
}


const mapStateToProps = store =>
{
    return { 
        previewMode:   selectors.getPreviewMode(store),
        compileStatus: selectors.getCompileStatus(store),
        loadStatus: selectors.getThreeJsLoadStatus(store),
        vertSrc: selectors.getVertSrc(store),
        fragSrc: selectors.getFragSrc(store),
        objPath: selectors.getThreeJsObject(store)
    };
}

export default connect(mapStateToProps, { threejsUpdateRenderer }, null, { forwardRef: true })(PreviewView);