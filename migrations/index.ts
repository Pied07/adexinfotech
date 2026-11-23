import * as migration_20261122_175444 from './20261122_175444';
import * as migration_20261123_120000 from './20261123_120000';

export const migrations = [
  {
    up: migration_20261122_175444.up,
    down: migration_20261122_175444.down,
    name: '20261122_175444'
  },
  {
    up: migration_20261123_120000.up,
    down: migration_20261123_120000.down,
    name: '20261123_120000'
  },
];
