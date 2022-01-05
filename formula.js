for(let i = 0; i < row; i++){
    for(let j = 0; j < col; j++){
        let cell = document.querySelector(`.single-cell[rid="${i}"][cid="${j}"]`);
        // In order to leave the cell, I need to retain the data of the cell
        cell.addEventListener("blur",(e)=>{
            let address = addressBar.value;
            let [activeCell, cellProp] = getActiveCell(address);

            let  enteredData = activeCell.innerText;

            if(enteredData === cellProp.value){
                return;
            } 

            cellProp.value = enteredData;

            // If data modifies, remove Parent-Child relationship , formula empty
            // update children with new hardcoded (modified) value.
            removeChildToParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        });
    }
}


// Enter a string in Formula bar, press Enter, evaluate it,
// and made changes in UI and cellProp...
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e)=>{
    let inputExpression = formulaBar.value;
    if(e.key === "Enter" && inputExpression){

        let address = addressBar.value;
        let [cell, cellProp] = getActiveCell(address);
        if(inputExpression !== cellProp.formula){
            removeChildToParent(cellProp.formula);
        }

        // We need to create a edge between variable in "inputExpression"
        // and address (address is the current position of pointer).
        addChildToGraphComponent(inputExpression, address);

        // check weather the added edge has created an cycle or not
        
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        // [i,j] -> Yes, graph is cyclic and cycle is at sheetDb[i][j]
        // null -> No, graph is not cyclic
        if(cycleResponse){
            let response = confirm("Your formula is cyclic. Do you want to trace path ?");

            while(response){
                // Keep on tracing the cycle.
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm("Your formula is cyclic. Do you want to trace path ?");
            }

            removeChildToGraphComponent(inputExpression, address)
            return;
        }
        
        let evaluatedAns = evaluate(inputExpression);

        // To update UI and cellProp in DB
        setUIAndCellProp(evaluatedAns,inputExpression, address);
        addChildToParent(inputExpression);

        updateChildrenCells(address);
    }
});

function addChildToGraphComponent(formula, childAddress){
    let encodedString = formula.split(" ");

    let [crid, ccid] = decodeRidCid(childAddress);
    for(let i = 0; i < encodedString.length; i++){
        let ascii = encodedString[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let [prid, pcid] = decodeRidCid(encodedString[i]);

            graphComponentMatrix[prid][pcid].push([crid,ccid]) ;
        }
    }
}


function removeChildToGraphComponent(formula, childAddress){
    let encodedString = formula.split(" ");

    let [crid, ccid] = decodeRidCid(childAddress);
    for(let i = 0; i < encodedString.length; i++){
        let ascii = encodedString[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let [prid, pcid] = decodeRidCid(encodedString[i]);

            // let idx = graphComponentMatrix[prid][pcid].indexOf([crid,ccid]) ;
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}


// Add the parent - child relationship.
function addChildToParent(formula){
    let encodedString = formula.split(" ");

    let childAddress = addressBar.value;
    for(let i = 0; i < encodedString.length; i++){
        let ascii = encodedString[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){

            let [parentCell, parentCellProp] = getActiveCell(encodedString[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}


function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = getActiveCell(parentAddress);
    let children = parentCellProp.children;

    for(let i = 0; i < children.length; i++){
        let childrenAddress = children[i];

        let [childrenCell, childrenCellProp] = getActiveCell(childrenAddress);
        let childFormula = childrenCellProp.formula;

        let evaluatedAns =  evaluate(childFormula);
        setUIAndCellProp(evaluatedAns,childFormula, childrenAddress);

        updateChildrenCells(childrenAddress);
    }
}


// Remove the parent - child relationship. 
function removeChildToParent(formula){
    let encodedString = formula.split(" ");
    let childAddress = addressBar.value;
    for(let i = 0; i < encodedString.length; i++){
        let ascii = encodedString[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){

            let [parentCell, parentCellProp] = getActiveCell(encodedString[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}


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


function setUIAndCellProp(evaluatedAns, formula, address){
    let [activeCell, cellProp] = getActiveCell(address);

    // UI Update
    activeCell.innerText = evaluatedAns; 

    // DB Update
    cellProp.value = evaluatedAns; 
    cellProp.formula = formula; 
}