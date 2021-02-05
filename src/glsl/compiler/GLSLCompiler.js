import * as THREE from 'three'
import { RawShaderMaterial, Vector2 } from 'three';

export const COMPILE_STATUS_FAIL = -1;
export const COMPILE_STATUS_COMPILING = 0;
export const COMPILE_STATUS_PASS = 1;

export function WebGLShader(gl, type, string) 
{
    const shader = gl.createShader(type);

    gl.shaderSource(shader, string);
    gl.compileShader(shader);

    return shader;
}

export const getDetailedErrors = (status) =>
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
    let allErrors = [...status.frag.errors, ...status.vert.errors];

    //Map errors to objects
    let mappedErrors = errorMsgToObject(allErrors);

    //Map frag & vert errors
    return {
        vert: errorMsgToObject(status.vert.errors),
        frag: errorMsgToObject(status.frag.errors)
    };
}

export const getPrettyPrintErrors = (status) =>
{
    //Prepends str to each elem of array
    const prepend = (x, str) => x.map(x => str + x);

    //Prepend file
    const fragErrors = prepend(status.frag.errors, "(frag) ");
    const vertErrors = prepend(status.vert.errors, "(vert) ");

    //Return the errors
    return [ ...vertErrors, ...fragErrors ];
}

export const hasCompiled = (status) =>
{
    return (status.compiled === true);
}

export const validateShaderSources = (renderer, vert, frag) =>
{
    //Renderer is somehow null? get out of here
    if (renderer == null)
        return { compiled: false };

    //Get GL
    const gl = renderer.getContext();

    //Make vert/frag shaders
    const glVertShader = new WebGLShader(gl, gl.VERTEX_SHADER, vert);
    const glFragShader = new WebGLShader(gl, gl.FRAGMENT_SHADER, frag);

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