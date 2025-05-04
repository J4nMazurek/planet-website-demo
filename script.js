let sun;
let planets = [];
let G = 10;


function setup() {
    
  createCanvas(windowWidth, windowHeight);
  frameRate(144);
  canvas.setAttribute('style', 'image-rendering: pixelated;');


  sun = new Body(100, createVector(0,0), createVector(0, 0));




  for (let i = 0; i < 100; i++){
    let r = random(sun.r, min(windowWidth/2, windowHeight/2));
    let theta = random(TWO_PI);
    let planetPos = createVector(r * cos(theta), r * sin(theta));
    let planetVel = createVector(random(-5, 5), random(-5, 5));
    planets.push(new Body(random(1,25), planetPos, planetVel, color(random(100,255))));
  }
}

function draw() {
    translate(width/2, height/2);
    let bodyBgColor = getComputedStyle(document.body).backgroundColor || 'red';
    background(bodyBgColor);


    /*let fps = frameRate();
    fill(255);
    noStroke();
    text('FPS: ' + fps.toFixed(2), -width/2 + 10, -height/2 + 20);*/




    sun.show();
    for (let i = 0; i < planets.length; i++){
        let planet = planets[i];
        if(planet.pos.x > width/2 || planet.pos.x < -width/2 || planet.pos.y > height/2 || planet.pos.y < -height/2){
            planet.pos.x = random(-width/2, width/2);
            planet.pos.y = random(-height/2, height/2);
            planet.vel.x = random(-1, 1);
            planet.vel.y = random(-1, 1);
        }
        if (planet.pos.dist(sun.pos) < (sun.r/2 + planet.r/2)) {
            planets.splice(i, 1); // remove the planet from the array
            sun.mass += planet.mass / 10;
            sun.r = sun.mass / 2;
        }
        sun.attract(planet);
        planet.update();
        planet.show();
    }


}


function Body(_mass, _pos, _vel, _color){
    this.mass = _mass;
    this.pos = _pos;
    this.vel = _vel;
    this.color = _color || color(255, 255, 255); // default color is white
    this.r = Math.pow((3 * this.mass) / (4 * PI), 1/3) * 10;// radius of the body

    this.show = function(){
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    this.applyForce = function(f){

        this.vel.x += f.x / this.mass;
        this.vel.y += f.y / this.mass;

    }
    this.attract = function(other) {
        let r = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        let f = this.pos.copy().sub(other.pos);
        f.setMag( (G * this.mass * other.mass) / (r * r));
        other.applyForce(f);
    }
    this.update = function() {
        // Update position based on velocity
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
}