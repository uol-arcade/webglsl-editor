import React from 'react'
import * as THREE from 'three'
import { RawShaderMaterial, Vector2 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import config from '../cfg/config.json'

function WebGLShader(gl, type, string) 
{
    const shader = gl.createShader(type);

    gl.shaderSource(shader, string);
    gl.compileShader(shader);

    return shader;
}

export default class PreviewView extends React.Component 
{
    constructor(props) 
    {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.validateShaderSources = this.validateShaderSources.bind(this)

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

        const onObjectLoaded = (x) =>
        {
            x.traverse(x => {
                if(x instanceof THREE.Mesh)
                {
                    x.material = this.material;
                    // x.material.flatShading = true;
                }
            });

            x.material = this.material;
            x.position.set(0, 0, 0);
            
            this.scene.add(x);
            this.object = x;
        };

        this.loader.load('assets/obj/bunny_fixed.obj', onObjectLoaded.bind(this), x => console.log(x.loaded / x.total), e => console.log(error));

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

        if(this.props.mode != "manual")
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

    validateShaderSources(vertexSrc, fragmentSrc) 
    {
        //Renderer is somehow null? get out of here
        if(this.renderer == null)
            return { compiled: false };

        //Get GL
        const gl = this.renderer.getContext();

        //Make vert/frag shaders
        const glVertShader = new WebGLShader(gl, gl.VERTEX_SHADER,   vertexSrc);
        const glFragShader = new WebGLShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

        //Get logs
        const vertLog = gl.getShaderInfoLog(glVertShader);
        const fragLog = gl.getShaderInfoLog(glFragShader);

        //Bools for whether or not there were errors
        const fragErrors = fragLog !== "";
        const vertErrors = vertLog !== "";
        //--
        const errorLinesFromLog = log => log.split('\n').filter(x => x.match(/\s+/));

        //Return status
        return {
            compiled: !(fragErrors || vertErrors),
            frag: {
                compiled: !fragErrors,
                errors: errorLinesFromLog(fragLog)
            },
            vert: {
                compiled: !vertErrors,
                errors: errorLinesFromLog(vertLog)
            }
        };
    }

    updateShaderMaterial()
    {
        if(this.object == null)
            return;

        //Build shader material
        let shaderMaterial = new RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.props.vertexShader,
            fragmentShader: this.props.fragmentShader
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
        //Validate sources
        const status = this.validateShaderSources(this.props.vertexShader, this.props.fragmentShader);

        //Compiled? Update material & attach
        if(status.compiled)
            this.updateShaderMaterial();

        //Call compile update
        if(this.props.onCompile)
            this.props.onCompile(status);

        return (
            <div onWheel={this.onWheel.bind(this)} onMouseDown={this.onMouseDown.bind(this)}
                style={{ width: '100%', height: '95%' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}
