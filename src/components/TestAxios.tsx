import axios from "axios";
import React from "react";

type PostType = {
    title: string;
    body: string;
}

const baseURL = "https://jsonplaceholder.typicode.com/posts/1";

export default function TestAxios() {
  const [post, setPost] = React.useState<PostType | null>(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!post) return null;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}