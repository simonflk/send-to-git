'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _copy = require('./copy');

var _copy2 = _interopRequireDefault(_copy);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Keeps in sync a folder and their files with a folder of a git repository
 * @param {(string|string[])} source - Glob or array of globs to read.
 * @param {string} destination - Relative destination path.
 * @param {string} remote - git repository url.
 * @param {Object} [options]
 * @param {string} [options.commitMessage] - Commit message for the modifications.
 * @param {string} [options.branch] - Branch to add and push the changes.
 * @returns {Promise}
 */
exports.default = async function sendToGit(source, destination, remote, options = {}) {
  if (!source || source.length === 0 || (!destination && destination !== '') || !remote) {
    throw new Error('"source", "destination" and "remote" are required');
  }

  if (_path2.default.isAbsolute(destination)) {
    throw new Error(`"destination" needs to be a relative path, actual value "${destination}".`);
  }

  const tempDir = getTempDir();
  const to = _path2.default.resolve(tempDir, destination);
  const from = _path2.default.resolve(process.cwd(), source);
  const commitMessage = options.commitMessage || 'Files added';
  const branch = options.branch || 'master';
  const deleteGlob =
    to === tempDir
      ? [_path2.default.resolve(to, '**/*'), `!${_path2.default.resolve(to, '.git/**/*')}`]
      : to;

  await (0, _del2.default)(tempDir, { force: true });
  await (0, _execa2.default)('git', ['clone', '--depth', '1', remote, tempDir]);
  await (0, _del2.default)(deleteGlob, { force: true });
  await (0, _copy2.default)(from, to);
  const gitStatus = await (0, _execa2.default)('git', ['status'], { cwd: tempDir });
  const isNothingToCommit = gitStatus.stdout.indexOf('nothing to commit') > -1;

  if (!isNothingToCommit) {
    await (0, _execa2.default)('git', ['checkout', branch], { cwd: tempDir });
    await (0, _execa2.default)('git', ['add', '-A', '.'], { cwd: tempDir });
    await (0, _execa2.default)('git', ['commit', '-m', commitMessage], { cwd: tempDir });
    await (0, _execa2.default)('git', ['push', 'origin', branch], { cwd: tempDir });
  }

  await (0, _del2.default)(tempDir, { force: true });
};

function getTempDir() {
  const tempDir = _path2.default.join(_os2.default.tmpdir(), 'send-to-git', (0, _v2.default)());
  return tempDir;
}
//# sourceMappingURL=index.js.map
