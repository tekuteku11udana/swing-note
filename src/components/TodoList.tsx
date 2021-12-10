import {useDnDSort } from "../DnD/useDnDSort";
import TestAxios from "./TestAxios";
import TextareaBlock from "./TextareaBlock";



const TodoList = () => {
    
    const defaultTextBlocks = [
        {key: 1, value: "abc"},
        {key: 2, value: "def"},
        {key: 3, value: "ghi"}
    ]   
    
    const sortedTextBlocks = useDnDSort(defaultTextBlocks)
    
    return ( 
        <div>

            <TestAxios />
            
            <form className="flex flex-col p-2 bg-red-400 flex-grow">
                {sortedTextBlocks.map((block) => {
                    return(
                        <div>
                            <TextareaBlock 
                                key={block.key} 
                                value={block.value} 
                                events={block.events}
                            />
                        </div>                       
                    )
                })                
            }</form>
        </div>             
    )
}

export default TodoList