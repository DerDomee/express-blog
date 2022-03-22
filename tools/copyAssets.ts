import * as shell from 'shelljs';

shell.cp('-R', "src/views", 'dist/');
shell.cp('-R', 'src/partials', 'dist/');
shell.cp('-R', 'src/public', 'dist/');
