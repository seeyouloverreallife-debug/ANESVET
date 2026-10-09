'use strict';
// CSS URLs are relative to the delivered assets/css bundle.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..'),target=path.join(R,'assets/css/anesvet-ui-bundle.css');
const old=fs.readFileSync(target,'utf8'),markers=[...old.matchAll(/\/\* === SOURCE: (.*?) === \*\//g)].map(m=>m[1]);
if(markers.length!==38||new Set(markers).size!==38)throw new Error('Expected the established 38-source bundle order');
const prefix=old.split('/* === SOURCE:')[0],parts=markers.map(name=>'/* === SOURCE: '+name+' === */\n'+fs.readFileSync(path.join(R,name),'utf8').replace(/url\((['"]?)\.\/assets\//g,'url($1../'));
fs.writeFileSync(target,prefix+parts.join('\n'));
console.log('Rebuilt '+markers.length+' stylesheet sources');
