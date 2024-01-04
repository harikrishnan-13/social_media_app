import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import About from "./About";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Nav from "./Nav";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Post from "./Post";
import PostLayout from "./PostLayout";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./api/posts"
import EditPost from "./EditPost";
import useAxiosFetch from "./hooks/useAxiosFetch";

function App() {

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchresults, setSearchResults] = useState([]);
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
    <div className="App">
      <Header title={"Social Media App"} />
      <Nav
        search={search}
        setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home
          posts={searchresults}
          fetchError={fetchError}
          isLoading={isLoading} />} />
        <Route path="/post">
          <Route index element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            postBody={postBody}
            setPostTitle={setPostTitle}
            setPostBody={setPostBody} />} />
          <Route path=":id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/edit/:id" element={<EditPost
          posts={posts}
          handleEdit={handleEdit}
          editTitle={editTitle}
          editBody={editBody}
          setEditTitle={setEditTitle}
          setEditBody={setEditBody} />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
