import "../PublicCSS/templatestyle.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { baseURL } from "../../urlConfig.js";

export function ShelterCreateBlog() {
  const [title, setTitle] = useState("");  // New state for title
  const [numFields, setNumFields] = useState(0);
  const [inputs, setInputs] = useState([]);
  const navigate = useNavigate();
  const [errormsg, setErrormsg] = useState("");

  // localStorage.removeItem("blog");
  // console.log(localStorage.getItem("blog"));

  useEffect(() => {
    // Check if "blog" is defined in localStorage
    const storedBlog = localStorage.getItem("blog");
    if (storedBlog) {
      const parsedBlog = JSON.parse(storedBlog);
      setTitle(parsedBlog[0].value);  // Set title from parsed blog
      setNumFields(parsedBlog.length - 1);  // Exclude title from field count
      setInputs(parsedBlog.slice(1));  // Exclude title from inputs
    }
  }, []);

  const handleAddField = (type) => {
    setNumFields((prevNumFields) => prevNumFields + 1);
    setInputs((prevInputs) => [...prevInputs, { type, value: "" }]);
  };

  const handleChange = async (index, event) => {
    const value = event.target.files || event.target.value;

    if (index === 0) {
      // Handle title separately
      setTitle(value);
    } else {
      // Handle other fields
      if (inputs[index - 1].type === "file" && value.length > 0) {
        const file = value[0];
        const base64String = await convertFileToBase64(file);
        setInputs((prevInputs) => {
          const newInputs = [...prevInputs];
          newInputs[index - 1].value = base64String;
          return newInputs;
        });
      } else {
        setInputs((prevInputs) => {
          const newInputs = [...prevInputs];
          newInputs[index - 1].value = value;
          return newInputs;
        });
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDelete = (index) => {
    setNumFields((prevNumFields) => prevNumFields - 1);
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs.splice(index - 1, 1);
      return newInputs;
    });
  };

  const handlePreview = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "blog",
      JSON.stringify([{ type: "title", value: title }, ...inputs])
    );
    navigate("/blog/preview"); // Redirect to the desired page after submission
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    const emptyFields = inputs.filter(input => !input.value.trim());

    if (emptyFields.length > 0) {
      // Display an error message for empty fields
      // alert("Some fields are empty. Please insert or delete.");
      setErrormsg("Some fields are empty. Please fill or delete them.")
      return;
    }

    // Step 1: Create a new blog
    try {
      const blogResponse = await Axios.post(
        `${baseURL}blogs/creation/`,
        {
          title,
          num_components: inputs.length
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      const blogId = blogResponse.data.pk; // Assuming pk is the identifier for the blog

      // Step 2: Iterate through inputs and make additional API calls
      for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        if (input.type === "text" || input.type === "subtitle") {
          var input_type = 1;
          if (input.type === "text") {
            input_type = 2;
          }
          // For subtitle/text, call the blurb creation API
          await Axios.post(
            `${baseURL}blogs/blurb/creation/${blogId}/`,
            {
              content: input.value,
              content_type: input_type,
              index
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            },
          );
        } else if (input.type === "file") {
          const formData = new FormData();
          const byteCharacters = atob(input.value.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          formData.append('content', blob, `image_${index}.jpg`);
          // formData.append('content', input.value);
          formData.append('index', index);
          await Axios.post(
            `${baseURL}blogs/image/creation/${blogId}/`,
            formData,
            {
              headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            },
          );
        }
      }
      localStorage.removeItem("blog");

      navigate("/shelter/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (element.scrollHeight) + "px";
  }

  function handleBack() {
    navigate("/shelter/blogs");
  }

  return (
    <div>
      {header()}
      {sidebar()}
      <div className="content-box">
        <div
          style={{ display: "flex", justifyContent: "flex-end", margin: 0, marginBottom: "-2rem" }}
        >
          <button onClick={handleBack}
            style={{ margin: 0 }}>
            Back
          </button>
        </div>
        <h1>Blog Creation</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "3rem" }}>
            <h2>Title</h2>
            <textarea
              value={title}
              onChange={(event) => {
                textAreaAdjust(event.target);
                handleChange(0, event);
              }}
              placeholder="Title"
              className="form-control"
              required
              style={{ margin: 0 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span>{title.length}/8000</span></div>
          </div>
          <h2>Content</h2>
          {[...Array(numFields)].map((_, index) => (
            <div key={index}>
              {inputs[index].type === "text" || inputs[index].type === "subtitle" ? (
                <div style={{ marginBottom: "3rem" }}>
                  <textarea
                    value={inputs[index].value}
                    onChange={(event) => {
                      textAreaAdjust(event.target);
                      handleChange(index + 1, event);
                    }}
                    placeholder={`Type ${inputs[index].type === "text" ? "here..." : "subtitle..."}`}
                    className="form-control"
                    required
                    style={{ margin: 0 }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ width: "100%" }}>
                      <button type="button" onClick={() => handleDelete(index + 1)}
                        style={{ margin: 0 }}>
                        Delete
                      </button>
                    </div>
                    <span>{inputs[index].value.length}/8000</span>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: "3rem" }}>
                  <input
                    type="file"
                    id={`input${index + 1}`}
                    name={`input${index + 1}`}
                    className="form-control"
                    onChange={(event) => handleChange(index + 1, event)}
                    style={{ margin: 0 }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <button type="button" onClick={() => handleDelete(index + 1)}
                      style={{ margin: 0 }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <p className="error-text" style={{ margin: 0 }}>{errormsg}</p>
          <div>
            <button type="button" onClick={() => handleAddField("subtitle")}>
              Add Subtitle
            </button>
            <button type="button" onClick={() => handleAddField("text")}>
              Add Text
            </button>
            <button type="button" onClick={() => handleAddField("file")}>
              Add Image
            </button>
          </div>
          <div>
            <button onClick={handlePreview}>Preview</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}