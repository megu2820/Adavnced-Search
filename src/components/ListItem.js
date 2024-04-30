import React from "react";
import "../App.css"

const  ListItem = ({ data, searchedField, className }) => {

  //Helper function render Searched keyword matches in blue
  const highlightSearchedKeyword = ( text, highlight ) => {
    const items = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {items.map((item, index) =>
          item.toLowerCase() === highlight.toLowerCase() ? (
            <b key={index} className="blue-text">
              {item}
            </b>
          ) : (
            <React.Fragment key={index}>{item}</React.Fragment>
          )
        )}
      </>
    );
  };

  const lowercaseArray = data.items.map((str) => str.toLowerCase()).join(" ");
  return (
    <div  className={`left-align ${className}`}>
      <b>{highlightSearchedKeyword(data.id, searchedField)}</b>
      <br/>
      <i>{highlightSearchedKeyword(data.name, searchedField)}</i>
      <br/>
        {lowercaseArray.includes(searchedField.toLowerCase()) && searchedField?.length > 0 && (
          <p className="matching-item">
          <b className="blue-text">{`"${searchedField}"`}</b>  found in Items
          <br/>
          </p>
        )}
      <span>
      {highlightSearchedKeyword(data.address, searchedField)}
      {highlightSearchedKeyword(data.pincode, searchedField)}
      </span>
    </div>
  );
}

export default ListItem;