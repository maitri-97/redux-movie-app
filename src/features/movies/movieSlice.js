import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import movieApi from "../../common/apis/movieApi";
import { APIKey } from "../../common/apis/MovieApiKey";

export const fetchAsyncMovies = createAsyncThunk(
  "movies/fetchAsyncMovies",
  async (movieText = initialState.searchKeyWord) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=${movieText}&type=movie`
    );
    return response.data;
  }
);

export const fetchAsyncShows = createAsyncThunk(
  "movies/fetchAsyncShows",
  async (seriesText = initialState.searchKeyWord) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=${seriesText}&type=series`
    );
    return response.data;
  }
);

export const fetchAsyncSeasons = createAsyncThunk(
  "movies/fetchAsyncSeasons",
  async ({ title = "", season = 1 }) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&t=${title}&Season=${season}`
    );
    return response.data;
  }
);

export const fetchAsyncMovieOrShowDetail = createAsyncThunk(
  "movies/fetchAsyncMovieOrShowDetail",
  async (id) => {
    const response = await movieApi.get(`?apiKey=${APIKey}&i=${id}&Plot=full`);
    return response.data;
  }
);

const initialState = {
  movies: {},
  shows: {},
  seasons: [],
  selectMovieOrShow: {},
  searchKeyWord: "game",
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    removeSelectedMovieOrShow: (state) => {
      state.selectMovieOrShow = {};
      state.seasons = [];
    },
    updateSearchKeyWord: (state, { payload }) => {
      return {
        ...state,
        searchKeyWord: payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncMovies.pending, (state, { payload }) => {
      console.log("Pending..");
    });
    builder.addCase(fetchAsyncMovies.fulfilled, (state, { payload }) => {
      return { ...state, movies: payload };
    });
    builder.addCase(fetchAsyncMovies.rejected, (state, { payload }) => {
      console.log("Rejected!");
    });
    builder.addCase(fetchAsyncShows.pending, (state, { payload }) => {
      console.log("Pending..");
    });
    builder.addCase(fetchAsyncShows.fulfilled, (state, { payload }) => {
      return { ...state, shows: payload };
    });
    builder.addCase(fetchAsyncShows.rejected, (state, { payload }) => {
      console.log("Rejected!");
    });
    builder.addCase(fetchAsyncSeasons.pending, (state, { payload }) => {
      console.log("Pending..");
    });
    builder.addCase(fetchAsyncSeasons.fulfilled, (state, { payload }) => {
      return {
        ...state,
        seasons: [...state.seasons, payload],
      };
    });
    builder.addCase(fetchAsyncSeasons.rejected, (state, { payload }) => {
      console.log("Rejected!");
    });
    builder.addCase(
      fetchAsyncMovieOrShowDetail.fulfilled,
      (state, { payload }) => {
        return { ...state, selectMovieOrShow: payload };
      }
    );
  },
});

export const { removeSelectedMovieOrShow, updateSearchKeyWord } =
  movieSlice.actions;
export const getAllMovies = (state) => state.movies.movies;
export const getAllShows = (state) => state.movies.shows;
export const getAllSeasons = (state) => state.movies.seasons;
export const getSearchKeyWord = (state) => state.movies.searchKeyWord;
export const getSelectedMovieOrShow = (state) => state.movies.selectMovieOrShow;
export default movieSlice.reducer;
