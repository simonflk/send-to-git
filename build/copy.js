'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = copy;

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function copy(src, dest) {
  return new Promise(resolve => {
    _vinylFs2.default
      .src(src)
      .pipe(_vinylFs2.default.dest(dest))
      .on('end', () => {
        resolve();
      });
  });
}
//# sourceMappingURL=copy.js.map
