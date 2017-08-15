
## Auto publishing npm packages

A simple tool to combine with a CI-CD system to auto publish npm packages in the build process.

#### VERY IMPORTANT
>The executable must be in the same folder as the package package.json file since it uses ```npm publish``` command which require it.

>Part of the publishing process is a check for the current published version, for this the package must be already published.
>For first time publishing you should do it manually with simple ```npm publish```

#### Usage Example
```javascript
const publisher = require('auto-package-publisher');

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

```

You can see it in checkPublish.js file