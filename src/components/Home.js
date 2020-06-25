import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Post from "./Post";
import Textarea from "react-textarea-autosize";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

class Home extends Component {
  constructor(props) {
    super(props);
    this._isLoggedIn = false;
    this.state = {
      title: "",
      textBody: "",
      posts: [],
    };
  }

  componentDidMount() {
    sessionStorage.getItem("username")
      ? (this._isLoggedIn = true)
      : (this._isLoggedIn = false);
    this.getPosts();
  }

  getPosts() {
    axios
      .get(process.env.REACT_APP_BASE_URL + "/api/blogHome")
      .then((res) => {
        let postsReversed = res.data.reverse();
        this.setState({ posts: postsReversed });
      })
      .catch((err) => {
        console.log("Error from posts:SS " + err);
      });
  }

  onSaveClick() {
    const data = {
      title: this.state.title,
      body: this.state.textBody,
      username: this._isLoggedIn
        ? sessionStorage.getItem("username")
        : "Anonymous",
    };
    axios
      .post(process.env.REACT_APP_BASE_URL + "/api/blogHome", data)
      .then((res) => {
        this.getPosts();
      })
      .catch((err) => {
        console.log("Error updating post: " + err);
      });
  }

  handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="wrapper">
        <Header isLoggedIn={this._isLoggedIn} />
        <main>
          {this._isLoggedIn && (
            <section className="cards">
              <div className="card">
                <Textarea
                  name="title"
                  cols="50"
                  rows="1"
                  placeholder="Enter Title"
                  value={this.state.title}
                  onChange={this.handleInputChange}
                />
                <Textarea
                  name="textBody"
                  cols="50"
                  rows="1"
                  placeholder="Enter New Content"
                  value={this.state.textBody}
                  onChange={this.handleInputChange}
                />
                <button className="btn" onClick={() => this.onSaveClick()}>
                  Save
                </button>
              </div>
            </section>
          )}
          <section className="cards">
            {this.state.posts
              ? this.state.posts.map((post) => (
                  <Link
                    to={`/blog-post-details/${post._id}`}
                    className="card post--summary"
                    key={post._id}
                  >
                    <Post
                      title={post.title}
                      post={post.body}
                      date={post.dateEdited}
                      username={post.username}
                    />
                  </Link>
                ))
              : "There are no posts."}
          </section>
          <section className="bottom">
            <a href="#top">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="36px"
                height="36px"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
            </a>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Home;