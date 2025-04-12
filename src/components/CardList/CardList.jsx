import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

import API from '../../TMDBservice/TMDBservice';
import Spinner from '../UI/Spinner/Spinner';
import Error from '../UI/Error/Error';
import PaginationUI from '../UI/Pagination/Pagination';
import { APIConsumer } from '../../TMDBContext/TMDBContext';

import CardItem from './CardItem/CardItem';

import './CardList.scss';

const CardList = ({ query, tab, guestId }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('Type to search...');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRated, setCurrentPageRated] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [ratingList, setRatingList] = useState([]);

  const api = new API();

  const onMoviesLoad = (movies) => {
    setMovies(movies);
    setIsLoading(false);
    setIsError(false);
  };

  const onError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const getMovies = useCallback((query = '', currentPage) => {
    if (query.length === 0) {
      setMessage('Type to search...');
    }
    api.getMoviesOnQuery(query, currentPage)
      .then((res) => {
        onMoviesLoad(res.results);
        setTotalItems(res.totalItems);
      })
      .catch(onError);
  }, []);

  const getMoviesWithRating = useCallback((guestId, currentPage) => {
    api.getMoviesWithRating(guestId, currentPage)
      .then((res) => {
        onMoviesLoad(res.results);
        setTotalItems(res.totalItems);
      })
      .catch(onError);
  }, []);

  const debounceGetMovies = useCallback(
    debounce((query, currentPage) => {
      setIsLoading(true);
      setMessage('We are very sorry, but we have not found anything...');
      getMovies(query, currentPage);
    }, 1500),
    []
  );

  const paginationOnChange = (page) => {
    if (tab === 'Search') {
      setCurrentPage(page);
    } else {
      setCurrentPageRated(page);
    }
  };

  const addRatedMovie = (id, value) => {
    setRatingList((prevRatingList) => [...prevRatingList, { id, value }]);
  };

  const removeRatedMovie = (id) => {
    setRatingList((prevRatingList) => prevRatingList.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (sessionStorage.getItem('ratingList')) {
      setRatingList(JSON.parse(sessionStorage.getItem('ratingList')));
    }
  }, []);

  useEffect(() => {
    if (tab === 'Search') {
      debounceGetMovies(query, currentPage);
    } else {
      getMoviesWithRating(guestId, currentPageRated);
    }
  }, [query, currentPage, currentPageRated, tab, guestId, debounceGetMovies, getMoviesWithRating]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, currentPageRated]);

  useEffect(() => {
    sessionStorage.setItem('ratingList', JSON.stringify(ratingList));
  }, [ratingList]);

  const errorView = isError ? <Error message="Oops. Something went wrong. Try again." type="error" /> : null;
  const spinner = isLoading && !isError ? <Spinner fontSize={60} /> : null;
  const page = tab === 'Search' ? currentPage : currentPageRated;
  const cardList = !(isLoading || isError) ? (
    <CardListView
      movies={movies}
      message={message}
      current={page}
      onChange={paginationOnChange}
      totalItems={totalItems}
      guestId={guestId}
      addRatedMovie={addRatedMovie}
      removeRatedMovie={removeRatedMovie}
      ratingList={ratingList}
    />
  ) : null;

  return (
    <>
      {errorView}
      {spinner}
      {cardList}
    </>
  );
};

const CardListView = ({
  movies,
  message,
  current,
  onChange,
  totalItems,
  guestId,
  addRatedMovie,
  removeRatedMovie,
  ratingList,
}) => {
  return movies.length > 0 ? (
    <APIConsumer>
      {({ genres, postRating, deleteRating }) => (
        <>
          <ul className="card-list">
            {movies.map((movie) => {
              let rating = ratingList.find((item) => item.id === movie.id)?.value;
              return (
                <CardItem
                  key={movie.id}
                  movie={movie}
                  genresList={genres}
                  postRating={postRating}
                  deleteRating={deleteRating}
                  guestId={guestId}
                  addRatedMovie={addRatedMovie}
                  removeRatedMovie={removeRatedMovie}
                  rating={rating}
                />
              );
            })}
          </ul>
          <PaginationUI current={current} onChange={onChange} totalItems={totalItems} />
        </>
      )}
    </APIConsumer>
  ) : (
    <Error message={message} type="info" />
  );
};

export default CardList;
