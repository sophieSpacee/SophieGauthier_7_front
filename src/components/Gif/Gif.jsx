// import userEvent from "@testing-library/user-event";
import React, { useState, useEffect, useCallback } from "react";
import "../../styles/css/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Comment from "../Comment/Comment";
import people from "../../assets/people.png";
import bin from "../../assets/bin.png";
import Form from "react-bootstrap/Form";

const Gif = ({ element, onDelete }) => {
  const heartIcon = <FontAwesomeIcon icon={faHeart} />;
  const commentIcon = <FontAwesomeIcon icon={faComment} />;
  const [content, setContent] = useState("");
  const [displayCommentBox, setCommentBox] = useState(false);
  const [gif, setGif] = useState(element);
  const user = JSON.parse(localStorage.getItem("user"));

  const gifCreatedByUser = useCallback(() => {
    if(gif.UserId === user.userId) {
      return true
    }
  });

  const [displayDeleteButton, setDeleteButton] = useState(gifCreatedByUser())
  useEffect(() => {
    setDeleteButton(gifCreatedByUser());
  }, [gif, gifCreatedByUser]);


  const userIdInUsersLike = useCallback(() => {
    return gif.usersLiked.usersId.includes(user.userId);
  });
  const [isLiked, setIsLiked] = useState(userIdInUsersLike());
  useEffect(() => {
    setIsLiked(userIdInUsersLike());
  }, [gif, userIdInUsersLike]);

  const [comments, setComments] = useState(null);
  const dateNow = new Date();
  const datePost = new Date(element.createdAt);
  let timeLaps = Math.abs(dateNow - datePost) / 1000;
  const days = Math.floor(timeLaps / 86400);
  timeLaps = timeLaps - days * 86400;
  const hours = Math.floor(timeLaps / 3600) % 24;
  timeLaps = timeLaps - hours * 3600;
  const minutes = Math.floor(timeLaps / 60) % 60;
  timeLaps = timeLaps - minutes * 60;

  if (comments === null) {
    setComments(element.comments);
  }

  const Capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

 
  const likeGif = () => {
    const id = element.id;
    const body = {
      like: 1,
      userId: user.userId,
    };
    fetch("http://localhost:3001/api/gifs/" + id + "/like", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Token " + user.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setGif(response.gif);
      })
      .catch((error) => console.error(error));
  };

  const openCommentForm = () => {
    setCommentBox(true);
  };

  const commentGif = () => {
    const id = element.id;
    const body = {
      content: content,
      userId: user.userId,
      gifId: element.id,
    };
    fetch("http://localhost:3001/api/gifs/" + id + "/comments/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Token " + user.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((response) => {
        setGif(response.gif);
        setCommentBox(false)
      })
      .catch((error) => console.error(error));
  };

  const deleteGif = () => {
    const id = element.id;
    fetch("http://localhost:3001/api/gifs/" + id , {
      method: "DELETE",
      headers: {
        authorization: "Token " + user.token,
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((response) => {
        onDelete();

      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="bg-white-gifs">
      {
        displayDeleteButton ?  <img src={bin} alt="supprimer" className="delete" onClick={deleteGif}></img> : <></>
      }
     
      <div className="gif-container">
        <div className="author-container">
          <span>
            {Capitalize(element.author.first_name) +
              " " +
              Capitalize(element.author.last_name)}
          </span>
          {days > 0 && <span>Il y a {days} jours </span>}
          {days === 0 && hours > 0 && <span>Il y a {hours} heures </span>}
          {days === 0 && hours === 0 && <span>Il y a {minutes} minutes</span>}
        </div>
        <h2 className="titre2"> {gif.title}</h2>
        <img className="gif-image" src={gif.image} alt="Gif" />
        <div className="likes-container">
          <span>{gif.likes} J'aime</span>
          <span>{gif.comments.length} commentaires</span>
        </div>
        <div className="button-container">
          <button
            className={isLiked ? "like-button" : "comment-button"}
            onClick={likeGif}
          >
            {" "}
            {heartIcon} J'aime
          </button>
          <button className="comment-button" onClick={openCommentForm}>
            {" "}
            {commentIcon} Je commente
          </button>
        </div>

        {displayCommentBox && (
          <div className="comment-line">
            <img src={people} alt="icone people" className="people-icon" />
            <Form onSubmit={commentGif}>
              <Form.Group controlId="content">
                <Form.Control
                  className="comment-form"
                  placeholder="Rédigez votre commentaire..."
                  type="text"
                  pattern="^[a-z ,.'-]+$"
                  minLength="2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Group>
            </Form>
            <button
              type="submit"
              className="bouton-comment"
              onClick={commentGif}
            >
              Envoyer
            </button>
          </div>
        )}
        <div className="comments-container">
        {gif.comments && gif.comments.length > 0 ? (
          <>
            {gif.comments.map((element, key) => (
              <Comment element={element} key={element.id} />
            ))}
          </>
        ) : (
          <div></div>
        )}
        </div>
        
      </div>
    </div>
  );
};

export default Gif;
