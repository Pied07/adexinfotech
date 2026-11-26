import * as migration_20261122_175444 from './20261122_175444.ts';
import * as migration_20261123_120000 from './20261123_120000.ts';
import * as migration_20261123_130000 from './20261123_130000.ts';
import * as migration_20261126_153218_add_404_site_settings_fields from './20261126_153218_add_404_site_settings_fields.ts';

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
  {
    up: migration_20261123_130000.up,
    down: migration_20261123_130000.down,
    name: '20261123_130000'
  },
  {
    up: migration_20261126_153218_add_404_site_settings_fields.up,
    down: migration_20261126_153218_add_404_site_settings_fields.down,
    name: '20261126_153218_add_404_site_settings_fields'
  },
];
