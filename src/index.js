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

import {
    saveAs
} from './fileSaver.js';


let intro = document.getElementById("intro");
intro.addEventListener("click",function(){
    disappear();
})

window.setTimeout(disappear,2000);

function disappear(){

    if(intro.style.display=="none"){
        intro.style.display="block";
    }else{
        intro.style.display="none";
    
}
}



let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let pixelRatio = 1.5;
canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
let p1 = {
    x: canvas.width / 2.5,
    y: canvas.height / 2.5
};
let p2 = {
    x: canvas.width / 4,
    y: canvas.height / 4
};

let penDown = false;
let last_x = 0;
let last_y = 0;
let clear = document.getElementById("clear");
let click = "left";

canvas.addEventListener("mousemove", function (e) {

    if (click == "left") {
        p1 = {
            x: e.clientX * pixelRatio,
            y: e.clientY * pixelRatio
        };
    }


    render();
    drawLine();
    middleCircle();

    if (click == "right") {
        p2 = {
            x: e.clientX * pixelRatio,
            y: e.clientY * pixelRatio
        };
    }

    paintMove(p1.x, p1.y, p2.x, p2.y)


});

//how to end when right click is clicked - paint end

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

    render();

    drawLine();
    paintMove(p1.x, p1.y, p2.x, p2.y)
    middleCircle();


});

function render() {

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`;
    ctx.globalAlpha = 0.5; //could be performance piece 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.fillStyle="black";
    // ctx.fillRect(20, 20, 150, 100);
}

clear.addEventListener("click", function () {

    // clear variables 
    render();
    ctx.clearRect(0, 0, canvas.width, canvas.height);


})

render();

function norm_random(size) {
    return (Math.random() - 0.5) * size;
}

// draw a line between  two touch points 
// angle determines thickness
function drawLine() {

    let thick = (angle(p1) + angle(p2)) / 2;
    ctx.lineWidth = 5 * thick;
    ctx.beginPath();
    ctx.fillStyle = `hsl(240,90%,60%)`;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

}

function paintStart(x, y) {
    penDown = true;
    last_x = x;
    last_y = y;

    // console.log("paintstart")
}
let effects = ["soft-light", "difference", "exclusion", "luminosity", "color-burn"];
let index = 0;
let effectsBtn = document.getElementById("effects");
ctx.globalCompositeOperation = effects[0];

effectsBtn.addEventListener("click", function () {
    ctx.globalCompositeOperation = effects[index % effects.length];
    index++;
    effectsBtn.innerHTML = effects[index % effects.length];
})

function paintMove(x, y, x2, y2) {


    penDown = true;
    let rate = 20;
    let changingCol = `rgba(${x%255},${y%255},${(x2+y2)%255},0.2)`;

    let interpolatedPoints = pointsAlongLine(x, y, x2, y2, rate);
    ctx.beginPath();
    ctx.fillStyle = changingCol;
    ctx.arc(x2 + norm_random(20), y2 + norm_random(20), Math.abs(norm_random(100)), 0, Math.PI * 2);
    ctx.arc(x + norm_random(20), y + norm_random(20), Math.abs(norm_random(100)), 0, Math.PI * 2);
    ctx.fill();
    // x = last_x;
    // y = last_y;
}

function paintEnd(x, y) {
    pushState();
    console.log("push state: paint end")
    // x = last_x;
    // y = last_y;
}


//middle circle depends on the distance between two touch points 
function middleCircle() {

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
    // ctx.font = "20px monospace";
    // ctx.fillText(length.toFixed(1) + "px", p3.x + 20, p3.y);

}



// undo and clear
let restore = document.getElementById("undo");

let undoStack = [];
pushState();

restore.addEventListener("click", undo);

function undo() {
    console.log("undo clicked")
    if (undoStack.length > 1) {
        undoStack.pop();
    }
    let lastElemeent = undoStack[undoStack.length - 1];
    ctx.putImageData(lastElemeent, 0, 0);
}

function pushState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (undoStack.length > 50) {
        undoStack.shift();
    }
}


canvas.addEventListener("mouseout", function (evt) {
    penDown = false;
});
canvas.addEventListener("mouseup", function (evt) {
    penDown = false;
    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintEnd(x, y);
});


canvas.addEventListener("touchend", function (evt) {
    penDown = false;
    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintEnd(x, y);
});

//disable right click context menu 
canvas.oncontextmenu = function (e) {
    e.preventDefault();
    e.stopPropagation();
}

canvas.addEventListener("mousedown", function (e) {
    paintStart(e.clientX, e.clientY);

    if (e.button == 2) {
        click = "right";
        console.log("right click")
    } else {
        click = "left";
        console.log("left click")

    }

});

let save = document.getElementById("save");

save.addEventListener("click", function () {
    console.log("save!");
    //draw everything onto the bg image and save it 
    canvas.toBlob(function (blob) {
        saveAs(blob, "drawing.png");
    });
})



//tone js creating sounds 
