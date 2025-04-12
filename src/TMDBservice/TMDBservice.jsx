export default class API {
  _apiToken =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTQ1ZjBiMmRkOTc0MmJmN2JiNmYzYjhmNmJlOTEzMSIsIm5iZiI6MTc0MDQ0MTgzMy45MDgsInN1YiI6IjY3YmQwOGU5MGEzYjA1YzQ5NWE0ODA5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JmXIdeY_Pzi_-T390zOtAt96xeHa3d0XtaE3qnLIIFA"

  _apiKey = "a545f0b2dd9742bf7bb6f3b8f6be9131"

  _mainUrl = "https://api.themoviedb.org/3/"

  _headers = {
    accept: "application/json",
    Authorization: `${this._apiToken}`,
  }

  getResponse = async (url) => {
    const response = await fetch(`${this._mainUrl}${url}`, {
      method: "GET",
      headers: this._headers,
    })

    if (response.ok) {
      return await response.json()
    }

    throw new Error(`Could not fetch data to ${this._mainUrl}${url}`)
  }

  postRating = async (guestId, movieId, value) => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/jsoncharset=utf-8",
      },
      body: `{"value": ${value}}`,
    }

    const response = await fetch(
      `${this._mainUrl}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestId}`,
      options,
    )

    if (response.ok) {
      return await response.json()
    }

    throw new Error("Could not post data rating")
  }

  deleteRating = async (guestId, movieId) => {
    const options = {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/jsoncharset=utf-8",
      },
    }

    const response = await fetch(
      `${this._mainUrl}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestId}`,
      options,
    )

    if (response.ok) {
      return await response.json()
    }

    throw new Error("Could not post data rating")
  }

  getMoviesOnQuery(query, page = 1, adult = false, language = "en-US") {
    return this.getResponse(
      `search/movie?query=${query}&include_adult=${adult}&language=${language}&page=${page}`,
    ).then((res) => {
      return {
        results: res.results,
        totalItems: res.total_results,
      }
    })
  }

  getGenresList(language = "en") {
    return this.getResponse(`genre/movie/list?language=${language}`).then(
      (res) => res.genres,
    )
  }

  createGuestSession() {
    return this.getResponse("authentication/guest_session/new").then(
      (res) => res.guest_session_id,
    )
  }

  getMoviesWithRating = async (guestId, page = 1, language = "en-US") => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }

    const response = await fetch(
      `${this._mainUrl}guest_session/${guestId}/rated/movies?api_key=${this._apiKey}&language=${language}&page=${page}&sort_by=created_at.asc`,
      options,
    )

    if (response.ok) {
      return await response.json().then((res) => {
        return {
          results: res.results,
          totalItems: res.total_results,
        }
      })
    }

    throw new Error(`Could not fetch data to ${this._mainUrl}`)
  }
}
