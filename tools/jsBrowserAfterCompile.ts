import * as shell from 'shelljs';

console.log('Running jsBrowserAfterCompile ...');

shell.mv('dist/public/blog.js', 'dist/blog/public/');
shell.mv('dist/public/cms.js', 'dist/cms/public/');
shell.mv('dist/public/cloudcenter.js', 'dist/cloudcenter/public/');
shell.cp('dist/public/serviceworker.js', 'dist/blog/public/');
shell.cp('dist/public/serviceworker.js', 'dist/cms/public/');
shell.mv('dist/public/serviceworker.js', 'dist/cloudcenter/public/');
shell.rm('-R', 'dist/public');
