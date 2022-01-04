// We need to store the information of each cell.  
// information such as , is the cell is bold, italic,.. What is alignment
// In order to store info of each cell , we will use 2D array -> "sheetDB"

// Array of Arrays containing information of a particular block.
let sheetDB = [];

// We will iterate to each row.
for(let i = 0; i < row ; i++){
    // Each row has 26 cols, from 1 to 26
    // so we will store info in "sheetRow".
    // sheetRow is the array of objects.
    let sheetRow = [];
    for(let j = 0; j < col; j++){
        let cellProp = {
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            fontStyle: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            BGcolor: "#ecf0f1",  // Just for indication purpose,
            value: "",
            formula: "",
            children: [],
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// cellProp is the object containing information of single-cell. 


// Selectors for cell properties
const bold = document.querySelector(".bold");
const italic = document.querySelector(".italic");
const underlined = document.querySelector(".underlined");
const fontColor = document.querySelector(".FontColor");
const BGcolor = document.querySelector(".BGcolor");
const fontStyle = document.querySelector(".font-style-prop");
const fontSize = document.querySelector(".font-size-prop");
const alignment = document.querySelectorAll(".alignment");
const leftAlign = alignment[0];
const centerAlign = alignment[1];
const rightAlign = alignment[2];


// If any property is applied to particular cell, we will apply background color as
// "activeColorProp" and if it is not applied, then we will apply background color as
// "inActiveColorProp"
let activeColorProp = "#d1d8e0";
let inActiveColorProp = "#dfe4ea";


/*
    In order to fetch the location of any cell, we use address bar.

    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cell -> Returns the reference to current active cell so that we can perform changes in UI
    cellProp -> Returns the reference to current cell data from "sheetDB", so that we can perform changes in database(2D Array)

*/


// Attach Click Listener
bold.addEventListener("click", (e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.bold = !cellProp.bold;  // making changes in Object 

    cell.style.fontWeight = (cellProp.bold) ? "bold" : "normal"; // UI change of cell 
    bold.style.backgroundColor = (cellProp.bold) ? activeColorProp : inActiveColorProp; // UI change of task-bar 
});

italic.addEventListener("click", (e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.italic = !cellProp.italic; // making changes in Object 

    cell.style.fontStyle= (cellProp.italic) ? "italic" : "normal"; // UI change of cell 
    italic.style.backgroundColor = (cellProp.italic) ? activeColorProp : inActiveColorProp; // UI change of task-bar 
});

underlined.addEventListener("click", (e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.underlined = !cellProp.underlined; // making changes in Object 

    cell.style.textDecoration = (cellProp.underlined) ? "underline" : "none"; // UI change of cell 
    underlined.style.backgroundColor = (cellProp.underlined) ? activeColorProp : inActiveColorProp; // UI change of task-bar 
});


fontSize.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.fontSize = fontSize.value; // making changes in Object 
    cell.style.fontSize  = cellProp.fontSize + "px";  // UI change of cell 
    fontSize.value = cellProp.fontSize; // UI change of task-bar (default)
});

fontStyle.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.fontStyle = fontStyle.value; // making changes in Object 
    cell.style.fontFamily  = cellProp.fontStyle;  // UI change of cell 
    fontStyle.value = cellProp.fontStyle;  // UI change of task-bar (default)
});

fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.fontColor = fontColor.value; // making changes in Object
    cell.style.color  = cellProp.fontColor; // UI change of cell 
    fontColor.value = cellProp.fontColor; // UI change of task-bar (default)
});

BGcolor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.BGcolor = BGcolor.value; // making changes in Object
    cell.style.backgroundColor = cellProp.BGcolor; // UI change of cell 
    BGcolor.value = cellProp.BGcolor; // UI change of task-bar (default)
});


// Change alignment, 
// Out of three, any one alignment can be applied to a particular cell.
alignment.forEach((alignEle)=>{
    alignEle.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell, cellProp] = getActiveCell(address);

        let alignValue = e.target.classList[0]; // left / center / right 
        cellProp.alignment = alignValue; // making changes in Object
        cell.style.textAlign = cellProp.alignment; // UI change of cell

        switch(alignValue){ // UI change of task-bar
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inActiveColorProp;
                rightAlign.style.backgroundColor = inActiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inActiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inActiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inActiveColorProp;
                centerAlign.style.backgroundColor = inActiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;        
        }
    });
});


// Performing some modification in properties, and switching to other cell , I want
// changes to be retained, at the same time we need not to reflect this change to any new cell
const allCells = document.querySelectorAll(".single-cell");
for(let i = 0; i < allCells.length; i++){
    addListenerToDefaultCell(allCells[i]);
}

// A listener to each single-cell, so that we can retain the changes we have made to this cell,
// when we visited it last time
function addListenerToDefaultCell(cell) {
    cell.addEventListener("click",(e) => {

        let address = addressBar.value;
        let [rid, cid] = decodeRidCid(address);
        let cellProp = sheetDB[rid][cid]; // Retaining the properties of this single-cell from my sheetDB

        // Change in cell Properties.
        cell.style.fontWeight = (cellProp.bold) ? "bold" : "normal";
        cell.style.fontStyle = (cellProp.italic) ? "italic" : "normal";
        cell.style.textDecoration = (cellProp.underlined) ? "underline" : "none";
        cell.style.fontSize  = cellProp.fontSize + "px";
        cell.style.fontFamily  = cellProp.fontStyle;
        cell.style.color  = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;

        // Apply UI properties container
        bold.style.backgroundColor = (cellProp.bold) ? activeColorProp : inActiveColorProp;
        italic.style.backgroundColor = (cellProp.italic) ? activeColorProp : inActiveColorProp;
        underlined.style.backgroundColor = (cellProp.underlined) ? activeColorProp : inActiveColorProp;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        fontSize.value = cellProp.fontSize;
        fontStyle.value = cellProp.fontStyle;
        switch(cellProp.alignment){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inActiveColorProp;
                rightAlign.style.backgroundColor = inActiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inActiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inActiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inActiveColorProp;
                centerAlign.style.backgroundColor = inActiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;        
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.value = cellProp.value;
    });
}


// Returns the reference to active cell and active cell Object from database
// cell -> Returns the reference to current active cell so that we can perform changes in UI
// cellProp -> Returns the reference to current cell data from "sheetDB", so that we can perform changes in database(2D Array)
function getActiveCell(address){
    let [rid,cid] = decodeRidCid(address);
    let cell = document.querySelector(`.single-cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];

    return [cell, cellProp];
}

function decodeRidCid(address){
    let rid =  Number(address.slice(1))-1;
    let cid =  Number(address.charCodeAt(0)) - 65;

    return [rid,cid];
}