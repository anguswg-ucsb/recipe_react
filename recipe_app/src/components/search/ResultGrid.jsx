// ####################### GOOD TO GO (Single state object) #######################
// ####################### GOOD TO GO (Single state object) #######################

import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
// import styles from "./SearchBar.module.css";

function ResultGrid({ cardData }) {
  return (
    <div className="container">
      <div className="section">
        <div className="columns">
          <div className="column has-text-centered">
            <h1 className="title" style={{ color: "ghostwhite" }}>
              Bulma Card Layout Template
            </h1>
            <br />
          </div>
        </div>
        <div className="row columns is-multiline">
          {cardData ? (
            cardData.map((card) => (
              <div key={card.id} className="column is-4">
                <div className="card large">
                  <div className="card-image">
                    <figure className="image is-16by9">
                      <img src={card.image} alt="Image" />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <img src={card.avatar} alt="Image" />
                        </figure>
                      </div>
                      <div className="media-content">
                        <p className="title is-4 no-padding">
                          {card.user.title}
                        </p>
                        <p>
                          <span className="title is-6">
                            <a href={`http://twitter.com/${card.user.handle}`}>
                              {card.user.handle}
                            </a>
                          </span>
                        </p>
                        <p className="subtitle is-6">{card.user.title}</p>
                      </div>
                    </div>
                    <div className="content">
                      {card.content}
                      <div className="background-icon">
                        <span className="icon-twitter"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultGrid;
