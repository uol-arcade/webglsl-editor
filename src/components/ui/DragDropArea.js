import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import React from 'react'

export default class DragDropArea extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { active: false };
    }

    onDragOver(event)
    {
        event.preventDefault();
        this.setState({ active: true });
    }

    onDragDrop(event)
    {
        event.preventDefault();
        this.setState({ active: false });
        
        //Null? show error
        if(!event.dataTransfer.items)
            return alert("[error] For some reason, I couldn't process you dropped. Try again or refresh.");

        //Items > 1? show error
        if (event.dataTransfer.items.length > 1)
            return alert("[error] Currently, uploading more than 1 file isn't supported. Please try again with just 1 file.");

        //Get the item
        const item = event.dataTransfer.items[0];

        //Is it a file?
        if(item.kind != 'file')
            return alert("[error] You tried to upload something which isn't a file. Please try again.");

        //Ok, get it as a file
        const file = item.getAsFile();

        //Not an obj? error
        if(file.name.match(/\.obj$/) == null)
            return alert("[error] This is not a .obj file. Please try again.");

        //Call external event
        if(this.props.onFileDropped)
            this.props.onFileDropped(file);
    }

    onDragLeave(event)
    {
        event.preventDefault();
        this.setState({ active: false });
    }

    render()
    {
        const className = (this.state.active) ? ("active") : ("");

        return <div className={`drag-drop-area ${className}`} onDragOver={this.onDragOver.bind(this)} onDragLeave={this.onDragLeave.bind(this)} onDrop={this.onDragDrop.bind(this)}>
            <FontAwesomeIcon icon={faUpload}/>
        </div>
    }
}