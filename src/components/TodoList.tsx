
import { ChangeEvent } from "react"
import { useState } from "react"
import TextareaAutosize from 'react-textarea-autosize';
import { DnDSortResult, useDnDSort } from "../DnD/useDnDSort";
import { TextBlock } from "../types/text";



const TextareaBlock = (props: DnDSortResult<string>) => {
    const [text, setText] = useState(props.value)
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }
    return (
        <TextareaAutosize 
            className={"rounded-lg bg-yellow-200 my-1 px-1"}
            value={text} 
            onChange={e => handleChange(e)}
            style={{resize: "none"}}
            {...props.events}
        />
    )
}





const TodoList = () => {
    // const defaultTextBlocks = [
    //     {id: 1, text: "abc"},
    //     {id: 2, text: "def"},
    //     {id: 3, text: "ghi"}
    // ]
    
    const defaultTextBlocks: string[] =[
        "abc",
        "def",
        "ghi"
    ]

    const sortedTextBlocks = useDnDSort(defaultTextBlocks)
    
    return (       
        <form className="flex flex-col p-2 bg-red-400 flex-grow">
            {sortedTextBlocks.map((block) => {
                return (
                    <TextareaBlock 
                    
                        key={block.key} 
                        value={block.value} 
                        events={block.events}
                    />
                )
            })
            
        }</form>
    )
}

export default TodoList