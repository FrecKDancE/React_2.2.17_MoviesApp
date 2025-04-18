import React, { useState, useEffect } from 'react';
import './App.scss';
import Main from '../Main/Main';
import Header from '../Header/Header';
import API from '../../TMDBservice/TMDBservice';
import { APIProvider } from '../../TMDBContext/TMDBContext';
import Error from '../UI/Error/Error';

const App = () => {
  const api = new API();

  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [guestId, setGuestId] = useState('');
  const [tab, setTab] = useState('Search');
  const [isError, setIsError] = useState(false);

  const searchMovies = (query) => {
    setQuery(query.trim());
  };

  const getGenresList = () => {
    api.getGenresList()
      .then((res) => {
        setGenres(res);
      })
      .catch(() => {
        setIsError(true);
      });
  };

  const getGuestId = () => {
    if (!sessionStorage.getItem('guestId')) {
      api.createGuestSession()
        .then((res) => {
          sessionStorage.setItem('guestId', res);
          setGuestId(res);
        })
        .catch(() => {
          setIsError(true);
        });
    } else {
      setGuestId(sessionStorage.getItem('guestId'));
    }
  };

  const onChangeTabs = (key) => {
    setTab(key);
  };

  useEffect(() => {
    getGuestId();
    getGenresList();
  }, []);

  const appView = isError ? (
    <Error message="Oops. Something went wrong. Try again." type="error" />
  ) : (
    <APIProvider value={{ genres, postRating: api.postRating, deleteRating: api.deleteRating }}>
      <Header onChangeTabs={onChangeTabs} />
      <Main query={query} searchMovies={searchMovies} tab={tab} guestId={guestId} />
    </APIProvider>
  );

  return <>{appView}</>;
};

export default App;
