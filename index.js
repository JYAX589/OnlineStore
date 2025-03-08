import { initServer } from './configs/server.js';

initServer();

import { config } from 'dotenv';

config();

import { defaultAdmin } from './src/user/user.controller.js';

defaultAdmin();

import { defaultCategory } from './src/category/category.controller.js';

defaultCategory();