import { readFirstPassword, readPasswordForEmail } from '../Modules/Functions/credentials.mjs';

console.log('readFirstPassword ->', readFirstPassword());
console.log("readPasswordForEmail('mercurioetil289@outlook.com') ->", readPasswordForEmail('mercurioetil289@outlook.com'));
console.log("readPasswordForEmail('nope@x') ->", readPasswordForEmail('nope@x'));
