import React, { Component } from "react";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewPost from "../components/NewPost";
import PostStatus from "../components/PostStatus";
import axios from "axios";

class Home extends Component {
  _isMounted = false;
  _isLoggedIn = sessionStorage.getItem("username");

  constructor(props) {
    super(props);
    this.state = {
      posts: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getPosts();
  }

  getPosts() {
    axios
      .get(process.env.REACT_APP_BASE_URL + "/api/home")
      .then((res) => {
        if (this._isMounted) {
          let postsReversed = res.data.reverse();
          let numPosts = Object.keys(postsReversed).length;
          numPosts > 0
            ? this.setState({ posts: postsReversed })
            : this.setState({ posts: "Empty" });
        }
      })
      .catch((err) => {
        console.log("Error from posts: " + err);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const userId = sessionStorage.getItem("userId");
    return (
      <div className="wrapper">
        <Header isLoggedIn={this._isLoggedIn} />
        {!this._isLoggedIn && (
          <section className="cards">
            <div className="card card--intro">
              <h1>P</h1>
              <h6>
                Poetical is a platform for collaborating on creative prose
              </h6>
              <p>Register to start posting or browse others creations below.</p>
              <Link to="/register" className="btn">
                Register
              </Link>
            </div>
          </section>
        )}
        <main
          className={
            this.state.posts === null || this.state.posts === "Empty"
              ? "main--loading"
              : undefined
          }
        >
          {this.state.posts === null ? (
            <PostStatus
              message={"Loading Posts . . ."}
              animation={"animate-flicker"}
            />
          ) : this.state.posts === "Empty" ? (
            <PostStatus message={"There are no posts"} />
          ) : (
            <div>
              {this._isLoggedIn && (
                <section className="cards">
                  <NewPost getPosts={() => this.getPosts()} />
                </section>
              )}
              <section className="cards">
                {this.state.posts.map(
                  (post) =>
                    (!post.isPrivate ||
                      post.userId === userId ||
                      post.collaborators.filter(
                        (collaborator) => collaborator.id === userId
                      ).length > 0) && (
                      <Link
                        to={{
                          pathname: `/post/${post._id}`,
                          state: {
                            postId: post._id,
                          },
                        }}
                        className="card post--summary"
                        key={post._id}
                      >
                        <Post post={post} />
                      </Link>
                    )
                )}
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
            </div>
          )}
        </main>
        <Footer
          message={"View on GitHub"}
          link={"https://github.com/ianbaxter/chat-wall"}
        />
      </div>
    );
  }
}

export default Home;
