import React from 'react'
import codeExamples from '../cfg/examples.json'

class ExamplesMenu extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    loadShaderAsync(vertPath, fragPath)
    {
        console.log(`LOAD ${vertPath} and ${fragPath}`);
    }

    onExampleClick(item)
    {
        //Load item
        this.loadShaderAsync(item.vert, item.frag);
    }

    getItems()
    {
        //Get categories
        const categories = Object.keys(codeExamples);
        
        //Map each category
        const mapped = categories.map(cat => {
            return <div className="category" key={cat}>
                <h1>{cat}</h1>
                <ul>
                    {
                        codeExamples[cat].map(x => 
                        {
                            return <li onClick={this.onExampleClick.bind(this, x)} key={x.title}>{x.title}</li>;
                        })
                    }
                </ul>
            </div>
        });

        //Return the mapped cats
        return mapped;
    }

    render()
    {
        //Get the items
        const items = this.getItems();
        
        return <div className="menu-popout-menu">{items}</div>;
    }
}

export default ExamplesMenu;