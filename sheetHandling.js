// We can create multiple sheets.

const activeSheetColor = "#ced6e0";

const allFolders = document.querySelector(".sheet-folder-cont");
const addSheetBtn = document.querySelector(".add-icon");

addSheetBtn.addEventListener("click", (e)=>{
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);
    
    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>`;
    
    allFolders.append(sheet);

    addSheetDB(); // Add this sheet in collection of all-sheets.
    createGraphComponentMatrix(); // For relationship

    handleSheetActiveness(sheet); // addEventListener , that, if user clicks on this sheet make it active.
    handleSheetRemoval(sheet); // addEventListener , that, if user right-clicks on this sheet delete it.

    sheet.click();
});


function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        if(e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length === 1) {
            alert("You need atleast one sheet!");
            return;
        }

        let response = confirm("It will remove the sheet permanently. Are you sure ?");
        if(response === false) return;

        let idx = Number(sheet.getAttribute("id"));
        // DB 
        containerSheetDB.splice(idx,1);
        collectedGraphComponentMatrix.splice(idx,1);
        // UI
        handleRemovalUI(sheet);
        handleSheetDB(0); // if this sheet is removed, then make sheet 1 active
        handleSheetProperties();
    });
}
                                                

function handleRemovalUI(sheet){
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent =  allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetUI(sheet){
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}


function handleSheetDB(index){
    sheetDB = containerSheetDB[index];
    graphComponentMatrix = collectedGraphComponentMatrix[index];   
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click", ()=>{
        let idx = Number(sheet.getAttribute("id"));
        handleSheetDB(idx);
        handleSheetProperties();
        handleSheetUI(sheet);
    });
}


// When I switch to this ith sheet, I want my each cell to get clicked once
// to retain its last relations and properties.
function handleSheetProperties() {
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            let cell = document.querySelector(`.single-cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    // When we open the sheet, by default click on first cell
    let firstCell = document.querySelector(".single-cell");
    firstCell.click();
}



// Every Sheet has it's own information about it's cells. 
function addSheetDB(){
    // Array of Arrays containing information of a particular block.
    let sheetDB = []; // create "Sheet i"
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

    // Add the created ith Sheet in single array
    containerSheetDB.push(sheetDB);
}



// Every Sheet has it's own relation of children and cells. 
function createGraphComponentMatrix(){
    let graphComponentMatrix = []; // create "Sheet i"

    for(let i = 0; i < row; i++){
        let rowMatrix = []; // Array for each row.
        for(let j = 0; j < col; j++){
            rowMatrix.push([]); // Each cell will contain about it's children.
        }
        graphComponentMatrix.push(rowMatrix); 
    }

    // Add the created ith Sheet in single array
    collectedGraphComponentMatrix.push(graphComponentMatrix);
}