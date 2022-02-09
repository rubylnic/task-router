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

  const postClickHandler = (evt) => {
    if (evt.target.tagName === "BUTTON") {
      evt.preventDefault()
    }
    setId(evt.target.id);
  }

  const deletePostHandler = (id) => {
    fetchDelete(id);
    setRedirect(!redirect)
  }


  const editPostHandler = (userInfo) => {
    console.log(userInfo, content)
    userInfo.content = content;
    const url = 'http://localhost:7777/posts';
    fetchPost(url, userInfo)
    setRedirect(true)
  }


  function Posts({ posts }) {

    return (
      <>
        <div className="posts">
          {posts.map(post => <Post userInfo={post} link />)}

          <Link className="button" to="/posts/new">Создать пост</Link>
        </div>
      </>
    )
  }
  function Post({ userInfo, link }) {
    function PostItem() {
      return (
        <div className="posts__item" id={userInfo.id}>
          <div>Почтальон Печкин</div>

          <img src="https://chto-takoe-lyubov.net/wp-content/uploads/2019/11/Pochtalon-Pechkin-zagadki.jpg" alt="" width="80" height="80" />
          <div>{userInfo.content}</div>
          {/* <Link to={`/posts/${userInfo.id}/edit`} onClick={() => editPostHandler(userInfo)}>Редактировать</Link> */}


          <Link
            to={`/posts/${userInfo.id}/edit`}
            state={userInfo}
          >
            Редактировать
          </Link>

          <button onClick={() => deletePostHandler(userInfo.id)}>Удалить</button>

        </div>
      )
    }

    if (userInfo) {

      if (link) {
        return (
          <Link to={`/posts/${userInfo.id}`} onClick={postClickHandler}>
            <PostItem />
          </Link>
        )
      } else {
        return (
          <PostItem />
        )
      }


    } else {
      return (<></>)
    }
  }
  function PostEdit(props) {
    const location = useLocation()
    const userInfo = location.state;
    // console.log(userInfo.id)

    // setContent(userInfo.content)
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


  function CreatePost() {
    return (
      <form className="posts__create">
        <h2>Создать пост</h2>
        <textarea onChange={evt => setContent(evt.target.value)} value={content} ></textarea>
        <input onClick={createPostHandle} value="Опубликовать" type="submit" />
        <Link to="/">X</Link>
      </form>
    )
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
          <Route path="/posts/:id/edit" element={redirect ? <Navigate replace to="/" /> : <PostEdit />} />
          <Route path="/posts/:id" element={redirect ? <Navigate replace to="/" /> : <Post userInfo={chosenPost[0]} />} />
          <Route path="/posts/new" element={redirect ? <Navigate replace to="/" /> : <CreatePost />}>

          </Route>
          <Route path="/" element={<Posts posts={users} />}>
          </Route>

        </Routes>


      </Router>
    </>
  )

}

