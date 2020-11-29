'use strict';

document.addEventListener('DOMContentLoaded',  function (){

    var input = document.getElementById('fileInput');


    input.onchange = function(e){ 
       var file = e.target.files[0]; 

       if(file){
        const path = 'file:'
        readFile(file);
       }
       
    }
    
    function readFile(file){
        var reader = new FileReader();
    
        reader.addEventListener('load', function (e) {
            //console.log(e.target.result);
            document.getElementsByClassName('inputText')[0].textContent = e.target.result;

            const mtx = storeAsMatrix(e.target.result);

            const converted = convertMatrix(mtx);

            //console.log(converted);

            const outputString = converted.reduce(
                (acc,c) => {
                    acc += c.join(',')+ '\n';
                    return acc;
                }, '');

            document.getElementsByClassName('outputText')[0].textContent = outputString;

        });
        
        reader.readAsBinaryString(file);
    }


    function storeAsMatrix(data){
        const lines = data.split('\n');
        
        let mtx = initEmptyMtx(lines.length, lines[0].split(',').length);
        for(var i = 0; i<lines.length; i++){
            mtx[i]=lines[i].split(',').map(t => +t);
        }

        return mtx;
    }

    function convertMatrix(mtx){
        const row = mtx.length;
        const col = mtx[0].length;
        
        let result = initEmptyMtx(row,col);

        for(var i = 0; i<row; i++){
            for(var j = 0; j<col; j++){
                if(mtx[i][j] === 0){
                    result[i][j] = computeValue(mtx, i, j);
                } else {
                    result[i][j] = mtx[i][j];
                }
            }
        }

        return result;
    }

    function initEmptyMtx(row,col){
        //console.log(row,col);

        var arr = new Array(row);
        for(var i = 0; i < arr.length; i++){
            arr[i] = new Array(col);
        }
        return arr;
    }

    //X X X
    //X T X
    //X X X
    // X are the neighbours and T is the target
    // Aim is to generate an average value for the '0' valued cell, using the neighbour cells as depicted above
    function computeValue(mtx, i, j){
        const row = mtx.length;
        const col = mtx[0].length;

        let cnt = 0;
        let sum = 0;

        for(var r = i-1; r <= i+1; r++){
            for(var c = j-1; c <= j+1; c++){
                if(r === i && c === j){
                    continue;//skip self --> T
                }
                if(r >=0 && r<row && c>=0 && c<col){  // check if exceeds matrix borders , only takes the ones that hit matrix
                    cnt++;
                    sum += mtx[r][c];
                }
            }
        }

        //console.log('Sum', sum);
        //console.log('Cnt', cnt);
        //console.log('Average', sum/cnt);

        return sum / cnt; // return the average of neighbours
    }
}
)