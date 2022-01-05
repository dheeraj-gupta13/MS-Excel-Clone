// A 2-D Matrix for storing the cell number of it's children.
let graphComponentMatrix = [];

for(let i = 0; i < row; i++){
    let rowMatrix = []; // Array for each row.
    for(let j = 0; j < col; j++){
        rowMatrix.push([]); // Each cell will contain about it's children.
    }
    graphComponentMatrix.push(rowMatrix); 
}


// True -> yes, graph is cyclic 
// False -> No, graph is not cyclic
function isGraphCyclic(graphComponentMatrix){

    let visited = [];
    let dfsVisited = [];

    for(let i = 0; i < row; i++){
        let rowVisited = [];
        let dfsRowVisited = [];
        for(let j = 0; j < col; j++){
            rowVisited.push(false); 
            dfsRowVisited.push(false);
        }
        visited.push(rowVisited);
        dfsVisited.push(dfsRowVisited);
    }

    // If any component returns true, then graph is detected.
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            if(visited[i][j] == false){
                if(dfs(graphComponentMatrix, i, j, visited, dfsVisited))
                    return [i,j];
            }
        }
    }

    return null;
}


function dfs(graphComponentMatrix, i, j, visited,dfsVisited){
    
    let children = graphComponentMatrix[i][j];

    visited[i][j] = true;
    dfsVisited[i][j] = true;
    for(let idx = 0; idx < children.length; idx++){
        let [crid, ccid] = children[idx];
        if(visited[crid][ccid] === false){
            if(dfs(graphComponentMatrix,crid,ccid,visited,dfsVisited)) return true;
        }
        else{
            if(dfsVisited[crid][ccid]) return true;
        }
    }

    dfsVisited[i][j] = false;
    return false;
}