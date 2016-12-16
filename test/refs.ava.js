'use strict'

const cbor = require('../')
const test = require('ava')

test('keep', t => {
  const a = []
  const b = []

  const bytes = cbor.encodeAll([a, b, a, b, a], {pleaseKeep: [a, b]})

  t.is(bytes.toString('hex'),
       'd81c80' +  // 28([])   mark the first array as to be shared
       'd81c80' +  // 28([])   and the second
       'd81d00' +  // 29(0)    refer to the first
       'd81d01' +  // 29(1)    and the second
       'd81d00'    // 29(0)    and the first again
      )
})

test('cycle a=[a]', t => {
  const a = []
  a.push(a) // make this a cyclical structure

  const bytes = cbor.encodeAll([a], {cycles: true})
  t.not(bytes, null)
  t.is(bytes.toString('hex'),
       'd81c81d81d00' // 28([29(0)])
      )
})

test('cycle a=[[[a]]]', t => {
  const a = []
  a.push([[[a]]])

  const bytes = cbor.encodeAll([a], {cycles: true})
  t.is(bytes.toString('hex'),
       'd81c81818181d81d00' // 28([[[[29(0)]]]])
      )
})

test('a=[a,a]', t => {
  const a = []
  a.push(a, a)

  const bytes = cbor.encodeAll([a], {cycles: true})
  t.is(bytes.toString('hex'),
       'd81c82d81d00d81d00' // 28([29(0), 29(0)])
      )
})

test('two cycles', t => {
  const a = {}
  const b = {}
  a.a = a
  b.b = b
  const c = [a, b]

  const bytes = cbor.encodeAll([c], {cycles: true})
  t.is(bytes.toString('hex'),
       '82d81ca16161d81d00d81ca16162d81d01'// [28({"a": 29(0)}), 28({"b": 29(1)})]
      )
})
