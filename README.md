# Web GLSL editor
![GitHub tag](https://img.shields.io/github/v/tag/blewert/webglsl-editor)
![GitHub last commit](https://img.shields.io/github/last-commit/blewert/webglsl-editor)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/blewert/webglsl-editor/Build%20and%20Deploy)

This is a web-based GLSL editor. There are many different web-based GLSL editors out there, but I've found that not many of them have a friendly interface. Most also don't support more advanced features, such as uploading your own models & textures.
There needs to be some kind of web-based GLSL editor that quickly allows you to mock up some ideas you might have for a vert or frag shader. This is the aim of this project.

The project itself is built mainly with React, Redux and ThreeJS. Other libraries (such as Font Awesome) are used too. 

## Demo
You can try the demo out [here](https://blewert.github.io/webglsl-editor/).

## Installation
To install, clone this repo and run `npm install`. You can then use `start.bat` (on Windows) or `npm run start` to start the editor in development mode.

### Cool, has it got a name?
No. I'm trying my best to think of one, but I really can't. 🤔

## Versioning
The current version is `0.4.0`. The GLSL editor consists of a tabbed text-editor for vert & frag shaders. Shaders can be edited, compiled (with error feedback) and viewed in real-time. Furthermore, custom objects can be uploaded.

### Previous versions
| Version | Date | Notes  |
| ------- | ---- | ------ |
| 0.0.1   | 23/01/21 | Initial creation
| 0.0.2   | 24/01/21 | Basic working shader editing.
| 0.1.0   | 30/01/21 | Shader editing, error feedback, compilation status, side-bar and auto-rotate functions.
| 0.2.0   | 10/02/21 | Loadable shader examples!
| 0.3.0   | 10/02/21 | Loadable object examples!
| 0.4.0   | 20/02/21 | Loadable .obj files

### Issues & Suggestions
Issues & suggestions can be made on the project board for this repository. You should find it under the *Project* tab of this repository. Alternatively, create a new issue under the *Issues* tab.
