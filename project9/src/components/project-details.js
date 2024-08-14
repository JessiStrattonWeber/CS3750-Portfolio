import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import projects from './project-list.js';

function ProjectDetails() {
    const { id } = useParams();
    const project = projects.find(proj => proj.id === parseInt(id));
    return (
        <div className="container ">
                <div>
                    <h2>{project.title}</h2>
                    <hr></hr>
                    <h4>{project.description}</h4> 
                    <a href={project.github} className="btn btn-secondary">Github Page</a>
                    <Link to="/portfolio" className="btn btn-secondary">Go Back</Link>
                </div>
            <div className='card '>

                <video controls className="img-fluid detail-video">
                    <source src={project.video} type="video/webm" />
                    <source src={project.video} type="video/mp4" />
                    <source src={project.video} type="video/mkv" />
                    Your browser does not support this video.
                </video>
            </div>


            <div className="row">
                <div className="col-12">
                    <div className='card'>
                        <h4>{project.title} Image Gallery</h4>
                        <div id="imageGallery" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {project.gallery.map((image, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img src={image} className="d-block carousel-image" />
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#imageGallery" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#imageGallery" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-4 d-flex">
                        <div className="card word-card flex-fill">
                            <h5>Project Description</h5>
                            <p>{project.long_description}</p>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex">
                        <div className="card word-card flex-fill">
                            <h5>Technologies Used</h5>
                            <ul>
                                {project.technologies.map((tech, index) => (<li className='card-list' key={index}>{tech}</li>))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex">
                        <div className="card word-card flex-fill">
                            <h5 >My Contributions</h5>
                            <p>{project.contributions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;