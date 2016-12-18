Fork to add reference handling.

Currently abandoned in favor of [borc-refs](https://github.com/sandhawke/borc-refs)

-----
A comment I posted about this work in https://github.com/hildjj/node-cbor/issues/35 (but deleted as not so relevant):

Not sure the best approach here, but I spent much of today playing with it. For cycle detection I used an array of the things currently being pushed. No idea how that compares in performance to the Symbol approach. (Probably worth implementing both and comparing, but it might depend on the workload. My approach would be terrible for deeply nested objects, but might benefit from more localized memory writes otherwise.) See code, about 15 lines, at https://github.com/sandhawke/node-cbor-refs/blob/master/lib/encoder.js#L388

Where it gets interesting is what to do if you find a cycle. I mostly got cycle detection, serialization, and deserialization working. I used the cbor tags 28 and 29 from http://cbor.schmorp.de/value-sharing.

I started by adding an encoder option pleaseKeep which is an array of objects which should be emitted, when they are emitted, with the tag 28 ("mark value as (potentially) shared"), and then, thereafter (as items in this.kept), when they are emitted again, a tag 29 ("reference nth marked value") tag is used in their place. This lets a higher level, that knows about cycles, flag some bits as needing to be made referenceable like this. There are other uses for structure sharing, of course, beyond dealing with cycles.

I made an encodeAll so I could give options (without making an Encoder each time), and with the option { cycle: true } encodeAll checks for cycles and when they are encountered, it uses pleaseKeep to deconstruct them. Encoder would have to use a different approach, since it can't un-write when it discovers a cycle. (With the Symbol approach, that should be fine. One pass to mark them and see what cycles exist. Second pass, removing the Symbols, is the actual writes. That'd probably be better than how I did it.)

Then I added the decoder part. One tricky thing is that I want the back-references to be able to carry across multiple decoder runs, so I pass in 'kept' as an option, where the decoder uses it for 29s and adds to it for 28s. And I made decodeAllSync do reconstruction by default. Also, it's pretty tricky code because the references can arrive out-of-order.

Anyway, you can see the code, etc, in my fork, if you're interested. Probably clearest to start with the test cases: https://github.com/sandhawke/node-cbor-refs/blob/master/test/refs.ava.js As I write this and head for bed, the last two are failing for reasons unknown.
