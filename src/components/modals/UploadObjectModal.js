import React from 'react'
import Modal from './Modal'
import DragDropArea from '../ui/DragDropArea'

export default class UploadObjectModal extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <Modal>
            <h1>Upload an .obj file</h1>
            <p>Drag and drop an .obj file below to upload it.</p>
            <DragDropArea/>
        </Modal>
    }
}