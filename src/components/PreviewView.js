import React from 'react'
import * as THREE from 'three'
import { RawShaderMaterial } from 'three';

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

    animate() 
    {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01

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
            <div
                style={{ width: '100%', height: '95%' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}
