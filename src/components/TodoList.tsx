
import { ChangeEvent } from "react"
import { useState } from "react"

type TextBlockProps = {
    id: number
    text: string
}

const TextBlock = (props: TextBlockProps) => {
    const [text, setText] = useState(props.text)
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }
    return (
        <textarea 
            className={"w-56"}
            value={text} 
            onChange={e => handleChange(e)}
        />
    )
}





const TodoList = () => {
    const defaultTexts = [
        {id: 1, text: "abc"},
        {id: 2, text: "def"},
        {id: 3, text: "ghi"}
    ]
    
    return (       
        <form className="grid grid-cols-1">
            {defaultTexts.map((text) => {
                return (
                    <TextBlock 
                    
                        id={text.id} 
                        text={text.text} 
                    />
                )
            })
            
        }</form>
    )
}

export default TodoList