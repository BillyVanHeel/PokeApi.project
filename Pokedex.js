const pokeList = document.createElement("ol");
pokeList.className = "poke-list";
document.body.appendChild(pokeList);
const pokeSearchBar = document.querySelector(".search-bar-bar");
const pokeSearchButton = document.querySelector(".poke-button");
POKEDEX_ARRAY = [];
TYPE_ARRAY = [
"fire",
"water",
"grass",
"bug",
"electric",
"flying",
"fighting",
"ground",
"normal",
"poison",
"psychic",
"ghost",
"dark",
"rock",
"ice",
"dragon",
"steel",
"fairy",
];

//A continuación, solicitamos los datos de la API, y los traemos en un objeto JSON
function pokePetition() {
  return fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((pokeResult) => pokeResult.json())
    .then((pokeResult) => {
      return pokeResult.results;
    })

    .catch((error) => ("Error accediendo a la Pokédex", error));
}
//Seguidamente sacamos cada uno de los pokemon. Para ello creamos una función que tome una url como parámetro,
//le haga fetch y nos devuelva, en un json llamado "pokemon", los datos específicos que le pidamos
const getOnePokemon = async (url) => {
  try {
    const pokeResponse = await fetch(url);
    const result = await pokeResponse.json();

    const pokemon = {
      name: result.name,
      id: result.id,
      type: result.types.map((element) => element.type.name),
      image: result.sprites.front_default,
      image_shiny: result.sprites.front_shiny,
    };
    return pokemon;
  } catch (error) {
    console.log("No se puede acceder a la entrada de este pokémon", url, error);
  }
};
//Estos objetos "pokemon" queremos convertirlos en tarjetas que se muestren en la página. Vamos paso por paso

//Primero: los poke-tipos:

//Dado que algunos pokemon tienen doble tipo, no mostraremos el tipo directamente, sino un div(pokeTypeBox) que
//contenga los tipos de cada pokemon
const displayTypes = (types, container) => {
  const pokeTypeBox = document.createElement("div");
  pokeTypeBox.className = "type-box";

  //creamos a continuación un div para cada tipo
  for (const type of types) {
    const pokeDiv = document.createElement("div");
    pokeDiv.setAttribute("Pokemon-type", type);
    pokeDiv.classList.add("type");
    pokeDiv.textContent = type;

    //Y hacemos que, al clicar en cada uno de estos divs, nos busque a todos los de ese tipo
    function filterType(){
      pokeSearchBar.value = type;
      pokeSearch(type);
    }
    pokeDiv.addEventListener("click", filterType);
    pokeTypeBox.appendChild(pokeDiv);
  }
  container.appendChild(pokeTypeBox);
};

//Bajo el input, haremos un div con botones que filtren los pokemon por tipos, empleando el array de tipos de las primeras
const typeButtonUl = document.querySelector(".typebuttons");
TYPE_ARRAY.forEach(type => {
  const typeLi = document.createElement("li");
  typeLi.setAttribute("Pokemon-type", type);
  typeLi.classList.add("type");
  typeLi.textContent = type;

  typeButtonUl.appendChild(typeLi);

  function filterType(){
    if(pokeSearchBar.value == type){
      pokeSearchBar.value = "";
      pokeSearch("");
    }else{
    pokeSearchBar.value = type;
    pokeSearch(type);
    }
    
  }
  

  typeLi.addEventListener("click", filterType);



});
//Función para dejar vacía la pokedex. Esto nos hará falta luego
const clearPokedex = () => (pokeList.textContent = "");

//Esto será lo que veremos cuando la pokedex esté vacía
const displayZeroPokemon = () => {
  const zeroLi = document.createElement("li");

  zeroP.classList.add("noPokemonFound");
  zeroP.textContent =
    "Oops! you must have used a repel, cause there are no pokemon here...";

  zeroLi.appendChild(zeroP);
  pokeList.appendChild(zeroLi);
};
const zeroP = document.createElement("p");

//Creamos las tarjetas a partir de estos objetos pokemon. Estas tarjetas serán elementos "li" subordinados a la "ol" pokelist
function displayPokemonCards(pokeCard) {
  const pokeLi = document.createElement("li");
  pokeLi.className = "poke-li";

  //nombre del pokemon
  const pokeP = document.createElement("p");
  pokeP.textContent = pokeCard.name;

  //imagen del pokemon:
  const pokePic = document.createElement("img");
  //con esta función, haremos que la source del elemento img tenga una posibilidad de ser la imagen shiny:
  function randomShiny(img) {
    let shiny = Math.floor(Math.random() * 100);
    if (shiny <= 0.5) {
      img.src = pokeCard.image_shiny;
      img.className = "shiny";
      if (pokeLi.classList.contains("mew")) {
        img.setAttribute(
          "title",
          "A shiny mew under the truck. WHAT ARE THE ODDS???"
        );
      } else {
        img.setAttribute("title", "Wow! It's a shiny");
      }
      img.alt = pokeCard.name + " shiny";
    } else {
      img.src = pokeCard.image;
      img.alt = pokeCard.name;
    }
    return shiny;
  }

  //Queremos hacer especial a nuestro escurridizo Mew, así que vamos a darle propiedades particulares
  if (pokeCard.name === "mew") {
    pokeLi.classList.add("mew");
    //creamos una tarjeta especial con la foto de un camión:
    const truck = document.createElement("div");
    let truckPic = document.createElement("img");
    truckPic.src = "./assets/Mew-Truck.png";
    const truckP = document.createElement("p");
    truckP.textContent = "Just a normal truck, right?";
    truckP.classList.add("truck-P");
    truckPic.classList.add("truck-pic");

    truck.appendChild(truckPic);
    truck.appendChild(truckP);
    truck.classList.add("truck");
    //Y lo subordinamos a la tarjeta de Mew, quedando por encima de esta:
    pokeLi.appendChild(truck);

    //Y con este escuchador, al hacer click, haremos el camión invisible, revelando a Mew
    truck.addEventListener("click", () => {
      truck.style = "visibility:hidden";
    });

    pokePic.setAttribute("title", "Mew was under the truck");
  }

  //ejecutamos aquí la función randomShiny, declarada arriba
  randomShiny(pokePic);
  pokeLi.appendChild(pokePic);
  pokeLi.appendChild(pokeP);
  displayTypes(pokeCard.type, pokeLi);

  pokeList.appendChild(pokeLi);
}

//Mostramos cada una de las tarjetas:
const displayPokemon = (Kanto) => {
  clearPokedex();
  if (!Kanto.length) displayZeroPokemon();
  for (const pokemon of Kanto) {
    displayPokemonCards(pokemon);
  }
};



//Easter-egg de pokemon: Missigno
//Creamos una tarjeta especial para Missingno, con su imagen(local) y su nombre
const missingno = () => {
  const missingnoDiv = document.createElement("div");
  missingnoDiv.classList.add("missingno");

  let missingnoPic = document.createElement("img");
  missingnoPic.src = "./assets/MissingNo.png";
  missingnoPic.classList.add("missingno-pic");

  const missingnoP = document.createElement("p");
  missingnoP.textContent = "#/Missingno..:.!";
  missingnoP.classList.add("missingno-p");

  missingnoDiv.appendChild(missingnoPic);
  missingnoDiv.appendChild(missingnoP);
  pokeList.appendChild(missingnoDiv);
};

//Función del buscador, que mostrará en la pokedex (previamente vaciada) solo los resultados que le pidamos
const pokeSearch = () => {
  let value = pokeSearchBar.value.toLowerCase();
  const searchResult = POKEDEX_ARRAY.filter((pokemon) => {
    const matchName = pokemon.name.includes(value);
    const matchType = pokemon.type[0].includes(value);
    let matchSecondType = "";
    if (pokemon.type[1]) {
      matchSecondType = pokemon.type[1].includes(value);
    }
    return matchName || matchType || matchSecondType;
  });
  if (value.includes("???")) {
    pokeList.textContent = "";
    missingno();
    zeroP.textContent = "";
  } else {
    displayPokemon(searchResult);
  }
};

//Función para AUTOCOMPLETAR
pokeSearchBar.addEventListener("keyup", (e) =>{
  clearInput()
  for(let name of arrayNames){
    if(name.startsWith(pokeSearchBar.value)&& pokeSearchBar.value != ""){
      let pokeAutoLi = document.createElement("li");
      pokeAutoLi.classList.add("pokeAutoLi");
      pokeAutoLi.setAttribute("onclick", "showPokeResults('" + name +"')");
      let pokeBold = "<b>" + name.substr(0,pokeSearchBar.value.length) + "</b>";
      pokeBold += name.substr(pokeSearchBar.value.length);
      pokeAutoLi.innerHTML = pokeBold;
      document.querySelector(".pokeAutoList").appendChild(pokeAutoLi);
    }
  }
});

function showPokeResults(value){
  pokeSearchBar.value = value;
  pokeSearch(value);
  clearInput();
}

function clearInput(){
  let pokeItems = document.querySelectorAll(".pokeAutoLi");
  pokeItems.forEach((pokeItem) => {
    pokeItem.remove();
  });
}


let arrayNames = [];

const addEventsListeners = () => {
  pokeSearchButton.addEventListener("click", () => {
    pokeSearch();
  });
  pokeSearchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pokeSearch();
    }
  });
};

//Finalmente, aquí invocamos todo lo anterior
async function newGame() {
  console.log(
    "Bienvenido al mundo Pokemon. Soy el profesor Oak, y estos son los pokemon de la región de Kanto:"
  );

  addEventsListeners();
  const Kanto = await pokePetition();
  for (const pokemon of Kanto) {
    const pokeinfo = await getOnePokemon(pokemon.url);
    POKEDEX_ARRAY.push(pokeinfo);
  }
  console.log(POKEDEX_ARRAY);
  displayPokemon(POKEDEX_ARRAY);

  arrayNames = POKEDEX_ARRAY.map((item) => {
    return item.name;
  });
}
//Y lo ejecutamos
newGame();
