// DE mj-una
// PA LAS TUTORIAS DE p5
//
// Descripcion:
// el circulo se mueve de forma aleatoria y cambia de color segun
// su posicion. ademas disminuye de tamaño segun pasa el tiempo.
// Ojo, se puede "empujar" al circulo presionando las teclas
// [w] [a] [s] [d] (arriba, izq, abajo, der respectivamente)
//
// Objetivo:
// generar imagenes bonitas
//
// Instrucciones:
// presiona play para arrancar (recomendado activar autorefresh).
// ir probando distintos ajustes hasta encontar uno que te guste.
// para interactuar con las teclas es necesario antes haber
// clickeado al menos una vez sobre la imagen
//
// presiona [w, a, s, d] para forzar al movimiento en algun sentido
// presiona [p] para guardar la imagen actual
// presiona [g] para guardar la imagen final
// presiona [espacio] para reiniciar
//
// al dominio publico. cc0. no es necesario citar autoria


/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
/**/ 
/**/ // AJUSTES // PARA // JUGAR // dale sol, inventaaaa
/**/ // cambia los numeros entre el rango maximo y minimo
/**/ 
/**/ let resolu = 1400; // resolucion interna => ENTRE 50 Y 2000 (aprox)
/**/
/**/ let tamIni = 1.5; // circulo inicial => ENTRE 0 Y 1 (o poco mas)
/**/ let tamFin = 0.1; // circulo final => ENTRE 0 Y 1 (o poco mas)
/**/ let tamBor = 0.3; // grosor bordes => ENTRE 0 Y 1 (o poco mas)
/**/
/**/ let transp = 0.7; // transparencia (bruma fondo) => ENTRE 0 Y 1
/**/
/**/ let velRdx = 0.6; // velocidad achica circulo => ENTRE 0 Y 1 (exp!)
/**/ let velMov = 0.2; // velocidad movimiento aleatorio => ENTRE 0 Y 1
/**/
/**/ let sensib = 0.8; // sensibilidad movimiento teclas => ENTRE 0 Y 10
/**/
/**/ // tambien se pueden cambiar el color del fondo y del circulo
/**/ // buscar los comentarios "AJUSTE" en el codigo (con ctrl+f)
/**/
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/


// variables de estado (no tocar)
let guardarFinal; // flag
let nombreArchivo = `r${resolu}_ti${tamIni}_tf${tamFin}_tb${tamBor}_t${transp}_s${sensib}_vr${velRdx}_vm${velMov}.png`; // template string
let diam, dmMin, dmRdx; // diametro circulo
let empMax, empMin, empX, empY; // empuje


/////////////////////////////

function setup() {
  
  // no tocar estas lineas
  createCanvas(resolu, resolu); // resolucion interna. no tamaño visual
  windowResized(); // visualizacion. ver funcion para hacer responsive
  strokeWeight(tamBor * resolu * 0.006); // grosor de los bordes
  frameRate(30); // en algunos navegadores anda muy rapido
  frameCount = 0; // reiniciar con la misma semilla para noise()
  guardarFinal = false; // flag de guardar al terminar draw
  diam = resolu * tamIni; // diametro circulo inicial
  dmMin = resolu * tamIni * 0.1 * tamFin; // diametro minimo
  dmRdx = resolu * 0.005 * Math.pow(velRdx, 2); // reduccion diametro
  // Ojo a la velocidad de reduccion, es exponencial!! puede romper todo
  empMax = resolu * sensib * 0.8; // empuje maximo
  empMin = sensib * 5; // empuje minimo
  empX = 0; // empuje inicial en x
  empY = 0; // empuje inicial en y

  // AJUSTE: cambiar el color de fondo
  background(230 * transp, 180 * transp, 160 * transp);
  
  // test
  // console.log("diametro inicio: " + diam);
}


/////////////////////////////

function draw() {
  
  // transparencia
  push();
  noStroke();
  fill(230 * transp, 180 * transp, 160 * transp, 1);
  rect(0, 0, resolu, resolu); // cubre todo el canvas
  pop();
  // en realidad la opacidad es constante ("1") y lo que cambia
  // es la intensidad del color solido. hacerlo asi permite que
  // exista un mayor espectro de transparencias, pq la opacidad
  // tiene pocos decimales (ej: aproxima 0.4 a 0)
  
  // posicion aleatoria
  let x = noise(frameCount * 0.05 * velMov) * resolu;
  let y = noise(frameCount * 0.05 * velMov + 1) * resolu;
  // noise es medio magico. recibe un valor que cambia gradualmente
  // y devuelve un decimal entre 0 y 1 que es aleatorio pero "coherente"
  // con el ultimo numero que devolvió. el resultado se multimplica por
  // la medida del canvas, como si fuera un porcentaje de la posicion.
  // el segundo noise tiene un +1 en su interior para que funcione
  // independiente al primero. chat gpt lo explica mejor
  
  // empujar horizontal
  x += empX;
  if (keyIsDown(65)) { // si tecla izquierda ("a" = 65)
    if (empX > empMax * -1) empX -= 10 * sensib; // si no excede max neg
  }
  else if (keyIsDown(68)) { // si tecla derecha ("d" = 68)
    if (empX < empMax) empX += 10 * sensib; // si no excede max positivo
  }
  else { // si ni izq ni der, entonces normalizar
    if (Math.abs(empX) < empMin) empX = 0; // si es cercano a 0
    else if (empX < 0) empX += 8 * sensib; // si es negativo
    else if (empX > 0) empX -= 8 * sensib; // si es positivo
  }
  // el control con las teclas podria haber sido mucho mas simple
  // pero esta pensado para que el movimiento sea intuitivo y suave.
  // hay un valor "emp" que incrementa al mantenerse presionado.
  // hay un limite maximo "empMax" y otro minimo "empMin".
  // al soltarse las teclas (caso "else") se decrementa suavemente
  // el valor del empuje hasta que sea casi 0. se usa valor absoluto
  // para detectar la cercania tanto en positivos como negativos. 
  // todas las variables son dependiendtes de la resolucion
  // y de la sensibilidad (ver setup)
  
  // empujar vertical
  y += empY;
  if (keyIsDown(87)) { // si arriba ("w" = 87)
    if (empY > empMax * -1) empY -= 10 * sensib; 
  }
  else if (keyIsDown(83)) { // si abajo ("s" = 83)
    if (empY < empMax) empY += 10 * sensib; 
  }
  else { // si ni arriba ni abajo
    if (Math.abs(empY) < empMin) empY = 0;
    else if (empY < 0) empY += 8 * sensib;
    else if (empY > 0) empY -= 8 * sensib;
  }
  
  // color circulo
  let r = 255;
  let g = map(x, 0, resolu, 0, 255);
  let b = map(y, 0, resolu, 0, 255);
  // AJUSTE: se pueden cambiar los ultimos dos numeros del map (0, 255)
  // para limite inferior y superior de la saturacion de ese color.
  // Ojo, cada map recibe una "x" o "y" para ver de qué eje depende.
  // y se puede cambiar la variable que recibe al map o a la constante
  // asi por ejemplo se podria hacer que verde y azul sean fijos y
  // el valor de rojo cambie segun la posicion en algun eje
  
  // dibujo circulo
  fill(r, g, b);
  circle(x, y, diam);
  
  // diametro circulo
  diam -= dmRdx;
  // if (frameCount % 60 == 0) console.log("diametro: " + diam);
  
  // final
  if (diam <= dmMin) { // si el circulo es muy chico
    noLoop(); // pausar hasta que se reinicie
    if (guardarFinal) save(nombreArchivo); // guardarFinal es una flag
    // sirve para recordar si se presionó "g" durante la ejecucion
  } 
}


/////////////////////////////

function keyPressed() {
  if (key == "p" || key == "P") { // imagen actual
    save(nombreArchivo); // la guarda ahora mismo
  }
  if (key == "g" || key == "G") { // imagen final
    if (isLooping()) guardarFinal = true; // para cuando termine
    else save(nombreArchivo); // si ya termino (equivalente a "p")
  }
  if (keyCode == 32) { // [espacio] para reiniciar
    setTimeout(() => loop(), 0); // asincronia, dificil de explicar
    setup(); // arrancar de nuevo el sketch. loop() se ejecutará
    // despues del setup y del primer draw (que esta pausado)
  }
}


/////////////////////////////

function windowResized() {
  
  // para hacer responsive, muy facil!!!
  // tengo un tutorial explicando esta funcion (ejmplo 1)
  // https://github.com/mj-una/tutorial-p5-responsive

  let pag = document.getElementsByTagName("body")[0];
  let cnv = document.getElementById("defaultCanvas0");

  // el margen depende (artificialmente) de la resolcion
  let mrg = map(resolu, 50, 2000, 20, 0.01); 

  // AJUSTE: el color del body es parecido al del fondo del canvas
  pag.style.backgroundColor = `rgb(${180 * transp}, ${130 * transp}, ${110 * transp})`;
  
  pag.style.overflow = "hidden";
  pag.style.display = "flex";
  pag.style.justifyContent = "center";
  pag.style.alignItems = "center";
  pag.style.height = "100svh";
 
  if (windowWidth * height > windowHeight * width) {
    cnv.style.height = (100 - mrg * 2) + "svh";
    cnv.style.width = ((100 - mrg * 2) / height) * width + "svh";
  }
  else {
    cnv.style.width = (100 - mrg * 2) + "vw";
    cnv.style.height = ((100 - mrg * 2) / width) * height + "vw";
  }
}
