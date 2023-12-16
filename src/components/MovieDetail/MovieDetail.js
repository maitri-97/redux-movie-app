import React, { useEffect } from "react";
import "./MovieDetail.scss";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncSeasons,
  fetchAsyncMovieOrShowDetail,
  getAllSeasons,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../features/movies/movieSlice";
import Loading from "../Loading/Loading";
import MovieCard from "../MovieCard/MovieCard";

import placeHolderImg from "../../images/poster-placeholder.png";

const MovieDetail = () => {
  const { imdbID } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow) || {};
  const seasons = useSelector(getAllSeasons);
  let renderEpisodes;
  useEffect(() => {
    dispatch(fetchAsyncMovieOrShowDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);

  useEffect(() => {
    if (data.Type === "series" && data.Title && data.totalSeasons) {
      for (let i = 0; i < data.totalSeasons; i++) {
        dispatch(fetchAsyncSeasons({ title: data.Title, season: i + 1 }));
      }
    }
  }, [data]);

  renderEpisodes = (season) => {
    return season ? (
      season?.Response === "True" ? (
        season?.Episodes?.map((movie, index) => (
          <MovieCard key={index} data={movie} />
        ))
      ) : (
        <div className="shows-error">
          <h3>{seasons.Error}</h3>
        </div>
      )
    ) : (
      <Loading />
    );
  };

  return (
    <>
      {Object.keys(data) && Object.keys(data)?.length === 0 ? (
        <Loading />
      ) : (
        <>
          <div className="movie-section">
            <div className="section-left">
              <img
                src={
                  data.Poster !== "N/A" && data?.Poster
                    ? data.Poster
                    : placeHolderImg
                }
                alt={data.Title}
              />
            </div>
            <div className="section-right">
              <div className="movie-title">{data.Title}</div>
              <div className="movie-rating">
                <span>
                  IMDB Rating <i className="fa fa-star"></i> : {data.imdbRating}
                </span>
                <span>
                  IMDB Votes <i className="fa fa-thumbs-up"></i> :{" "}
                  {data.imdbVotes}
                </span>
                <span>
                  Runtime <i className="fa fa-film"></i> : {data.Runtime}
                </span>
                <span>
                  Year <i className="fa fa-calendar"></i> : {data.Year}
                </span>
              </div>
              <div className="movie-plot">{data.Plot}</div>
              <div className="movie-info">
                <div>
                  <span>Director</span>
                  <span>{data.Director}</span>
                </div>
                <div>
                  <span>Stars</span>
                  <span>{data.Actors}</span>
                </div>
                <div>
                  <span>Generes</span>
                  <span>{data.Genre}</span>
                </div>
                <div>
                  <span>Languages</span>
                  <span>{data.Language}</span>
                </div>
                <div>
                  <span>Awards</span>
                  <span>{data.Awards}</span>
                </div>
                {data.totalSeasons && (
                  <div>
                    <span>Total Seasons</span>
                    <span>{data.totalSeasons}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {data?.Type === "series" &&
            [...seasons]
              ?.sort((s1, s2) => s2["Season"] - s1["Season"])
              ?.map((season, idx) => {
                return (
                  season.Response === "True" && (
                    <div className="show-list" key={idx}>
                      <h2>
                        Season {season.Season} - {season.Title}
                      </h2>
                      <div className="movie-container">
                        {renderEpisodes(season)}
                      </div>
                    </div>
                  )
                );
              })}
        </>
      )}
    </>
  );
};

export default MovieDetail;
