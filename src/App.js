import React, { useState } from 'react';
import { JigsawStack } from "jigsawstack";
import './App.css';

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const API_KEY = "sk_b7f618f37cec84ada435c5a954cc27cccc163e003cde2571b2410735149f215b455d797d7591a31d77d44202e6c6da5e3ea913ce170938929c20f6dcfdf5b906024IrcN2gJoHRyd06eoAL"
      // const jigsaw = JigsawStack({ apiKey: API_KEY });
      // const resp = await jigsaw.web.search({"query": searchText});

      const response = await fetch('https://api.jigsawstack.com/v1/web/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ query: searchText })
      });
      const data = await response.json();

      const results = {
        text: data.ai_overview || 'No overview',
        images: data.image_urls || [],
        links: data.results || []
      };

      setSearchResults(results.text);
      setImages(results.images);
      setLinks(results.links);
    } catch (err) {
      setError('Failed to fetch search results');
      setSearchResults(null);
      setImages([]);
      setLinks([]);
      console.error("Search Error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Search</h1>
      </header>

      <div className="main-content">
        <div className="search-results-container">
          <div className="search-box">
            <textarea
              className="search-textarea"
              placeholder="Enter your search (5-2000 characters)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              maxLength={2000}
            />
            <div className="search-controls">
              <span className="char-count">{searchText.length}/2000 characters</span>
              <button
                onClick={handleSearch}
                disabled={searchText.length < 5 || isLoading}
                className="search-button"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          {searchResults && (
            <div className="results-section">
              <h2>Results</h2>
              <p>{searchResults}</p>
            </div>
          )}

          {images.length > 0 && (
            <div className="images-section">
              <h2>Images</h2>
              <div className="images-grid">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Search result ${index + 1}`}
                    className="image-item"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sources-sidebar">
          <div className="sources-container">
            <h2>Sources</h2>
            {links.length > 0 ? (
              <ul className="sources-list">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-sources">No sources available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;