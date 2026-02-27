const fs = require('fs');
const vm = require('vm');
const path = require('path');

const outputDir = './decrypted_files';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 1. Hooking VM Module (Sabse important)
const originalRunInContext = vm.runInContext;
vm.runInContext = function(code, ...args) {
    const fileName = `vm_dump_${Date.now()}.js`;
    fs.writeFileSync(path.join(outputDir, fileName), code);
    console.log(`[✔] VM Code Captured: ${fileName}`);
    return originalRunInContext.apply(this, [code, ...args]);
};

// 2. Hooking Function Constructor
const originalFunction = global.Function;
global.Function = function(...args) {
    const code = args[args.length - 1];
    const fileName = `func_dump_${Date.now()}.js`;
    fs.writeFileSync(path.join(outputDir, fileName), code);
    console.log(`[✔] Function Code Captured: ${fileName}`);
    return originalFunction.apply(this, args);
};
