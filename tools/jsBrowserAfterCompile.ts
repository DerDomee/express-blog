import * as shell from 'shelljs';

shell.mv('dist/public/blog.js', 'dist/blog/public/');
shell.mv('dist/public/cms.js', 'dist/cms/public/');
shell.cp('dist/public/serviceworker.js', 'dist/blog/public/');
shell.mv('dist/public/serviceworker.js', 'dist/blog/public/');
shell.rm('-R', 'dist/public');
