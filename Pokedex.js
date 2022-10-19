const pokeList = document.createElement("ol");
pokeList.className = "poke-list";
document.body.appendChild(pokeList);
const pokeSearchBar = document.querySelector(".search-bar-bar");
POKEDEX_ARRAY = [];

//A continuación, solicitamos los datos de la API, todos ellos.
function pokePetition() {
  return fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((pokeResult) => pokeResult.json())
    .then((pokeResult) => {
      return pokeResult.results;
    })
    .catch((error) => ("Error accediendo a la Pokédex", error));
}

//Seguidamente sacamos cada uno de los pokemon
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
const displayTypes = (types, container) => {
  const pokeTypeBox = document.createElement("div");
  pokeTypeBox.className = "type-box";

  for (const type of types) {
    const pokeDiv = document.createElement("div");
    pokeDiv.setAttribute("Pokemon-type", type);
    pokeDiv.classList.add("type");
    pokeDiv.textContent = type;
    pokeDiv.addEventListener("click", () => {
      pokeSearchBar.value = type;
      pokeSearch(type);
    });
    pokeTypeBox.appendChild(pokeDiv);
  }
  container.appendChild(pokeTypeBox);
};

//Función para dejar vacía la pokedex. Esto nos hará falta luego
const clearPokedex = () => (pokeList.innerHTML = "");

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

//Creamos las tarjetas a partir de los objetos
function displayPokemonCards(pokeCard) {
  const pokeLi = document.createElement("li");
  pokeLi.className = "poke-li";

  const pokeP = document.createElement("p");
  pokeP.textContent = pokeCard.name;

  const pokePic = document.createElement("img");
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
    pokeLi.appendChild(truck);

    truck.addEventListener("click", () => {
      truck.style = "visibility:hidden";
    });

    pokePic.setAttribute("title", "Mew was under the truck");
  }

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
const missingno = () => {
  const missingnoDiv = document.createElement("div");
  missingnoDiv.classList.add("missingno");

  let missingnoPic = document.createElement("img");
  missingnoPic.src="./assets/MissingNo.png";
  missingnoPic.classList.add('missingno-pic');

  const missingnoP = document.createElement('p');
  missingnoP.textContent = '#/Missingno..:.!';
  missingnoP.classList.add('missingno-p');


  missingnoDiv.appendChild(missingnoPic);
  missingnoDiv.appendChild(missingnoP);
  pokeList.appendChild(missingnoDiv);
};

//Función del buscador, que mostrará en la pokedex (previamente vaciada) solo los resultados que le pidamos
const pokeSearch = (value) => {
   
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
        missingno();
        zeroP.textContent='';
      }
    else{
     displayPokemon(searchResult);    
    }
   
};
const addEventsListeners = () => {
  pokeSearchBar.addEventListener("input", (event) => {
    pokeSearch(event.target.value);
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
}

//Y lo ejecutamos
newGame();
