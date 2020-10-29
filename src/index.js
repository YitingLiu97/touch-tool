// import "./styles.css";
import {
    distance,
    scale,
    add,
    sub,
    angle,
    magnitude,
    pointsAlongLine,
} from "./vector.js";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let pixelRatio = 1.5;
canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
let x2 = 0;
let y2 = 0;
let p1 = {
    x: 100,
    y: 100
};
let p2 = {
    x: 200,
    y: 200
};


canvas.addEventListener("mousemove", function (e) {
    p1 = {
        x: e.clientX * pixelRatio,
        y: e.clientY * pixelRatio
    };
    render();
    paintMove(p1.x, p1.y,p2.x,p2.y)
});

canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    let touches = Array.from(e.touches);

    let touch = touches[0];
    p1 = {
        x: touch.clientX * pixelRatio,
        y: touch.clientY * pixelRatio
    };

    touch = touches[1];

    if (touch) {
        p2 = {
            x: touch.clientX * pixelRatio,
            y: touch.clientY * pixelRatio
        };
    }

    // render();

    // let x = touch.clientX * pixelRatio;
    // let y = touch.clientY * pixelRatio;
    drawLine();
    paintMove(p1.x, p1.y,p2.x,p2.y)
    middleCircle();


});

function render() {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


render();

function norm_random(size) {
    return (Math.random() - 0.5) * size;
}

// draw a line between  two touch points 
function drawLine() {

    ctx.beginPath();
    ctx.fillStyle = `hsl(240,90%,60%)`;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

}

function paintMove(x, y,x2, y2) {
    let rate = 20;
    let changingCol = `rgba(${x%255},${y%255},${(x2+y2)%255},0.2)`;

    let interpolatedPoints = pointsAlongLine(x, y, x2, y2, rate);
    // interpolatedPoints.forEach(function (p) {
        ctx.beginPath();
        ctx.fillStyle = changingCol;
        ctx.arc(x2+ norm_random(20), y2 + norm_random(20), Math.abs(norm_random(100)), 0, Math.PI * 2);
        ctx.arc(x+ norm_random(20), y + norm_random(20), Math.abs(norm_random(100)), 0, Math.PI * 2);
        ctx.fill();
    // });
    // x2 = x;
    // y2 = y;
}

//middle circle depends on the distance between two touch points 
function middleCircle(){
  
    let length = distance(p1, p2);
    let pDifference = sub(p1, p2);
    
    pDifference = scale(pDifference, 0.5);
    let p3 = add(p1, pDifference);
    let changingCol = `rgba(${p3.x%255},${p3.y%255},${(p3.x+p3.y)%255},0.2)`;
    // ctx.globalAlpha=0.2;
      ctx.fillStyle = changingCol;
      ctx.beginPath();
      ctx.arc(p3.x, p3.y, length / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
    //   ctx.arc(p3.x, p3.y, 15, 0, Math.PI * 2);
      ctx.font = "20px monospace";
      ctx.fillText(length.toFixed(1) + "px", p3.x + 20, p3.y);

}