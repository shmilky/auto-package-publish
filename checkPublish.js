
const publisher = require('./src/publishPackage');
const packageJson = require('./package.json');

function beforePublishing () {
    return new Promise(function (succCB){
        console.log('Pre work ..........................');
        succCB();
    });
}


function afterPublishing () {
    return new Promise(function (){
        console.log('Post work .........................');
    });
}

publisher(packageJson, beforePublishing, afterPublishing);