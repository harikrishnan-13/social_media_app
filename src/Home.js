import React, { useContext } from 'react';
import Feed from './Feed';
import DataContext from './context/DataContext';

const Home = () => {
    const { searchResults: posts, fetchError, isLoading } = useContext(DataContext);

    return (
        <main className='Home'>
            {isLoading && <p className='statusMsg'>Loading Posts...</p>}
            {!isLoading && fetchError && <p className='statusMsg' style={{ color: "red" }}>{fetchError}</p>}
            {!isLoading && !fetchError && (posts.length ? <Feed posts={posts} /> : <p style={{ marginTop: "2rem" }}>No posts to display</p>)}
        </main>
    )
}

export default Home