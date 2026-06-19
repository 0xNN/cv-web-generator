const { execFile } = require('child_process');

/**
 * Escapes a single value to make it safe for inclusion in raw SQL.
 * Supports: null/undefined, numbers, booleans, and strings.
 * @param {any} val 
 * @returns {string}
 */
function escape(val) {
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
function query(sql) {
  return new Promise((resolve, reject) => {
    execFile('team-db', [sql], (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Database command failed: ${error.message}. Stderr: ${stderr}`));
      }
      
      const cleanStdout = (stdout || '').trim();
      if (!cleanStdout) {
        return resolve([]);
      }
      
      try {
        const parsed = JSON.parse(cleanStdout);
        return resolve(parsed);
      } catch (err) {
        return reject(new Error(`Failed to parse database output as JSON: ${err.message}. Raw output: ${cleanStdout}`));
      }
    });
  });
}

module.exports = {
  query,
  escape
};
