const quoteBtn = document.querySelector(".quote-btn");

quoteBtn.addEventListener("click", getQuoteFromAPI);

function getQuoteFromAPI() {
  fetch("https://dummy-apis.netlify.app/api/quote")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderQuote(data.quote, data.author);
    });
}

function renderQuote(quote, author) {
  const quoteArea = document.querySelector(".fetched-quote");
  quoteArea.innerHTML = "";
  const quoteElement = document.createElement("p");
  quoteElement.append(document.createTextNode(quote));
  const quotedAuthor = document.createElement("p");
  quotedAuthor.append(document.createTextNode("—" + author));
  quotedAuthor.classList.add("author");

  quoteArea.appendChild(quoteElement);
  quoteArea.appendChild(quotedAuthor);
}
