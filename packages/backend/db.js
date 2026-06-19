const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Path to team-db CLI
const TEAM_DB_PATH = 'team-db';

/**
 * Escapes a single value to make it safe for inclusion in raw SQL.
 * Supports: null/undefined, numbers, booleans, and strings.
 * @param {any} val 
 * @returns {string}
 */
function escapeValue(val) {
  if (val === null || val === undefined) {
    return 'NULL';
  }
  if (typeof val === 'number') {
    if (Number.isNaN(val) || !Number.isFinite(val)) {
      return 'NULL';
    }
    return val.toString();
  }
  if (typeof val === 'boolean') {
    return val ? '1' : '0';
  }
  
  // For strings or any other type, convert to string and escape single quotes
  const str = String(val);
  const escaped = str.replace(/'/g, "''");
  return `'${escaped}'`;
}

/**
 * Executes a SQL statement on the Turso team database via team-db CLI.
 * @param {string} sql 
 * @returns {Promise<any[]>}
 */
async function query(sql) {
  try {
    const escapedSql = sql.replace(/"/g, '\\"');
    const { stdout, stderr } = await execPromise(`${TEAM_DB_PATH} "${escapedSql}"`);
    
    if (stderr && stderr.trim()) {
      console.warn("DB stderr warnings:", stderr);
    }
    
    const cleanStdout = stdout.trim();
    if (!cleanStdout) {
      return [];
    }
    
    return JSON.parse(cleanStdout);
  } catch (error) {
    console.error("Database query failed:", error.message);
    if (error.stderr) {
      console.error("Database stderr detail:", error.stderr);
    }
    throw error;
  }
}

module.exports = {
  query,
  escape: escapeValue
};