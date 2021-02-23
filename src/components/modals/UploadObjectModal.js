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
            loadState: "Uploading"
        }
    }

    onFileDropped(file)
    {
        //Set state up
        this.setState({ reading: true, loaded: false, readPercent: 0 });

        //Otherwise! Upload / read
        let reader = new FileReader();

        //On load is an external callback
        //TODO: Convert to thunk. Passing by value here is a bad idea because it can potentially be huge.
        //..

        reader.onload = (function(event)
        {
            //Set state
            this.setState({ loadState: "Updating" });
            
            //Set text
            const text = event.target.result;

            //Call the callback
            this.props.onObjUploaded(text);
            
            //Close the modal after a bit
            setTimeout((() => 
            {
                this.setState({ reading: false });
                this.props.onModalClose()
            }).bind(this), 500);

        }).bind(this);

        //Set up load start, load end
        reader.onloadstart = (event) => null;

        //On progress, etc
        reader.onprogress = (event) => 
        {
            this.setState({ loadState: "Reading data" });
        }
        reader.onprogress.bind(this);
        this.setState({ loadState: "Uploading" });

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
                <h1 className="loading">{ `${this.state.loadState}...` }</h1>
            </Modal>
        }
    }
}