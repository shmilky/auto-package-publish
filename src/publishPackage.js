const cmd = require('node-cmd');
const Promise = require('bluebird');
const verComparator = require('compare-versions'); // Compares version, i.e. 1.4.5 > 1.3.5

const getAsync = Promise.promisify(cmd.get, {multiArgs: true, context: cmd});

function emptyPromise () {
    return new Promise(function (succCB){
        succCB();
    });
}

module.exports = function (packageJson, beforePublishing, afterPublishing) {
    if (!packageJson || !packageJson.version) {
        throw ('Received package json file is not valid');
    }

    if (!beforePublishing) {
        console.log('Missing and  expected input promise methods, will use empty promise instead');
        beforePublishing = emptyPromise;
        afterPublishing = emptyPromise;
    }

    const currPackageVersion = packageJson.version;

    getAsync('npm show ' + packageJson.name + ' version').then(function(data) {
        if (data.length < 1) { // Response should be an array with the version as a XX.YY.ZZ\n text version value at index 0
            throw ('Can\'t parse received "show package version" response');
        }

        const currPublishedVersion = data[0].replace(/[^0-9$.,]/g, '');

        console.log('Current published version is ' + currPublishedVersion + ', current package version is '+ currPackageVersion);

        if (verComparator(currPackageVersion, currPublishedVersion) < 1) {
            console.log('No need to publish package');
            process.exit();
        }


        console.log('Running pre-publishing received method');
        return beforePublishing();
    }).then(function () {
        console.log('publishing package as new version + ' + currPackageVersion);

        return getAsync('npm publish');
    }).then(function(data) {
        data.forEach(function (str) {
            console.log(str);
        });

        console.log('Running pre-publishing received method');
        return afterPublishing();
    }).catch(function (err) {
        console.error(err);
    });
};
