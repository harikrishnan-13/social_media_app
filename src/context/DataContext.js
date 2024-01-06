import { createContext, useState, useEffect } from "react";
import useAxiosFetch from "../hooks/useAxiosFetch";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/posts";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const navigate = useNavigate();
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:8000/posts');

    useEffect(() => {
        setPosts(data);
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try {
            const response = await api.post('/posts', newPost);
            alert("Post created successfully");
            const allPosts = [...posts, response.data];
            setPosts(allPosts);
            setPostTitle('');
            setPostBody('');
            navigate('/');
        }
        catch (err) {
            console.log(`Error:${err.message}`);
        }
    };


    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };
        try {
            const response = await api.patch(`/posts/${id}`, updatedPost);
            alert("Post updated successfully");
            setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
            setEditTitle('');
            setEditBody('');
            navigate('/');
        }
        catch (err) {
            console.log(`Error:${err.message}`);
        }
    };

    useEffect(() => {
        const filteredResults = posts.filter((post) =>
            ((post.body).toLowerCase()).includes(search.toLowerCase())
            ||
            ((post.title).toLowerCase()).includes(search.toLowerCase())
        );
        setSearchResults(filteredResults.reverse());
    }, [posts, search])


    const handleDelete = async (id) => {
        try {
            await api.delete(`/posts/${id}`);
            alert("Post deleted successfully");
            const postList = posts.filter(post => post.id !== id);
            setPosts(postList);
            navigate('/');
        }
        catch (err) {
            console.log(`Error:${err.message}`);
        }
    }
    return (
        <DataContext.Provider value={{
            search,setSearch,searchResults,fetchError,isLoading,handleSubmit, postTitle, setPostTitle, postBody, setPostBody,posts, handleDelete,
            handleEdit, editTitle, editBody, setEditTitle, setEditBody
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext