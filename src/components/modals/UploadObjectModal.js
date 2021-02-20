import React from 'react'
import Modal from './Modal'
import DragDropArea from '../ui/DragDropArea'

export default class UploadObjectModal extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            reading: false,
            readPercent: 0
        }
    }

    onFileDropped(file)
    {
        //Set state up
        this.setState({ reading: true, loaded: false, readPercent: 0 });

        //Otherwise! Upload / read
        let reader = new FileReader();

        //On load is an external callback
        //TODO: Convert to thunk.
        reader.onload = (function(event)
        {
            //Set state
            this.setState({ reading: false, readPercent: 0.0 });
            
            //Set text
            const text = event.target.result;
            
            //Close the modal
            this.props.onModalClose();
        }).bind(this);

        //Set up load start, load end
        reader.onloadstart = (event) => null;

        //On progress, etc
        reader.onprogress = (event) => this.setState({ readPercent: (event.loaded / file.size) * 100.0 });
        reader.onprogress.bind(this);

        //Read it as text
        reader.readAsText(file);
    }

    onCancel()
    {
        if(!this.state.reading)
            this.props.onModalClose();
    }

    render()
    {
        if(!this.state.reading)
        {
            return <Modal onCancel={this.onCancel.bind(this)}>
                <h1>Upload an .obj file</h1>
                <p>Drag and drop an .obj file below to upload it.</p>
                <DragDropArea onFileDropped={this.onFileDropped.bind(this)} />
            </Modal>
        }
        else
        {
            return <Modal>
                <h1>{ `${this.state.readPercent}% uploaded` }</h1>
            </Modal>
        }
    }
}