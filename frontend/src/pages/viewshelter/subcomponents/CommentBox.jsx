import "../shelter-information.css";
import { baseURL } from "../../../urlConfig";

export function CommentBox(comment) {
    return (
      <div className="shelter-comment-box">
        <p style={{margin: 0}}>
            <strong>{comment.commenter.username}</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {comment.creation_time}
            {comment.rating !== null && (
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;Rating: {comment.rating} star
              </span>
            )}
            </p>
        <p style={{margin: 0}}>{comment.content}</p>
      </div>
    );
  }