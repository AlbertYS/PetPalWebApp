import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { baseURL } from "../../urlConfig.js";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { useNavigate } from "react-router-dom";

export const ShelterViewBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [blogData, setBlogData] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await Axios.get(`${baseURL}blogs/blog/${id}/`);
                setBlogData(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchBlogData();
    }, [id]);

    const renderComponents = () => {
        if (!blogData || !blogData.blurbs || !blogData.blog_images) {
            return null;
        }
        const combinedComponents = [...blogData.blurbs, ...blogData.blog_images];
        const sortedComponents = combinedComponents.sort((a, b) => a.index - b.index);
        console.log(sortedComponents);
    
        return sortedComponents.map((component) => {
            if (!("content_type" in component)) {
                console.log("Img");
                return <img key={component.id} src={component.content} 
                style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '10px' }}
                alt={`Image ${component.index}`} />;
            } else if (component.content_type === 1) {
                return <h2 key={component.id}>{component.content}</h2>;
            } else if (component.content_type === 2) {
                return <p key={component.id}>{component.content}</p>;
            }
            return null;
        });
    };

    function handleBack() {
        navigate("/shelter/blogs");
    }

    return (
        <div>
            {header()}
            {sidebar()}
            <div className="content-box">
                <div
                style={{display: "flex", justifyContent: "flex-end", margin:0, marginBottom:"-2rem"}}
                >
                    <button onClick={handleBack}
                    style={{margin:0}}>
                        Back
                    </button>
                </div>
                {blogData && (
                    <div>
                    <h1>{blogData.title}</h1>
                    {renderComponents()}
                    </div>
                )}
            </div>
        </div>
    );
};