// For delay and wait 
function colorPromise(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        }, 1000);
    });
}


async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse){

    let [srow, scol] = cycleResponse;

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


    let response = await dfsTracePath(graphComponentMatrix, srow, scol, visited, dfsVisited);
    if(response === true){
        return Promise.resolve(true);
    }

    return Promise.resolve(false);
}



async function dfsTracePath(graphComponentMatrix, srow, scol, visited,dfsVisited){
    
    let children = graphComponentMatrix[srow][scol];

    visited[srow][scol] = true;
    dfsVisited[srow][scol] = true;

    let cell = document.querySelector(`.single-cell[rid="${srow}"][cid="${scol}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise();

    for(let idx = 0; idx < children.length; idx++){
        let [crid, ccid] = children[idx];
        if(visited[crid][ccid] === false){
            if(await dfsTracePath(graphComponentMatrix,crid,ccid,visited,dfsVisited)) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        }
        else{
            if(dfsVisited[crid][ccid]){
                let cyclicCell = document.querySelector(`.single-cell[rid="${crid}"][cid="${ccid}"]`);
                cyclicCell.style.backgroundColor = "lightsalmon";
                await colorPromise();

                cyclicCell.style.backgroundColor = "transparent";
                cell.style.backgroundColor = "transparent";
                await colorPromise();

                return Promise.resolve(true);
            }
        }
    }

    dfsVisited[i][j] = false;
    return Promise.resolve(false);
}