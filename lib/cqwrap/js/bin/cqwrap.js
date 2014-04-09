#!/usr/bin/env node

var fs = require('fs.extra');

var args = process.argv;

if(args.length <= 3){
    console.log('cqwrap.js -o <game_name>');
    process.exit(0);
}

var gameDir = args[3];

if(fs.existsSync('./'+ gameDir)){
    console.log('the game ' + gameDir + ' exists!');
    process.exit(0);
}else{
    var FN = function(){};
    console.log('creating game ' + gameDir + '...');
    fs.mkdirSync(gameDir);
    //console.log(__dirname);
    
    var templateDir = __dirname + '/..';
    var cqwrapDir = __dirname + '/../' + 'cqwrap';
    var cocosDir = __dirname + '/../' + 'lib';
    
    fs.symlinkSync(cqwrapDir, gameDir + '/cqwrap');
    fs.symlinkSync(cocosDir, gameDir + '/lib');

    fs.mkdirSync(gameDir + '/dist');
    fs.copy(templateDir + '/dist/README.md'
        , gameDir + '/dist/README.md', FN);

    fs.copyRecursive(templateDir + '/res', gameDir + '/res', FN);
    fs.copyRecursive(templateDir + '/src', gameDir + '/src', FN);

    fs.copy(templateDir + '/build.js',
            gameDir + '/build.js', FN);
    fs.copy(templateDir + '/index.js',
            gameDir + '/index.js', FN);  
    fs.copy(templateDir + '/index.html',
            gameDir + '/index.html', FN);
    fs.copy(templateDir + '/main.js',
            gameDir + '/main.js', FN);    
    fs.copy(templateDir + '/require.js',
            gameDir + '/require.js', FN);
    
    fs.symlinkSync(templateDir + '/server.sh',
            gameDir + '/server.sh', FN); 

    console.log('done!');          
}
