let row = 100;
let col = 26;

const addressColCont = document.querySelector(".address-col-cont");
const addressRowCont = document.querySelector(".address-row-cont");
const cellsCont =  document.querySelector(".cells-cont");
const addressBar = document.querySelector(".address-bar");


for(let i = 0; i < row; i++){
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class","address-col");

    addressCol.innerHTML = i+1;
    addressColCont.appendChild(addressCol);
}

for(let i = 0; i < col; i++){
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class","address-row");

    addressRow.innerHTML = String.fromCharCode(65 + i);
    addressRowCont.appendChild(addressRow);
}

for(let i = 0; i < row; i++){
    let singleCol = document.createElement("div");
    singleCol.setAttribute("class","single-col");

    for(let j = 0; j < col; j++){
        let singleCell = document.createElement("div");
        singleCell.setAttribute("class", "single-cell");
        singleCell.setAttribute("contenteditable", "true");
        singleCell.setAttribute("spellcheck", "false");

        // For cell identification, so that we could access data from sheetDB
        singleCell.setAttribute("rid", i);
        singleCell.setAttribute("cid", j);

        singleCol.appendChild(singleCell);
        addressBarDisplay(singleCell,i,j);
    }

    cellsCont.appendChild(singleCol);
}

function addressBarDisplay(cell, row, col){
    cell.addEventListener("click",()=>{
        let colID = String.fromCharCode(65 + col);
        let rowID = row+1;
      
        addressBar.value =  `${colID}${rowID}`;
    });
}

