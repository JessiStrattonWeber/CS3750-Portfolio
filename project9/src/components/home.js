import React from 'react';
import { Link } from 'react-router-dom';

const mainGalleryImages = [
  "../../images//main/1.jpg",
  "../../images//main/2.jpg",
  "../../images//main/3.jpg",
  "../../images//main/4.jpg",
  "../../images//main/5.jpg",
];


function Home() {
  return (
    <div className="container">
      <div>
        <h1>My Portfolio</h1>
        <h3>Welcome To Jessi Stratton's CS 3750: Software Engineering Portfolio</h3>
        <hr />
        <a className="btn btn-primary" href='https://github.com/JessiStrattonWeber/CS3750-Portfolio'>View Code</a>
        <Link className="btn btn-primary" to="/portfolio">View Projects</Link>
        <div className="row">
          <div className="col-12">
            <div className='card'>
              <div id="mainGallery" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {mainGalleryImages.map((image, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img src={image} className="d-block carousel-image" />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#mainGallery" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#mainGallery" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
