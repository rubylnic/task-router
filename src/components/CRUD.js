import React from "react";
import { nanoid } from 'nanoid'

import {
  useState,
  useEffect,
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";




export default function CRUD() {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState();
  const [redirect, setRedirect] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    fetchApi('http://localhost:7777/posts', setUsers);
    setRedirect(false)
  }, [redirect]);


  const createPostHandle = (evt) => {
    evt.preventDefault();
    const id = nanoid();
    const url = 'http://localhost:7777/posts';
    console.log(content)
    const data = {
      "id": 0,
      "content": content
    };
    fetchPost(url, data);
    setRedirect(!redirect);
    setContent();
  }

  const handleChange = (evt) => {
    setContent(evt.target.value);
    console.log(evt.target.value)
  }

  const fetchApi = (url, setter) => {
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          setter ? setter(result) : console.log('no setter')
        },
        (error) => {
          console.error('loading error')
        }
      )
  }

  const fetchPost = async (url, data) => {

    try {
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  const fetchDelete = async (id) => {

    await fetch('http://localhost:7777/posts' + '/' + id, {
      method: 'DELETE'
    });
  }

  const deletePostHandler = (id) => {
    fetchDelete(id);
    setRedirect(!redirect)
  }

  const getChosenPost = (id) => {

    const chosenPost = users.filter(obj => {
      return obj.id == id
    })
    return chosenPost;

  }
  const chosenPost = getChosenPost(id)
  console.log(chosenPost, id)



  return (
    <>
      <Router>
        <Routes>
          <Route path="/posts/:id/edit" element={redirect ? <Navigate replace to="/" /> : <PostEdit fetchPost={fetchPost} setRedirect={setRedirect} />} />
          <Route path="/posts/:id" element={redirect ? <Navigate replace to="/" /> : <PostItem deletePostHandler={deletePostHandler} />} />
          <Route path="/posts/new" element={redirect ? <Navigate replace to="/" /> : <CreatePost content={content} setContent={setContent} createPostHandle={createPostHandle} />}>

          </Route>
          <Route path="/" element={<Posts posts={users} deletePostHandler={deletePostHandler} />}>
          </Route>

        </Routes>


      </Router>
    </>
  )

}


function Posts({ posts, deletePostHandler }) {

  return (
    <>
      <div className="posts">
        {posts.map(post => <Post userInfo={post} deletePostHandler={deletePostHandler} link />)}

        <Link className="button" to="/posts/new">Создать пост</Link>
      </div>
    </>
  )
}
function Post({ userInfo, link, deletePostHandler, }) {
  console.log('ddsf')

  const postClickHandler = (evt) => {
    console.log(userInfo)
    if (evt.target.tagName === "BUTTON") {
      evt.preventDefault()
    }
    // setId(evt.target.id);
  }

  if (userInfo) {
    if (link) {
      console.log('g')
      return (
        // <Link to={`/posts/${userInfo.id}`} onClick={postClickHandler}>
        //   <PostItem userInfo={userInfo} deletePostHandler={deletePostHandler} />
        // </Link>
        <Link to={`/posts/${userInfo.id}`} state={{
          userInfo: userInfo,
        }
        }>
          <PostItem userInfo={userInfo} deletePostHandler={deletePostHandler} />
        </Link>
      )
    } else {
      return (
        <PostItem userInfo={userInfo} deletePostHandler={deletePostHandler} />
      )
    }


  } else {
    return (<></>)
  }
  // return (
  //   <Link to={`/posts/${userInfo.id}`} onClick={postClickHandler}>
  //     <PostItem userInfo={userInfo} deletePostHandler={deletePostHandler} />
  //   </Link>
  // )
}

function PostItem({ userInfo, deletePostHandler }) {
  const location = useLocation()
  const userInfoState = location.state;

  if (!userInfo) {
    userInfo = userInfoState.userInfo;
  }

  console.log(userInfo)
  return (
    <div className="posts__item" id={userInfo.id}>
      <div>Почтальон Печкин</div>

      <img src="https://chto-takoe-lyubov.net/wp-content/uploads/2019/11/Pochtalon-Pechkin-zagadki.jpg" alt="" width="80" height="80" />
      <div>{userInfo.content}</div>

      <Link to={`/posts/${userInfo.id}/edit`} state={{
        userInfo: userInfo,
      }}>
        Редактировать
      </Link>

      <button onClick={() => deletePostHandler(userInfo.id)}>Удалить</button>

    </div>
  )
}


function PostEdit({ fetchPost, setRedirect }) {
  const [content, setContent] = useState();
  const location = useLocation()
  const userInfo = location.state;
  console.log(userInfo);


  const editPostHandler = ({ userInfo }) => {
    console.log('edit post')
    userInfo.content = content;
    console.log(userInfo);
    const url = 'http://localhost:7777/posts';
    fetchPost(url, userInfo)
    setRedirect(true)
  }


  return (
    <form className="posts__edit">
      <h2>Редактировать пост</h2>
      <textarea name="textarea" id="textarea" key="fffff" onChange={(evt) => setContent(evt.target.value)}></textarea>
      {/* <input onClick={() => editPostHandler(userInfo)} value="Опубликовать" type="submit" /> */}
      <Link to='/' onClick={() => editPostHandler(userInfo)}>Опубликовать</Link>
      <Link to={`/posts/${userInfo.id}/`}>X</Link>
    </form>
  )
}


function CreatePost({ setContent, content, createPostHandle }) {
  return (
    <form className="posts__create">
      <h2>Создать пост</h2>
      <textarea onChange={evt => setContent(evt.target.value)} value={content} ></textarea>
      <input onClick={createPostHandle} value="Опубликовать" type="submit" />
      <Link to="/">X</Link>
    </form>
  )
}
