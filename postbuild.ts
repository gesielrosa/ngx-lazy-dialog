const fs = require('fs');

fs.copyFile('README.md', 'dist/ngx-lazy-dialog/README.md', (err: any) => {
  if (err) throw err;
});
