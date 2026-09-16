# Launchpad Studios site

A minimal interactive studio portfolio inspired by the layout language you referenced, but with original code and an original procedural 3D sculpture.

## Open it
Because the page uses ES modules, run it from a tiny local server rather than double-clicking `index.html`.

### Python
```bash
python -m http.server 8000
```
Then open http://localhost:8000

## Free hosting
This project is prepared for GitHub Pages. Publish the repository from the `main` branch and the repository root in **Settings → Pages**.

## Exact 3D model
The included CRT-head sculpture is original and built from Three.js primitives.
If you want the exact 3D asset from another website, you need the original `.glb/.gltf/.fbx` asset and permission/license to use it. If you provide your licensed model file, replace the procedural model in `script.js` with a GLTFLoader import.

## Things to edit later
- Add film projects when announced.
- Add a custom domain if desired.
