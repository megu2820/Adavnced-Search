import React, { useState, useRef, useEffect } from "react";
import "./App.css"
import ListItem from "./components/ListItem";

const App = () => {
    const [searchTerm, setSearchTerm] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const resultsListRef = useRef(null); 
    const [clickedResult, setClickedResult] = useState(null); 
    const [mockData, setMockData] = useState([]);
  
    useEffect(() => {
      // Focus on the search input when the component mounts
      const input = document.querySelector(".search-input");
      input.focus();
    }, []);

    useEffect(() => {
      // Fetch data from the API during initial load
      fetch(
          "https://fe-take-home-assignment.s3.us-east-2.amazonaws.com/Data.json"
           )
          .then((response) => response.json())
          .then((data) => {
              setMockData(data);
          })
          .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        const results = mockData.filter((result) => {
          const lowercaseFields = Object.values(result).map(field =>
            Array.isArray(field)
              ? field.map(item => item.toLowerCase())  
              : typeof field === 'string' ? field.toLowerCase() : field
          );
          const flattenedFields = lowercaseFields.flat().join(' ');
          console.log(flattenedFields.includes(value.toLowerCase()))
          return flattenedFields.includes(value.toLowerCase());
        });
        setSearchResults(results);
        setSelectedIndex(-1); 
  };
      
  
  const handleKeyDown = (event) => {
      const resultsCount = searchResults.length;
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault(); // Prevent default behavior (e.g., scrolling the page)
          setSelectedIndex((prevIndex) =>
            prevIndex < resultsCount - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case "ArrowUp":
          event.preventDefault(); // Prevent default behavior (e.g., scrolling the page)
          setSelectedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : -1
          );
          break;
        case "Enter":
          if (selectedIndex !== -1) {
            setSearchTerm(searchResults[selectedIndex]);
          }
          break;
        default:
          break;
      }
    };
  
    useEffect(() => {
      // Scroll to the selected index in the results list
      if (resultsListRef.current && selectedIndex !== -1) {
        const selectedElement = resultsListRef.current.children[selectedIndex];
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }, [selectedIndex]);
  
    return (
      <div className="search-container">
        <input
          type="text"
          value={clickedResult ? `${clickedResult.name}, ${clickedResult.address}` : searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search Users by Id, Address, Name, Pincode"
          className="search-input"
        />
          <button className="clear-btn" onClick={()=> {
            setClickedResult("")
            setSearchTerm("");
            setSearchResults([])
          }}>
            X
          </button>
        {searchTerm ?
        searchResults.length > 0 ? (
          <ul className="search-results-dropdown" ref={resultsListRef}>
            {searchResults.map((result, index) => (
              <li
                key={result.id}
                onClick={() => {
                    setClickedResult(result); // Set the clicked result
                    setSelectedIndex(index); // Reset selected index
                  }}
                onMouseOver={() => {
                        setSelectedIndex(index); // Highlight the item on mouseover
                }}
                onMouseLeave={() => {
                        setSelectedIndex(-1); 
                }}
              >
                <ListItem
                  data={result}
                  className={`${selectedIndex !== -1 ? index === selectedIndex ? "selected" : "" : index === 0 ? "default" : ""}`}
                  searchedField={searchTerm}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="search-results-dropdown">
            <li>No Results Found</li>
          </ul>
        ) : []}
      </div>
    );
};

export default App;

