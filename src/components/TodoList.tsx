
import { ChangeEvent } from "react"
import { useState ,useEffect} from "react"
import TextareaAutosize from 'react-textarea-autosize';
import { DnDSortResult, useDnDSort } from "../DnD/useDnDSort";
import { TextBlock } from "../types/text";
import axios from "axios";
import TestAxios from "./TestAxios";


interface jsonType {
    message: string;
}


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
    const [message, setMessage] = useState('');
    useEffect(() => {
        axios.get<jsonType>("/").then((response) => {
            console.log(response.data.message)
        //   setMessage(response.message);
        });
      }, []);


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