function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandom(min, max){
  return Math.random() * (max - min) + min;
}

function floorHeightPosition(x, y){
  return Math.sin(x * 0.3) * Math.cos(y * 0.3);
}


export{getRandomInt, generateRandom, floorHeightPosition}