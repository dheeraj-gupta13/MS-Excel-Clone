for(let i = 0; i < row; i++){
    for(let j = 0; j < col; j++){
        let cell = document.querySelector(`.single-cell[rid="${i}"][cid="${j}"]`);
        // In order to leave the cell, I need to retain the data of the cell
        cell.addEventListener("blur",(e)=>{
            let address = addressBar.value;
            let [activeCell, cellProp] = getActiveCell(address);

            let  enteredData = activeCell.innerText;
            cellProp.value = enteredData;
        });
    }
}


// Enter a string in Formula bar, press Enter, evaluate it,
// and made changes in UI and cellProp...
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",(e)=>{
    let inputExpression = formulaBar.value;
    if(e.key === "Enter" && inputExpression){
        let evaluatedAns =  evaluate(inputExpression);

        setUIAndCellProp(evaluatedAns,inputExpression);
    }
});

function evaluate(s) {
    let ans = decodeFormula(s);
    return eval(ans);
}

function decodeFormula(s){
    let FormulaArr = s.split(" ");
    let decodedString = "";
    FormulaArr.forEach((e)=>{
        if(e[0] >= 'A' && e[0] <= 'Z'){
            let address = e;
            let [rid,cid] = decodeRidCid(address);
            let cellProp = sheetDB[rid][cid];

            let requiredValue = cellProp.value;
            decodedString += requiredValue;
        }
        else{
            decodedString += e;
        }
    });
    return decodedString;
}


function setUIAndCellProp(evaluatedAns, formula){
    let address = addressBar.value;
    let [activeCell, cellProp] = getActiveCell(address);

    // UI Update
    activeCell.innerText = evaluatedAns; 

    // DB Update
    cellProp.value = evaluatedAns; 
    cellProp.formula = formula; 
}