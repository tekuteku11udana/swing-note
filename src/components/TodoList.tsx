
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
            className={"p-2 border-4 bg-yellow-200"}
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
        <form className="flex flex-col p-2 bg-red-400 flex-grow">
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