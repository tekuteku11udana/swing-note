import axios from "axios";
import { useEffect, useState } from "react";

interface Post {
    userId: number
    id: number
    title: string
    body: string
}


const ApiFetch = () => {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(res => {
            setPosts(res.data)
        })
    }, [])
    return (
        <div>
            <ul>
                {
                    posts.map(post => <li key={post.id}> {post.title} </li>)
                }
            </ul>

        </div>
    )
};
export default ApiFetch