import React from 'react'
import * as THREE from 'three'
import { RawShaderMaterial } from 'three';
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
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        
        const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
        const cube = new THREE.Mesh(geometry, material)

        camera.position.z = 4
        scene.add(cube)
        renderer.setClearColor(0x000000, 0)
        renderer.setSize(width, height)

        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.cube = cube

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

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

            this.cube.rotation.x += mouseYDelta * config.manualRotateSpeed;
            this.cube.rotation.y += mouseXDelta * config.manualRotateSpeed;
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

        this.originalRot = this.cube.rotation;
    }

    onMouseUp(event)
    {
        if(this.mouseDown)
            this.mouseDown = false;
    }

    animate() 
    {
        if(this.props.mode != "manual")
        {
            this.cube.rotation.x += config.autoRotateSpeed;
            this.cube.rotation.y += config.autoRotateSpeed;
        }

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() 
    {
        this.renderer.render(this.scene, this.camera)
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
        //Build shader material
        let shaderMaterial = new RawShaderMaterial({
            uniforms: { },
            vertexShader: this.props.vertexShader,
            fragmentShader: this.props.fragmentShader
        });

        //Update material
        this.material = shaderMaterial;

        //Set mesh material to this
        this.cube.material = this.material;
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
