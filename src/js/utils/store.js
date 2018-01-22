/**
 * A custom build of store.js with only the things we need.
 */

import engine from 'store/src/store-engine';
import localStorage from 'store/storages/localStorage';

export default engine.createStore([localStorage]);
