// Generated asset wrapper keeps local-file previews working without texture CORS errors.
const fs=require('node:fs');
const bytes=fs.readFileSync('exterior-fifth-floor.png');
fs.writeFileSync('exterior-texture.js','window.B1_EXTERIOR_DATA="data:image/png;base64,'+bytes.toString('base64')+'";\n');
