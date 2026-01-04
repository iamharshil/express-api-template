// MVC preset likely involves re-wiring how controllers/routes are loaded
// or flattening the module structure. 
// Since we can't easily document "move files" in this static structure without a manifest,
// we assume the 'assembler' (CLI) reads a special config here.
// For now, we just provide a bootstrap override/append.
export class Bootstrap {
}
