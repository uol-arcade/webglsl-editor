import React from 'react'
import codeExamples from '../cfg/examples.json'


class MenuPopout extends React.Component 
{
    constructor(props) 
    {
        super(props);
    }

    getItems() 
    {
        //Get categories
        const categories = Object.keys(this.props.data);

    
        //Map each category
        const mapped = categories.map(cat => {
            return <div className="category" key={cat}>
                <h1>{cat}</h1>
                <ul>
                    {
                        this.props.data[cat].map(x => {
                            return <li onClick={this.props.onItemClicked.bind(this, x)} key={x.title}>{x.title}</li>;
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

export default MenuPopout;