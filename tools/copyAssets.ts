import * as shell from 'shelljs';

shell.cp('-R', 'src/blog/views', 'dist/blog/');
shell.cp('-R', 'src/blog/partials', 'dist/blog/');
shell.cp('-R', 'src/blog/public', 'dist/blog/');
shell.cp('-R', 'src/cms/views', 'dist/cms/');
shell.cp('-R', 'src/cms/partials', 'dist/cms/');
shell.cp('-R', 'src/cms/public', 'dist/cms/');
