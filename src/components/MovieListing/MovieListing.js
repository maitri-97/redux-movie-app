import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllMovies,
  getAllShows,
  getSearchKeyWord,
  updateSearchKeyWord,
} from "../../features/movies/movieSlice";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieListing.scss";
import Loading from "../Loading/Loading";

import { useDispatch } from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
} from "../../features/movies/movieSlice";

const MovieListing = () => {
  const dispatch = useDispatch();
  const searchKeyWord = useSelector(getSearchKeyWord);
  const [searchTerm, setSearchTerm] = useState(searchKeyWord);

  useEffect(() => {
    dispatch(fetchAsyncMovies(searchKeyWord));
    dispatch(fetchAsyncShows(searchKeyWord));
  }, []);

  const movies = useSelector(getAllMovies),
    series = useSelector(getAllShows);
  let renderMovies, renderSeries;

  renderMovies = movies ? (
    movies?.Response === "True" ? (
      movies?.Search?.map((movie, index) => (
        <MovieCard key={index} data={movie} />
      ))
    ) : (
      <div className="movies-error">
        <h3>{movies?.Error}</h3>
      </div>
    )
  ) : (
    <Loading />
  );
  renderSeries = series ? (
    series?.Response === "True" ? (
      series?.Search?.map((movie, index) => (
        <MovieCard key={index} data={movie} />
      ))
    ) : (
      <div className="series-error">
        <h3>{series.Error}</h3>
      </div>
    )
  ) : (
    <Loading />
  );

  const handleChange = (e) => {
    dispatch(updateSearchKeyWord(e.target.value));
  };

  const getSearchData = (searchKey) => {
    dispatch(fetchAsyncMovies(searchKey));
    dispatch(fetchAsyncShows(searchKey));
    setSearchTerm(searchKey);
  };

  return (
    <div className="movie-wrapper">
      <div className="movie-list">
        <p>Showing search results for {searchTerm}</p>
        <div className="search-wrapper-outer">
          <div className="search-wrapper">
            <input
              type="text"
              value={searchKeyWord}
              className="search-input"
              onChange={handleChange}
            />
            <button
              type="button"
              className="search-btn"
              onClick={() => getSearchData(searchKeyWord)}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
          {/* <div className="search-results">
            <div className="search-item">
              <div className="img-wrap">
                <img src="" alt="" />
              </div>
              <div className="text-wrap"></div>
            </div>
          </div> */}
        </div>
        <h2>Movies</h2>
        <div className="movie-container">{renderMovies}</div>
      </div>
      <div className="show-list">
        <h2>Series</h2>
        <div className="movie-container">{renderSeries}</div>
      </div>
    </div>
  );
};

export default MovieListing;
