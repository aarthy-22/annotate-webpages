// TODO - additional controls and ability to write notes
window.isScriptLoaded = true;
let selectedColor = "#000";
let selectedLineWidth = "3";
const pageHeight = Math.max(
  document.body.scrollHeight,
  document.documentElement.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.offsetHeight,
  document.body.clientHeight,
  document.documentElement.clientHeight
);
ctx = addCanvasToPage();
addControlsToPage();

chrome.storage.local.get(["canvasImageData"]).then((serializedImageData) => {
  if (serializedImageData.canvasImageData) {
      const dataArray = JSON.parse(serializedImageData.canvasImageData);
      const uint8Array = new Uint8ClampedArray(dataArray);
      const newImageData = new ImageData(uint8Array, ctx.canvas.width, ctx.canvas.height);
      ctx.putImageData(newImageData, 0, 0);
  }
});

var pos = { x: 0, y: 0 };

function addCanvasToPage() {
  const canvas = document.createElement("canvas");
  canvas.id = "draw";
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = pageHeight;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "9999"; 
  return canvas.getContext("2d");
}

function addControlsToPage() {
  const colorInput = document.getElementById("color");
  colorInput.addEventListener("input", function (event) {
    selectedColor = event.target.value;
  });

  const clearInput = document.getElementById("clear");
  clearInput.addEventListener("click", function (event) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  });


  const closeButton = document.getElementById("close");
  closeButton.addEventListener("click", function () {
    var elements = document.querySelectorAll('.control-elements');
    elements.forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('open').style.display = 'block';
    document.getElementById('draw').style.display = 'none';
  });

  const openButton = document.getElementById("open")
  openButton.addEventListener("click", function () {
    var elements = document.querySelectorAll('.control-elements');
    elements.forEach(function(element) {
        element.style.display = 'block';
    });
    document.getElementById('open').style.display = 'none';
    document.getElementById('draw').style.display = 'block';
  })

  const saveButton = document.getElementById("save");
  saveButton.addEventListener("click", function () {
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const serializedImageData = JSON.stringify(Array.from(imageData.data));
      chrome.storage.local.set({ canvasImageData: serializedImageData });
  });

}

// resize canvas when window is resized
function resize() {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  ctx.putImageData(imageData, 0, 0);
}

// new position from mouse events
function setPosition(e) {
  const scrollX = window.scrollX || window.pageXOffset; // Horizontal scroll position
  const scrollY = window.scrollY || window.pageYOffset; // Vertical scroll position
  pos.x = e.clientX + scrollX;
  pos.y = e.clientY + scrollY;

}

function draw(e) {
  if (e.buttons !== 1) return; 
  ctx.beginPath();
  ctx.lineWidth = selectedLineWidth; 
  ctx.lineCap = "round"; 
  ctx.strokeStyle = selectedColor;
  ctx.moveTo(pos.x, pos.y); 
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); 
  ctx.stroke(); 
}

window.addEventListener("resize", resize);
document.addEventListener("mousemove", draw);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);
