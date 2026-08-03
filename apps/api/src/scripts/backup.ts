import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { createLocalBackup, listBackups } from '../services/backup.service.js';
import { env } from '../config/env.js';

async function main() {
  const mode = process.argv[2];

  if (mode === 'create') {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[BACKUP] Creating local database backup...');
    const result = await createLocalBackup();
    console.log(`✅ Backup created successfully: ${result.filename}`);
    console.log(`- Path: ${result.filePath}`);
    console.log(`- Size: ${(result.sizeBytes / 1024).toFixed(2)} KB`);
    console.log(`- SHA-256 Checksum: ${result.checksum}`);
    console.log(`- Records: ${JSON.stringify(result.recordCounts)}`);
    await mongoose.disconnect();
  } else if (mode === 'verify') {
    console.log('[BACKUP] Verifying existing local backups...');
    const backups = listBackups();
    if (backups.length === 0) {
      console.log('⚠️ No backup files found in ./backups directory.');
      return;
    }
    console.log(`Found ${backups.length} backup files:`);
    for (const b of backups) {
      const p = path.resolve('./backups', b.filename);
      const content = fs.readFileSync(p, 'utf-8');
      try {
        const parsed = JSON.parse(content);
        console.log(`✅ ${b.filename} - Valid JSON (Version ${parsed.metadata?.appVersion || 'v1'}) - ${b.sizeBytes} bytes`);
      } catch {
        console.error(`❌ ${b.filename} - Corrupted JSON file`);
      }
    }
  } else {
    console.log('Usage: npx tsx apps/api/src/scripts/backup.ts [create|verify]');
  }
}

main().catch((err) => {
  console.error('[BACKUP ERROR]', err);
  process.exit(1);
});
