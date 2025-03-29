let pokeApi = "https://pokeapi.co/api/v2/pokemon/";
let img;
let imgCartaVolteada;
let indicePokemon;
let cartas = []; 
let posiciones = [];
let primeraCartaIndex = null;
let segundaCartaIndex = null;
let bloqueo = false;
let ganaste = false;

function preload() {
  imgCartaVolteada = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Spanishdeckback.JPG/150px-Spanishdeckback.JPG");
}

function setup() {
  llenarCartas();
  createCanvas(800, 800);
}

function draw() {
  let index = 0;
  background("black");
  if(cartas.length === 10 && posiciones.length === 20){
    for (let y = 0; y < 800; y+=200) {
      for (let x = 0; x < 800; x+=160) {
        if(posiciones[index].volteada){
          img = posiciones[index].imagen
        }else{
          img = posiciones[index].cartaVolteada;
        }
      posiciones[index].x = x;
      posiciones[index].y = y;
      if(img) {
        image(img, x, y, 160, 160);
        index++;
      } 
      }  
    }    
    if (posiciones.every(carta => carta.volteada)) {
      ganaste = true;
    }
    
    if(ganaste){
      textSize(50);
      fill(random(255), random(255), random(255));
      textAlign(CENTER, CENTER);
      text("¡Ganaste!", width / 2, height / 2);
    }
  }
}

function llenarCartas(){
  for (let x = 0; x < 10; x++) { 
    indicePokemon = floor(random(0, 1000))
    getData(indicePokemon);
  }
}

async function getData(indicePokemon) {
  const response = await fetch(pokeApi + indicePokemon);
  const data = await response.json();
  loadImage(data.sprites.front_default, (img) => {
    cartas.push(img);
    if(cartas.length === 10) {
      llenarPosiciones();
    }
  });
} 

function llenarPosiciones(){
  let indiceCarta = 0;
  let contadorIndice = 0;
  for (let x = 0; x < 20; x++) { 
    let carta = {
      id: indiceCarta,
      imagen: cartas[indiceCarta],
      cartaVolteada: imgCartaVolteada,
      volteada: false,
      x: null,
      y: null
    }
    posiciones.push(carta);
    contadorIndice++;
    
    if(contadorIndice === 2){
      indiceCarta++;
      contadorIndice = 0;
    }
  }
  
  if(posiciones.length === 20){
   shuffle(posiciones, true);
  }
}

function mousePressed() {
  if (bloqueo) return;
  for (let i = 0; i < posiciones.length; i++) {
    let carta = posiciones[i];

    if(mouseX > carta.x && mouseX < carta.x + 160 &&
        mouseY > carta.y && mouseY < carta.y + 160) {

      if(i === primeraCartaIndex || i === segundaCartaIndex || carta.volteada) {
        return;
      }
      
      carta.volteada = true;
      if(primeraCartaIndex === null) {
        primeraCartaIndex = i;
      } else if(segundaCartaIndex === null) {
        segundaCartaIndex = i;
        bloqueo = true;
        setTimeout(() => {
          compararCartas();
        }, 1000);
      }
      break;
    }
  }
}

function compararCartas(){
  let carta1 = posiciones[primeraCartaIndex];
  let carta2 = posiciones[segundaCartaIndex];

  if (carta1.id !== carta2.id) {
    setTimeout(() => {
      carta1.volteada = false;
      carta2.volteada = false;
    }, 1000);
  }
  
  primeraCartaIndex = null;
  segundaCartaIndex = null;
  bloqueo = false;
}
