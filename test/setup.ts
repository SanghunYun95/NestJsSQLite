import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } 
    catch (err) { 
        // No action, even if an error occurs
    }
});