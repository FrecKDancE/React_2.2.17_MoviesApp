import React, { useState } from "react"

import "./SearchInput.scss"

const SearchInput = ({ searchMovies }) => {
  const [value, setValue] = useState("")

  const onChange = (evt) => {
    setValue(evt.target.value)
    searchMovies(evt.target.value)
  }

  return (
    <form className="form" onSubmit={(evt) => evt.preventDefault()}>
      <input
        className="search-input"
        placeholder="Type to search..."
        value={value}
        onChange={onChange}
      />
    </form>
  )
}

export default SearchInput
