'use strict'

exports.Commented = require('./commented')
exports.Diagnose = require('./diagnose')
exports.Decoder = require('./decoder')
exports.Encoder = require('./encoder')
exports.Simple = require('./simple')
exports.Tagged = require('./tagged')
exports.Resolve = require('./resolve')

exports.comment = exports.Commented.comment
exports.decodeAll = exports.Decoder.decodeAll
exports.decodeFirst = exports.Decoder.decodeFirst
exports.decodeAllSync = exports.Decoder.decodeAllSync
exports.decodeFirstSync = exports.Decoder.decodeFirstSync
exports.diagnose = exports.Diagnose.diagnose
exports.encode = exports.Encoder.encode
exports.encodeAll = exports.Encoder.encodeAll
exports.decode = exports.Decoder.decodeFirstSync
exports.resolveReferences = exports.Resolve.resolveReferences

exports.leveldb = {
  decode: exports.Decoder.decodeAllSync,
  encode: exports.Encoder.encode,
  buffer: true,
  name: 'cbor'
}
