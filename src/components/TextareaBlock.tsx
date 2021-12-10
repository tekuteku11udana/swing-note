import { useState } from "react"
import TextareaAutosize from 'react-textarea-autosize' 
import { ReturnOfDnDSort } from "../DnD/useDnDSort"


const TextareaBlock = (props: ReturnOfDnDSort) => {
    const [text, setText] = useState(props.value)
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

export default TextareaBlock