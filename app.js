const mapboxAPI = {
  url: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
  api: "pk.eyJ1Ijoic3RldmV3cmlnaHQ1NCIsImEiOiJja2Iya3NieWkwMDB3MnB0YnJxNHc0ZWFzIn0.lJp33AgjVmLqr-oea0X4jw",
};

const policeAPI = {
  url: "https://data.police.uk/api/stops-street?",
};

const search = document.querySelector("#search-form");
const output = document.querySelector("#app-output");
const placeOutput = document.querySelector(".place-output");
const searchInput = document.querySelector("#search");

search.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value.length > 0) {
    output.innerHTML = "";
    placeOutput.innerHTML = "";
    let str = e.target[0].value;
    str = str.replace(/\s+/g, "");
    coordinates(str);
    e.target[0].value = "";
  }
});

let coordinates = (i) => {
  fetch(`${mapboxAPI.url}${i}.json?access_token=${mapboxAPI.api}`)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      searchPolice(data);
    })
    .catch((data) => {
      divMessage("I can't seem to find that address. Please try another.");
      console.log(data);
    });
};

let searchPolice = (data) => {
  let address = data.features[0].place_name;
  divMessage(`<strong>Showing results for:</strong> ${address}`);
  let coords = data.features[0].center;
  fetch(`${policeAPI.url}lat=${coords[1]}&lng=${coords[0]}`)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if (data.length > 0) {
        showResults(data);
        divMessage(`Displaying <strong class="no-records">${data.length}</strong> records.`);
      } else {
        divMessage(`<strong class="no-records">There are no UK Stop & Search records for the address you searched.</strong>`);
      }
    });
};

let divMessage = (d) => {
  let div = document.createElement("div");
  div.innerHTML = d;
  placeOutput.style.display = "block";
  placeOutput.appendChild(div);
};

let showResults = (d) => {
  let div = document.createElement("div");
  div.classList.add("output-container");

  for (i = 0; i < d.length; i++) {
    let datetime = d[i].datetime;
    let day = datetime.slice(8, 10);
    let month = datetime.slice(5, 7);
    let year = datetime.slice(0, 4);
    let time = datetime.slice(11, 16);
    let resultsInfo = document.createElement("div");
    resultsInfo.classList.add("results-info");
    resultsInfo.innerHTML = `
    <h2>${i + 1}</h2>
    <h3><strong>Date:</strong> ${day}/${month}/${year}</h3>
    <h3><strong>Time:</strong> ${time}</h3>
    <h4>Object of Search:</h4><p>${d[i].object_of_search}</p>
    <h4>Legislation:</h4><p>${d[i].legislation}</p>
    <h4>Location:</h4><p>${d[i].location.street.name}</p>
    <h4>Outcome:</h4><p>${d[i].outcome}</p>
    <h4>Gender of subject:</h4><p>${d[i].gender}</p>
    <h4>Age of subject:</h4><p>${d[i].age_range}</p>
    <h4>Ethnicity of subject:</h4><p>${d[i].self_defined_ethnicity}</p>
    `;
    div.appendChild(resultsInfo);
  }
  let printDiv = document.createElement("div");
  printDiv.classList.add("print-div");
  printDiv.innerHTML = `
  <a href="javascript:window.print();">Print This Page</a>
  `;
  output.appendChild(printDiv);
  output.appendChild(div);
};
