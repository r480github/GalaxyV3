import fs from 'node:fs';
import path from 'node:path';

function setup() {
    try {
        console.log("Setting up Rammerhead...");
        fs.mkdirSync(path.join(import.meta.dirname, '..', 'sessions'));
        fs.mkdirSync(path.join(import.meta.dirname, '..', 'cache-js'));
        fs.mkdirSync(path.join(import.meta.dirname, '..', 'public'));
    }
    catch (err) {
        console.error('Error occured while setting up:', err);
    }
}

setup();
export { setup }
