console.log("app.js loaded");

// --- Canvas Handwriting Functions ---
const canvas = document.getElementById("handwriting-canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let lastX = 0;
let lastY = 0;
let penColor = "#000";
let penSize = 2;
let erasing = false;

// Get mouse/touch position relative to canvas
function getPos(e){
    const rect = canvas.getBoundingClientRect();
    if(e.touches){
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}

// Start drawing
function startDrawing(e){
    drawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
}

// Draw line
function draw(e){
    if(!drawing) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = erasing ? "#fff" : penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
}

// Stop drawing
function stopDrawing(){
    drawing = false;
    lastX = 0;
    lastY = 0;
}

// Canvas event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
canvas.addEventListener("touchend", (e) => e.preventDefault(), { passive: false });

// Resize canvas to match calendar wrapper
function resizeCanvas(){
    const wrapper = document.getElementById("calendar-wrapper");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = wrapper.offsetWidth * dpr;
    canvas.height = wrapper.offsetHeight * dpr;
    canvas.style.width = wrapper.offsetWidth + "px";
    canvas.style.height = wrapper.offsetHeight + "px";
    ctx.scale(dpr, dpr);
    loadCanvas();
}

// Toolbar controls
document.getElementById("pen-btn").addEventListener("click", ()=>{
    erasing = false;
});
document.getElementById("eraser-btn").addEventListener("click", ()=>{
    erasing = true;
});
document.getElementById("color-picker").addEventListener("change", (e)=>{
    penColor = e.target.value;
});
document.getElementById("size-picker").addEventListener("change", (e)=>{
    penSize = e.target.value;
});
document.getElementById("clear-btn").addEventListener("click", ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
});

// Save/Load
function saveCanvas(){
    localStorage.setItem(currentWeekKey(), canvas.toDataURL());
}
function loadCanvas(){
    const data = localStorage.getItem(currentWeekKey());
    if(data){
        const img = new Image();
        img.onload = ()=> ctx.drawImage(img,0,0,canvas.width/ (window.devicePixelRatio||1),canvas.height/ (window.devicePixelRatio||1));
        img.src = data;
    }
}

// --- Calendar Functions ---
let currentDate = new Date();

function getStartOfWeek(date){
    const day = date.getDay(); // Sunday = 0
    const diff = (day === 0 ? -6 : 1 - day); // Monday start
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0,0,0,0);
    return start;
}

function renderCalendar(date){
    const startOfWeek = getStartOfWeek(date);

    // Update current week text
    const weekStr = `${startOfWeek.toLocaleDateString()} - ${new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()+6).toLocaleDateString()}`;
    document.getElementById("current-week").textContent = weekStr;

    // Day headers
    const dayHeader = document.getElementById("day-header");
    dayHeader.innerHTML = "";
    for(let i=0;i<7;i++){
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const div = document.createElement("div");
        div.style.flex = "1";
        div.style.textAlign = "center";
        div.textContent = day.toLocaleDateString(undefined,{weekday:'short',month:'numeric',day:'numeric'});
        dayHeader.appendChild(div);
    }

    // Hour column
    const hourColumn = document.getElementById("hour-column");
    hourColumn.innerHTML = "";
    for(let h=6;h<=22;h++){
        const div = document.createElement("div");
        div.className = "hour-cell";
    if (h === 21 || h === 22) {
        div.textContent = "Hours";
    } else {
        div.textContent = h <= 12 ? h + (h === 12 ? 'pm' : 'am') : (h - 12) + 'pm';
    }
        div.style.height = "30px";
        div.style.lineHeight = "30px";
        div.style.textAlign = "center";
        hourColumn.appendChild(div);
    }

    // Calendar grid
    const calendarGrid = document.getElementById("calendar");
    calendarGrid.innerHTML = "";
    for(let h=6;h<=22;h++){
        for(let d=0;d<7;d++){
            const div = document.createElement("div");
            div.className = "day-column hour-cell";
            calendarGrid.appendChild(div);
        }
    }

    // Resize canvas AFTER calendar DOM built
    resizeCanvas();
}

// Week navigation
document.getElementById("prev-week-btn").addEventListener("click", ()=>{
    currentDate.setDate(currentDate.getDate()-7);
    renderCalendar(currentDate);
});
document.getElementById("next-week-btn").addEventListener("click", ()=>{
    currentDate.setDate(currentDate.getDate()+7);
    renderCalendar(currentDate);
});

function currentWeekKey(){
    const startOfWeek = getStartOfWeek(currentDate);
    return `week-${startOfWeek.getFullYear()}-${startOfWeek.getMonth()}-${startOfWeek.getDate()}`;
}

// Save button
document.getElementById("save-btn").addEventListener("click", saveCanvas);

// Initial render
window.onload = ()=>{
    renderCalendar(currentDate);
};
window.addEventListener("resize", resizeCanvas);
