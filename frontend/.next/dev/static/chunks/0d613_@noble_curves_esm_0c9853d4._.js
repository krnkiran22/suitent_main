(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aInRange",
    ()=>aInRange,
    "abool",
    ()=>abool,
    "abytes",
    ()=>abytes,
    "bitGet",
    ()=>bitGet,
    "bitLen",
    ()=>bitLen,
    "bitMask",
    ()=>bitMask,
    "bitSet",
    ()=>bitSet,
    "bytesToHex",
    ()=>bytesToHex,
    "bytesToNumberBE",
    ()=>bytesToNumberBE,
    "bytesToNumberLE",
    ()=>bytesToNumberLE,
    "concatBytes",
    ()=>concatBytes,
    "createHmacDrbg",
    ()=>createHmacDrbg,
    "ensureBytes",
    ()=>ensureBytes,
    "equalBytes",
    ()=>equalBytes,
    "hexToBytes",
    ()=>hexToBytes,
    "hexToNumber",
    ()=>hexToNumber,
    "inRange",
    ()=>inRange,
    "isBytes",
    ()=>isBytes,
    "memoized",
    ()=>memoized,
    "notImplemented",
    ()=>notImplemented,
    "numberToBytesBE",
    ()=>numberToBytesBE,
    "numberToBytesLE",
    ()=>numberToBytesLE,
    "numberToHexUnpadded",
    ()=>numberToHexUnpadded,
    "numberToVarBytesBE",
    ()=>numberToVarBytesBE,
    "utf8ToBytes",
    ()=>utf8ToBytes,
    "validateObject",
    ()=>validateObject
]);
/**
 * Hex, bytes and number utilities.
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ // 100 lines of code in the file are duplicated from noble-hashes (utils).
// This is OK: `abstract` directory does not use noble-hashes.
// User may opt-in into using different hashing library. This way, noble-hashes
// won't be included into their bundle.
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array';
}
function abytes(item) {
    if (!isBytes(item)) throw new Error('Uint8Array expected');
}
function abool(title, value) {
    if (typeof value !== 'boolean') throw new Error(title + ' boolean expected, got ' + value);
}
function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? '0' + hex : hex;
}
function hexToNumber(hex) {
    if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
    return hex === '' ? _0n : BigInt('0x' + hex); // Big Endian
}
// Built-in hex conversion https://caniuse.com/mdn-javascript_builtins_uint8array_fromhex
const hasHexBuiltin = // @ts-ignore
typeof Uint8Array.from([]).toHex === 'function' && typeof Uint8Array.fromHex === 'function';
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */ Array.from({
    length: 256
}, (_, i)=>i.toString(16).padStart(2, '0'));
function bytesToHex(bytes) {
    abytes(bytes);
    // @ts-ignore
    if (hasHexBuiltin) return bytes.toHex();
    // pre-caching improves the speed 6x
    let hex = '';
    for(let i = 0; i < bytes.length; i++){
        hex += hexes[bytes[i]];
    }
    return hex;
}
// We use optimized technique to convert hex string to byte array
const asciis = {
    _0: 48,
    _9: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
};
function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0; // '2' => 50-48
    if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10); // 'B' => 66-(65-10)
    if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10); // 'b' => 98-(97-10)
    return;
}
function hexToBytes(hex) {
    if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
    // @ts-ignore
    if (hasHexBuiltin) return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2) throw new Error('hex string expected, got unpadded hex of length ' + hl);
    const array = new Uint8Array(al);
    for(let ai = 0, hi = 0; ai < al; ai++, hi += 2){
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === undefined || n2 === undefined) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2; // multiply first octet, e.g. 'a3' => 10*16+3 => 160 + 3 => 163
    }
    return array;
}
function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
    abytes(bytes);
    return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(n));
}
function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === 'string') {
        try {
            res = hexToBytes(hex);
        } catch (e) {
            throw new Error(title + ' must be hex string or Uint8Array, cause: ' + e);
        }
    } else if (isBytes(hex)) {
        // Uint8Array.from() instead of hash.slice() because node.js Buffer
        // is instance of Uint8Array, and its slice() creates **mutable** copy
        res = Uint8Array.from(hex);
    } else {
        throw new Error(title + ' must be hex string or Uint8Array');
    }
    const len = res.length;
    if (typeof expectedLength === 'number' && len !== expectedLength) throw new Error(title + ' of length ' + expectedLength + ' expected, got ' + len);
    return res;
}
function concatBytes(...arrays) {
    let sum = 0;
    for(let i = 0; i < arrays.length; i++){
        const a = arrays[i];
        abytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for(let i = 0, pad = 0; i < arrays.length; i++){
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
function equalBytes(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for(let i = 0; i < a.length; i++)diff |= a[i] ^ b[i];
    return diff === 0;
}
function utf8ToBytes(str) {
    if (typeof str !== 'string') throw new Error('string expected');
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
// Is positive bigint
const isPosBig = (n)=>typeof n === 'bigint' && _0n <= n;
function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
    // Why min <= n < max and not a (min < n < max) OR b (min <= n <= max)?
    // consider P=256n, min=0n, max=P
    // - a for min=0 would require -1:          `inRange('x', x, -1n, P)`
    // - b would commonly require subtraction:  `inRange('x', x, 0n, P - 1n)`
    // - our way is the cleanest:               `inRange('x', x, 0n, P)
    if (!inRange(n, min, max)) throw new Error('expected valid ' + title + ': ' + min + ' <= n < ' + max + ', got ' + n);
}
function bitLen(n) {
    let len;
    for(len = 0; n > _0n; n >>= _1n, len += 1);
    return len;
}
function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n;
}
function bitSet(n, pos, value) {
    return n | (value ? _1n : _0n) << BigInt(pos);
}
const bitMask = (n)=>(_1n << BigInt(n)) - _1n;
// DRBG
const u8n = (len)=>new Uint8Array(len); // creates Uint8Array
const u8fr = (arr)=>Uint8Array.from(arr); // another shortcut
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== 'number' || hashLen < 2) throw new Error('hashLen must be a number');
    if (typeof qByteLen !== 'number' || qByteLen < 2) throw new Error('qByteLen must be a number');
    if (typeof hmacFn !== 'function') throw new Error('hmacFn must be a function');
    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
    let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
    let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
    let i = 0; // Iterations counter, will throw when over 1000
    const reset = ()=>{
        v.fill(1);
        k.fill(0);
        i = 0;
    };
    const h = (...b)=>hmacFn(k, v, ...b); // hmac(k)(v, ...values)
    const reseed = (seed = u8n(0))=>{
        // HMAC-DRBG reseed() function. Steps D-G
        k = h(u8fr([
            0x00
        ]), seed); // k = hmac(k || v || 0x00 || seed)
        v = h(); // v = hmac(k || v)
        if (seed.length === 0) return;
        k = h(u8fr([
            0x01
        ]), seed); // k = hmac(k || v || 0x01 || seed)
        v = h(); // v = hmac(k || v)
    };
    const gen = ()=>{
        // HMAC-DRBG generate() function
        if (i++ >= 1000) throw new Error('drbg: tried 1000 values');
        let len = 0;
        const out = [];
        while(len < qByteLen){
            v = h();
            const sl = v.slice();
            out.push(sl);
            len += v.length;
        }
        return concatBytes(...out);
    };
    const genUntil = (seed, pred)=>{
        reset();
        reseed(seed); // Steps D-G
        let res = undefined; // Step H: grind until k is in [1..n-1]
        while(!(res = pred(gen())))reseed();
        reset();
        return res;
    };
    return genUntil;
}
// Validating curves and fields
const validatorFns = {
    bigint: (val)=>typeof val === 'bigint',
    function: (val)=>typeof val === 'function',
    boolean: (val)=>typeof val === 'boolean',
    string: (val)=>typeof val === 'string',
    stringOrUint8Array: (val)=>typeof val === 'string' || isBytes(val),
    isSafeInteger: (val)=>Number.isSafeInteger(val),
    array: (val)=>Array.isArray(val),
    field: (val, object)=>object.Fp.isValid(val),
    hash: (val)=>typeof val === 'function' && Number.isSafeInteger(val.outputLen)
};
function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional)=>{
        const checkVal = validatorFns[type];
        if (typeof checkVal !== 'function') throw new Error('invalid validator function');
        const val = object[fieldName];
        if (isOptional && val === undefined) return;
        if (!checkVal(val, object)) {
            throw new Error('param ' + String(fieldName) + ' is invalid. Expected ' + type + ', got ' + val);
        }
    };
    for (const [fieldName, type] of Object.entries(validators))checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))checkField(fieldName, type, true);
    return object;
}
const notImplemented = ()=>{
    throw new Error('not implemented');
};
function memoized(fn) {
    const map = new WeakMap();
    return (arg, ...args)=>{
        const val = map.get(arg);
        if (val !== undefined) return val;
        const computed = fn(arg, ...args);
        map.set(arg, computed);
        return computed;
    };
} //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Field",
    ()=>Field,
    "FpDiv",
    ()=>FpDiv,
    "FpInvertBatch",
    ()=>FpInvertBatch,
    "FpIsSquare",
    ()=>FpIsSquare,
    "FpLegendre",
    ()=>FpLegendre,
    "FpPow",
    ()=>FpPow,
    "FpSqrt",
    ()=>FpSqrt,
    "FpSqrtEven",
    ()=>FpSqrtEven,
    "FpSqrtOdd",
    ()=>FpSqrtOdd,
    "getFieldBytesLength",
    ()=>getFieldBytesLength,
    "getMinHashLength",
    ()=>getMinHashLength,
    "hashToPrivateScalar",
    ()=>hashToPrivateScalar,
    "invert",
    ()=>invert,
    "isNegativeLE",
    ()=>isNegativeLE,
    "mapHashToField",
    ()=>mapHashToField,
    "mod",
    ()=>mod,
    "nLength",
    ()=>nLength,
    "pow",
    ()=>pow,
    "pow2",
    ()=>pow2,
    "tonelliShanks",
    ()=>tonelliShanks,
    "validateField",
    ()=>validateField
]);
/**
 * Utils for modular division and finite fields.
 * A finite field over 11 is integer number operations `mod 11`.
 * There is no division: it is replaced by modular multiplicative inverse.
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = /* @__PURE__ */ BigInt(2), _3n = /* @__PURE__ */ BigInt(3);
// prettier-ignore
const _4n = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5), _8n = /* @__PURE__ */ BigInt(8);
// prettier-ignore
const _9n = /* @__PURE__ */ BigInt(9), _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
    const result = a % b;
    return result >= _0n ? result : b + result;
}
function pow(num, power, modulo) {
    if (power < _0n) throw new Error('invalid exponent, negatives unsupported');
    if (modulo <= _0n) throw new Error('invalid modulus');
    if (modulo === _1n) return _0n;
    let res = _1n;
    while(power > _0n){
        if (power & _1n) res = res * num % modulo;
        num = num * num % modulo;
        power >>= _1n;
    }
    return res;
}
function pow2(x, power, modulo) {
    let res = x;
    while(power-- > _0n){
        res *= res;
        res %= modulo;
    }
    return res;
}
function invert(number, modulo) {
    if (number === _0n) throw new Error('invert: expected non-zero number');
    if (modulo <= _0n) throw new Error('invert: expected positive modulus, got ' + modulo);
    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
    let a = mod(number, modulo);
    let b = modulo;
    // prettier-ignore
    let x = _0n, y = _1n, u = _1n, v = _0n;
    while(a !== _0n){
        // JIT applies optimization if those two lines follow each other
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        // prettier-ignore
        b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n) throw new Error('invert: does not exist');
    return mod(x, modulo);
}
function tonelliShanks(P) {
    // Do expensive precomputation step
    // Step 1: By factoring out powers of 2 from p - 1,
    // find q and s such that p-1 == q*(2^s) with q odd
    let Q = P - _1n;
    let S = 0;
    while(Q % _2n === _0n){
        Q /= _2n;
        S++;
    }
    // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
    let Z = _2n;
    const _Fp = Field(P);
    while(Z < P && FpIsSquare(_Fp, Z)){
        if (Z++ > 1000) throw new Error('Cannot find square root: probably non-prime P');
    }
    // Fast-path
    if (S === 1) {
        const p1div4 = (P + _1n) / _4n;
        return function tonelliFast(Fp, n) {
            const root = Fp.pow(n, p1div4);
            if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
            return root;
        };
    }
    // Slow-path
    const Q1div2 = (Q + _1n) / _2n;
    return function tonelliSlow(Fp, n) {
        // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
        if (!FpIsSquare(Fp, n)) throw new Error('Cannot find square root');
        let r = S;
        // TODO: test on Fp2 and others
        let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
        let x = Fp.pow(n, Q1div2); // first guess at the square root
        let b = Fp.pow(n, Q); // first guess at the fudge factor
        while(!Fp.eql(b, Fp.ONE)){
            // (4. If t = 0, return r = 0)
            // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm
            if (Fp.eql(b, Fp.ZERO)) return Fp.ZERO;
            // Find m such b^(2^m)==1
            let m = 1;
            for(let t2 = Fp.sqr(b); m < r; m++){
                if (Fp.eql(t2, Fp.ONE)) break;
                t2 = Fp.sqr(t2); // t2 *= t2
            }
            // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift,
            // otherwise there will be overflow.
            const ge = Fp.pow(g, _1n << BigInt(r - m - 1)); // ge = 2^(r-m-1)
            g = Fp.sqr(ge); // g = ge * ge
            x = Fp.mul(x, ge); // x *= ge
            b = Fp.mul(b, g); // b *= g
            r = m;
        }
        return x;
    };
}
function FpSqrt(P) {
    // P ≡ 3 (mod 4)
    // √n = n^((P+1)/4)
    if (P % _4n === _3n) {
        // Not all roots possible!
        // const ORDER =
        //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
        // const NUM = 72057594037927816n;
        return function sqrt3mod4(Fp, n) {
            const p1div4 = (P + _1n) / _4n;
            const root = Fp.pow(n, p1div4);
            // Throw if root**2 != n
            if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
            return root;
        };
    }
    // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
    if (P % _8n === _5n) {
        return function sqrt5mod8(Fp, n) {
            const n2 = Fp.mul(n, _2n);
            const c1 = (P - _5n) / _8n;
            const v = Fp.pow(n2, c1);
            const nv = Fp.mul(n, v);
            const i = Fp.mul(Fp.mul(nv, _2n), v);
            const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
            if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
            return root;
        };
    }
    // P ≡ 9 (mod 16)
    if (P % _16n === _9n) {
    // NOTE: tonelli is too slow for bls-Fp2 calculations even on start
    // Means we cannot use sqrt for constants at all!
    //
    // const c1 = Fp.sqrt(Fp.negate(Fp.ONE)); //  1. c1 = sqrt(-1) in F, i.e., (c1^2) == -1 in F
    // const c2 = Fp.sqrt(c1);                //  2. c2 = sqrt(c1) in F, i.e., (c2^2) == c1 in F
    // const c3 = Fp.sqrt(Fp.negate(c1));     //  3. c3 = sqrt(-c1) in F, i.e., (c3^2) == -c1 in F
    // const c4 = (P + _7n) / _16n;           //  4. c4 = (q + 7) / 16        # Integer arithmetic
    // sqrt = (x) => {
    //   let tv1 = Fp.pow(x, c4);             //  1. tv1 = x^c4
    //   let tv2 = Fp.mul(c1, tv1);           //  2. tv2 = c1 * tv1
    //   const tv3 = Fp.mul(c2, tv1);         //  3. tv3 = c2 * tv1
    //   let tv4 = Fp.mul(c3, tv1);           //  4. tv4 = c3 * tv1
    //   const e1 = Fp.equals(Fp.square(tv2), x); //  5.  e1 = (tv2^2) == x
    //   const e2 = Fp.equals(Fp.square(tv3), x); //  6.  e2 = (tv3^2) == x
    //   tv1 = Fp.cmov(tv1, tv2, e1); //  7. tv1 = CMOV(tv1, tv2, e1)  # Select tv2 if (tv2^2) == x
    //   tv2 = Fp.cmov(tv4, tv3, e2); //  8. tv2 = CMOV(tv4, tv3, e2)  # Select tv3 if (tv3^2) == x
    //   const e3 = Fp.equals(Fp.square(tv2), x); //  9.  e3 = (tv2^2) == x
    //   return Fp.cmov(tv1, tv2, e3); //  10.  z = CMOV(tv1, tv2, e3)  # Select the sqrt from tv1 and tv2
    // }
    }
    // Other cases: Tonelli-Shanks algorithm
    return tonelliShanks(P);
}
const isNegativeLE = (num, modulo)=>(mod(num, modulo) & _1n) === _1n;
// prettier-ignore
const FIELD_FIELDS = [
    'create',
    'isValid',
    'is0',
    'neg',
    'inv',
    'sqrt',
    'sqr',
    'eql',
    'add',
    'sub',
    'mul',
    'pow',
    'div',
    'addN',
    'subN',
    'mulN',
    'sqrN'
];
function validateField(field) {
    const initial = {
        ORDER: 'bigint',
        MASK: 'bigint',
        BYTES: 'isSafeInteger',
        BITS: 'isSafeInteger'
    };
    const opts = FIELD_FIELDS.reduce((map, val)=>{
        map[val] = 'function';
        return map;
    }, initial);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(field, opts);
}
function FpPow(Fp, num, power) {
    if (power < _0n) throw new Error('invalid exponent, negatives unsupported');
    if (power === _0n) return Fp.ONE;
    if (power === _1n) return num;
    // @ts-ignore
    let p = Fp.ONE;
    let d = num;
    while(power > _0n){
        if (power & _1n) p = Fp.mul(p, d);
        d = Fp.sqr(d);
        power >>= _1n;
    }
    return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : undefined);
    // Walk from first to last, multiply them by each other MOD p
    const multipliedAcc = nums.reduce((acc, num, i)=>{
        if (Fp.is0(num)) return acc;
        inverted[i] = acc;
        return Fp.mul(acc, num);
    }, Fp.ONE);
    // Invert last element
    const invertedAcc = Fp.inv(multipliedAcc);
    // Walk from last to first, multiply them by inverted each other MOD p
    nums.reduceRight((acc, num, i)=>{
        if (Fp.is0(num)) return acc;
        inverted[i] = Fp.mul(acc, inverted[i]);
        return Fp.mul(acc, num);
    }, invertedAcc);
    return inverted;
}
function FpDiv(Fp, lhs, rhs) {
    return Fp.mul(lhs, typeof rhs === 'bigint' ? invert(rhs, Fp.ORDER) : Fp.inv(rhs));
}
function FpLegendre(Fp, n) {
    const legc = (Fp.ORDER - _1n) / _2n;
    const powered = Fp.pow(n, legc);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no) throw new Error('Cannot find square root: probably non-prime P');
    return yes ? 1 : zero ? 0 : -1;
}
function FpIsSquare(Fp, n) {
    const l = FpLegendre(Fp, n);
    return l === 0 || l === 1;
}
function nLength(n, nBitLength) {
    // Bit size, byte size of CURVE.n
    if (nBitLength !== undefined) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anumber"])(nBitLength);
    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return {
        nBitLength: _nBitLength,
        nByteLength
    };
}
function Field(ORDER, bitLen, isLE = false, redef = {}) {
    if (ORDER <= _0n) throw new Error('invalid field: expected ORDER > 0, got ' + ORDER);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
    if (BYTES > 2048) throw new Error('invalid field: expected ORDER of <= 2048 bytes');
    let sqrtP; // cached sqrtP
    const f = Object.freeze({
        ORDER,
        isLE,
        BITS,
        BYTES,
        MASK: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bitMask"])(BITS),
        ZERO: _0n,
        ONE: _1n,
        create: (num)=>mod(num, ORDER),
        isValid: (num)=>{
            if (typeof num !== 'bigint') throw new Error('invalid field element: expected bigint, got ' + typeof num);
            return _0n <= num && num < ORDER; // 0 is valid element, but it's not invertible
        },
        is0: (num)=>num === _0n,
        isOdd: (num)=>(num & _1n) === _1n,
        neg: (num)=>mod(-num, ORDER),
        eql: (lhs, rhs)=>lhs === rhs,
        sqr: (num)=>mod(num * num, ORDER),
        add: (lhs, rhs)=>mod(lhs + rhs, ORDER),
        sub: (lhs, rhs)=>mod(lhs - rhs, ORDER),
        mul: (lhs, rhs)=>mod(lhs * rhs, ORDER),
        pow: (num, power)=>FpPow(f, num, power),
        div: (lhs, rhs)=>mod(lhs * invert(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num)=>num * num,
        addN: (lhs, rhs)=>lhs + rhs,
        subN: (lhs, rhs)=>lhs - rhs,
        mulN: (lhs, rhs)=>lhs * rhs,
        inv: (num)=>invert(num, ORDER),
        sqrt: redef.sqrt || ((n)=>{
            if (!sqrtP) sqrtP = FpSqrt(ORDER);
            return sqrtP(f, n);
        }),
        toBytes: (num)=>isLE ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(num, BYTES) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesBE"])(num, BYTES),
        fromBytes: (bytes)=>{
            if (bytes.length !== BYTES) throw new Error('Field.fromBytes: expected ' + BYTES + ' bytes, got ' + bytes.length);
            return isLE ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(bytes) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(bytes);
        },
        // TODO: we don't need it here, move out to separate fn
        invertBatch: (lst)=>FpInvertBatch(f, lst),
        // We can't move this out because Fp6, Fp12 implement it
        // and it's unclear what to return in there.
        cmov: (a, b, c)=>c ? b : a
    });
    return Object.freeze(f);
}
function FpSqrtOdd(Fp, elm) {
    if (!Fp.isOdd) throw new Error("Field doesn't have isOdd");
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? root : Fp.neg(root);
}
function FpSqrtEven(Fp, elm) {
    if (!Fp.isOdd) throw new Error("Field doesn't have isOdd");
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? Fp.neg(root) : root;
}
function hashToPrivateScalar(hash, groupOrder, isLE = false) {
    hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('privateHash', hash);
    const hashLen = hash.length;
    const minLen = nLength(groupOrder).nByteLength + 8;
    if (minLen < 24 || hashLen < minLen || hashLen > 1024) throw new Error('hashToPrivateScalar: expected ' + minLen + '-1024 bytes of input, got ' + hashLen);
    const num = isLE ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(hash) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(hash);
    return mod(num, groupOrder - _1n) + _1n;
}
function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== 'bigint') throw new Error('field order must be bigint');
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
    if (len < 16 || len < minLen || len > 1024) throw new Error('expected ' + minLen + '-1024 bytes of input, got ' + len);
    const num = isLE ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(key) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(key);
    // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
    const reduced = mod(num, fieldOrder - _1n) + _1n;
    return isLE ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(reduced, fieldLen) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesBE"])(reduced, fieldLen);
} //# sourceMappingURL=modular.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/curve.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pippenger",
    ()=>pippenger,
    "precomputeMSMUnsafe",
    ()=>precomputeMSMUnsafe,
    "validateBasic",
    ()=>validateBasic,
    "wNAF",
    ()=>wNAF
]);
/**
 * Methods for elliptic curve multiplication by scalars.
 * Contains wNAF, pippenger
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
const _0n = BigInt(0);
const _1n = BigInt(1);
function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
}
function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error('invalid window size, expected [1..' + bits + '], got W=' + W);
}
function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1; // W=8 33. Not 32, because we skip zero
    const windowSize = 2 ** (W - 1); // W=8 128. Not 256, because we skip zero
    const maxNumber = 2 ** W; // W=8 256
    const mask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bitMask"])(W); // W=8 255 == mask 0b11111111
    const shiftBy = BigInt(W); // W=8 8
    return {
        windows,
        windowSize,
        mask,
        maxNumber,
        shiftBy
    };
}
function calcOffsets(n, window, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask); // extract W bits.
    let nextN = n >> shiftBy; // shift number by W bits.
    // What actually happens here:
    // const highestBit = Number(mask ^ (mask >> 1n));
    // let wbits2 = wbits - 1; // skip zero
    // if (wbits2 & highestBit) { wbits2 ^= Number(mask); // (~);
    // split if bits > max: +224 => 256-32
    if (wbits > windowSize) {
        // we skip zero, which means instead of `>= size-1`, we do `> size`
        wbits -= maxNumber; // -32, can be maxNumber - wbits, but then we need to set isNeg here.
        nextN += _1n; // +256 (carry)
    }
    const offsetStart = window * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1; // -1 because we skip zero
    const isZero = wbits === 0; // is current window slice a 0?
    const isNeg = wbits < 0; // is current window slice negative?
    const isNegF = window % 2 !== 0; // fake random statement for noise
    const offsetF = offsetStart; // fake offset for noise
    return {
        nextN,
        offset,
        isZero,
        isNeg,
        isNegF,
        offsetF
    };
}
function validateMSMPoints(points, c) {
    if (!Array.isArray(points)) throw new Error('array expected');
    points.forEach((p, i)=>{
        if (!(p instanceof c)) throw new Error('invalid point at index ' + i);
    });
}
function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars)) throw new Error('array of scalars expected');
    scalars.forEach((s, i)=>{
        if (!field.isValid(s)) throw new Error('invalid scalar at index ' + i);
    });
}
// Since points in different groups cannot be equal (different object constructor),
// we can have single place to store precomputes.
// Allows to make points frozen / immutable.
const pointPrecomputes = new WeakMap();
const pointWindowSizes = new WeakMap();
function getW(P) {
    return pointWindowSizes.get(P) || 1;
}
function wNAF(c, bits) {
    return {
        constTimeNegate,
        hasPrecomputes (elm) {
            return getW(elm) !== 1;
        },
        // non-const time multiplication ladder
        unsafeLadder (elm, n, p = c.ZERO) {
            let d = elm;
            while(n > _0n){
                if (n & _1n) p = p.add(d);
                d = d.double();
                n >>= _1n;
            }
            return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @param elm Point instance
         * @param W window size
         * @returns precomputed point tables flattened to a single array
         */ precomputeWindow (elm, W) {
            const { windows, windowSize } = calcWOpts(W, bits);
            const points = [];
            let p = elm;
            let base = p;
            for(let window = 0; window < windows; window++){
                base = p;
                points.push(base);
                // i=1, bc we skip 0
                for(let i = 1; i < windowSize; i++){
                    base = base.add(p);
                    points.push(base);
                }
                p = base.double();
            }
            return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */ wNAF (W, precomputes, n) {
            // Smaller version:
            // https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
            // TODO: check the scalar is less than group order?
            // wNAF behavior is undefined otherwise. But have to carefully remove
            // other checks before wNAF. ORDER == bits here.
            // Accumulators
            let p = c.ZERO;
            let f = c.BASE;
            // This code was first written with assumption that 'f' and 'p' will never be infinity point:
            // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
            // there is negate now: it is possible that negated element from low value
            // would be the same as high element, which will create carry into next window.
            // It's not obvious how this can fail, but still worth investigating later.
            const wo = calcWOpts(W, bits);
            for(let window = 0; window < wo.windows; window++){
                // (n === _0n) is handled and not early-exited. isEven and offsetF are used for noise
                const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
                n = nextN;
                if (isZero) {
                    // bits are 0: add garbage to fake point
                    // Important part for const-time getPublicKey: add random "noise" point to f.
                    f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
                } else {
                    // bits are 1: add to result point
                    p = p.add(constTimeNegate(isNeg, precomputes[offset]));
                }
            }
            // Return both real and fake points: JIT won't eliminate f.
            // At this point there is a way to F be infinity-point even if p is not,
            // which makes it less const-time: around 1 bigint multiply.
            return {
                p,
                f
            };
        },
        /**
         * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @param acc accumulator point to add result of multiplication
         * @returns point
         */ wNAFUnsafe (W, precomputes, n, acc = c.ZERO) {
            const wo = calcWOpts(W, bits);
            for(let window = 0; window < wo.windows; window++){
                if (n === _0n) break; // Early-exit, skip 0 value
                const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
                n = nextN;
                if (isZero) {
                    continue;
                } else {
                    const item = precomputes[offset];
                    acc = acc.add(isNeg ? item.negate() : item); // Re-using acc allows to save adds in MSM
                }
            }
            return acc;
        },
        getPrecomputes (W, P, transform) {
            // Calculate precomputes on a first run, reuse them after
            let comp = pointPrecomputes.get(P);
            if (!comp) {
                comp = this.precomputeWindow(P, W);
                if (W !== 1) pointPrecomputes.set(P, transform(comp));
            }
            return comp;
        },
        wNAFCached (P, n, transform) {
            const W = getW(P);
            return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
        },
        wNAFCachedUnsafe (P, n, transform, prev) {
            const W = getW(P);
            if (W === 1) return this.unsafeLadder(P, n, prev); // For W=1 ladder is ~x2 faster
            return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
        },
        // We calculate precomputes for elliptic curve point multiplication
        // using windowed method. This specifies window size and
        // stores precomputed values. Usually only base point would be precomputed.
        setWindowSize (P, W) {
            validateW(W, bits);
            pointWindowSizes.set(P, W);
            pointPrecomputes.delete(P);
        }
    };
}
function pippenger(c, fieldN, points, scalars) {
    // If we split scalars by some window (let's say 8 bits), every chunk will only
    // take 256 buckets even if there are 4096 scalars, also re-uses double.
    // TODO:
    // - https://eprint.iacr.org/2024/750.pdf
    // - https://tches.iacr.org/index.php/TCHES/article/view/10287
    // 0 is accepted in scalars
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    if (points.length !== scalars.length) throw new Error('arrays of points and scalars must have equal length');
    const zero = c.ZERO;
    const wbits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bitLen"])(BigInt(points.length));
    const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1; // in bits
    const MASK = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bitMask"])(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero); // +1 for zero array
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for(let i = lastBits; i >= 0; i -= windowSize){
        buckets.fill(zero);
        for(let j = 0; j < scalars.length; j++){
            const scalar = scalars[j];
            const wbits = Number(scalar >> BigInt(i) & MASK);
            buckets[wbits] = buckets[wbits].add(points[j]);
        }
        let resI = zero; // not using this will do small speed-up, but will lose ct
        // Skip first bucket, because it is zero
        for(let j = buckets.length - 1, sumI = zero; j > 0; j--){
            sumI = sumI.add(buckets[j]);
            resI = resI.add(sumI);
        }
        sum = sum.add(resI);
        if (i !== 0) for(let j = 0; j < windowSize; j++)sum = sum.double();
    }
    return sum;
}
function precomputeMSMUnsafe(c, fieldN, points, windowSize) {
    /**
     * Performance Analysis of Window-based Precomputation
     *
     * Base Case (256-bit scalar, 8-bit window):
     * - Standard precomputation requires:
     *   - 31 additions per scalar × 256 scalars = 7,936 ops
     *   - Plus 255 summary additions = 8,191 total ops
     *   Note: Summary additions can be optimized via accumulator
     *
     * Chunked Precomputation Analysis:
     * - Using 32 chunks requires:
     *   - 255 additions per chunk
     *   - 256 doublings
     *   - Total: (255 × 32) + 256 = 8,416 ops
     *
     * Memory Usage Comparison:
     * Window Size | Standard Points | Chunked Points
     * ------------|-----------------|---------------
     *     4-bit   |     520         |      15
     *     8-bit   |    4,224        |     255
     *    10-bit   |   13,824        |   1,023
     *    16-bit   |  557,056        |  65,535
     *
     * Key Advantages:
     * 1. Enables larger window sizes due to reduced memory overhead
     * 2. More efficient for smaller scalar counts:
     *    - 16 chunks: (16 × 255) + 256 = 4,336 ops
     *    - ~2x faster than standard 8,191 ops
     *
     * Limitations:
     * - Not suitable for plain precomputes (requires 256 constant doublings)
     * - Performance degrades with larger scalar counts:
     *   - Optimal for ~256 scalars
     *   - Less efficient for 4096+ scalars (Pippenger preferred)
     */ validateW(windowSize, fieldN.BITS);
    validateMSMPoints(points, c);
    const zero = c.ZERO;
    const tableSize = 2 ** windowSize - 1; // table size (without zero)
    const chunks = Math.ceil(fieldN.BITS / windowSize); // chunks of item
    const MASK = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bitMask"])(windowSize);
    const tables = points.map((p)=>{
        const res = [];
        for(let i = 0, acc = p; i < tableSize; i++){
            res.push(acc);
            acc = acc.add(p);
        }
        return res;
    });
    return (scalars)=>{
        validateMSMScalars(scalars, fieldN);
        if (scalars.length > points.length) throw new Error('array of scalars must be smaller than array of points');
        let res = zero;
        for(let i = 0; i < chunks; i++){
            // No need to double if accumulator is still zero.
            if (res !== zero) for(let j = 0; j < windowSize; j++)res = res.double();
            const shiftBy = BigInt(chunks * windowSize - (i + 1) * windowSize);
            for(let j = 0; j < scalars.length; j++){
                const n = scalars[j];
                const curr = Number(n >> shiftBy & MASK);
                if (!curr) continue; // skip zero scalars chunks
                res = res.add(tables[j][curr - 1]);
            }
        }
        return res;
    };
}
function validateBasic(curve) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateField"])(curve.Fp);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(curve, {
        n: 'bigint',
        h: 'bigint',
        Gx: 'field',
        Gy: 'field'
    }, {
        nBitLength: 'isSafeInteger',
        nByteLength: 'isSafeInteger'
    });
    // Set defaults
    return Object.freeze({
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nLength"])(curve.n, curve.nBitLength),
        ...curve,
        ...{
            p: curve.Fp.ORDER
        }
    });
} //# sourceMappingURL=curve.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/weierstrass.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DER",
    ()=>DER,
    "DERErr",
    ()=>DERErr,
    "SWUFpSqrtRatio",
    ()=>SWUFpSqrtRatio,
    "mapToCurveSimpleSWU",
    ()=>mapToCurveSimpleSWU,
    "weierstrass",
    ()=>weierstrass,
    "weierstrassPoints",
    ()=>weierstrassPoints
]);
/**
 * Short Weierstrass curve methods. The formula is: y² = x³ + ax + b.
 *
 * ### Parameters
 *
 * To initialize a weierstrass curve, one needs to pass following params:
 *
 * * a: formula param
 * * b: formula param
 * * Fp: finite Field over which we'll do calculations. Can be complex (Fp2, Fp12)
 * * n: Curve prime subgroup order, total count of valid points in the field
 * * Gx: Base point (x, y) aka generator point x coordinate
 * * Gy: ...y coordinate
 * * h: cofactor, usually 1. h*n = curve group order (n is only subgroup order)
 * * lowS: whether to enable (default) or disable "low-s" non-malleable signatures
 *
 * ### Design rationale for types
 *
 * * Interaction between classes from different curves should fail:
 *   `k256.Point.BASE.add(p256.Point.BASE)`
 * * For this purpose we want to use `instanceof` operator, which is fast and works during runtime
 * * Different calls of `curve()` would return different classes -
 *   `curve(params) !== curve(params)`: if somebody decided to monkey-patch their curve,
 *   it won't affect others
 *
 * TypeScript can't infer types for classes created inside a function. Classes is one instance
 * of nominative types in TypeScript and interfaces only check for shape, so it's hard to create
 * unique type for every function call.
 *
 * We can use generic types via some param, like curve opts, but that would:
 *     1. Enable interaction between `curve(params)` and `curve(params)` (curves of same params)
 *     which is hard to debug.
 *     2. Params can be generic and we can't enforce them to be constant value:
 *     if somebody creates curve from non-constant params,
 *     it would be allowed to interact with other curves with non-constant params
 *
 * @todo https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ // prettier-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/curve.js [app-client] (ecmascript)");
// prettier-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
// prettier-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
;
function validateSigVerOpts(opts) {
    if (opts.lowS !== undefined) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('lowS', opts.lowS);
    if (opts.prehash !== undefined) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('prehash', opts.prehash);
}
function validatePointOpts(curve) {
    const opts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBasic"])(curve);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(opts, {
        a: 'field',
        b: 'field'
    }, {
        allowedPrivateKeyLengths: 'array',
        wrapPrivateKey: 'boolean',
        isTorsionFree: 'function',
        clearCofactor: 'function',
        allowInfinityPoint: 'boolean',
        fromBytes: 'function',
        toBytes: 'function'
    });
    const { endo, Fp, a } = opts;
    if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
            throw new Error('invalid endomorphism, can only be defined for Koblitz curves that have a=0');
        }
        if (typeof endo !== 'object' || typeof endo.beta !== 'bigint' || typeof endo.splitScalar !== 'function') {
            throw new Error('invalid endomorphism, expected beta: bigint and splitScalar: function');
        }
    }
    return Object.freeze({
        ...opts
    });
}
class DERErr extends Error {
    constructor(m = ''){
        super(m);
    }
}
const DER = {
    // asn.1 DER encoding utils
    Err: DERErr,
    // Basic building block is TLV (Tag-Length-Value)
    _tlv: {
        encode: (tag, data)=>{
            const { Err: E } = DER;
            if (tag < 0 || tag > 256) throw new E('tlv.encode: wrong tag');
            if (data.length & 1) throw new E('tlv.encode: unpadded data');
            const dataLen = data.length / 2;
            const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToHexUnpadded"])(dataLen);
            if (len.length / 2 & 128) throw new E('tlv.encode: long form length too big');
            // length of length with long form flag
            const lenLen = dataLen > 127 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToHexUnpadded"])(len.length / 2 | 128) : '';
            const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToHexUnpadded"])(tag);
            return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode (tag, data) {
            const { Err: E } = DER;
            let pos = 0;
            if (tag < 0 || tag > 256) throw new E('tlv.encode: wrong tag');
            if (data.length < 2 || data[pos++] !== tag) throw new E('tlv.decode: wrong tlv');
            const first = data[pos++];
            const isLong = !!(first & 128); // First bit of first length byte is flag for short/long form
            let length = 0;
            if (!isLong) length = first;
            else {
                // Long form: [longFlag(1bit), lengthLength(7bit), length (BE)]
                const lenLen = first & 127;
                if (!lenLen) throw new E('tlv.decode(long): indefinite length not supported');
                if (lenLen > 4) throw new E('tlv.decode(long): byte length is too big'); // this will overflow u32 in js
                const lengthBytes = data.subarray(pos, pos + lenLen);
                if (lengthBytes.length !== lenLen) throw new E('tlv.decode: length bytes not complete');
                if (lengthBytes[0] === 0) throw new E('tlv.decode(long): zero leftmost byte');
                for (const b of lengthBytes)length = length << 8 | b;
                pos += lenLen;
                if (length < 128) throw new E('tlv.decode(long): not minimal encoding');
            }
            const v = data.subarray(pos, pos + length);
            if (v.length !== length) throw new E('tlv.decode: wrong value length');
            return {
                v,
                l: data.subarray(pos + length)
            };
        }
    },
    // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
    // since we always use positive integers here. It must always be empty:
    // - add zero byte if exists
    // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
    _int: {
        encode (num) {
            const { Err: E } = DER;
            if (num < _0n) throw new E('integer: negative integers are not allowed');
            let hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToHexUnpadded"])(num);
            // Pad with zero byte if negative flag is present
            if (Number.parseInt(hex[0], 16) & 0b1000) hex = '00' + hex;
            if (hex.length & 1) throw new E('unexpected DER parsing assertion: unpadded hex');
            return hex;
        },
        decode (data) {
            const { Err: E } = DER;
            if (data[0] & 128) throw new E('invalid signature integer: negative');
            if (data[0] === 0x00 && !(data[1] & 128)) throw new E('invalid signature integer: unnecessary leading zero');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(data);
        }
    },
    toSig (hex) {
        // parse DER signature
        const { Err: E, _int: int, _tlv: tlv } = DER;
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('signature', hex);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(0x30, data);
        if (seqLeftBytes.length) throw new E('invalid signature: left bytes after parsing');
        const { v: rBytes, l: rLeftBytes } = tlv.decode(0x02, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(0x02, rLeftBytes);
        if (sLeftBytes.length) throw new E('invalid signature: left bytes after parsing');
        return {
            r: int.decode(rBytes),
            s: int.decode(sBytes)
        };
    },
    hexFromSig (sig) {
        const { _tlv: tlv, _int: int } = DER;
        const rs = tlv.encode(0x02, int.encode(sig.r));
        const ss = tlv.encode(0x02, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(0x30, seq);
    }
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
function weierstrassPoints(opts) {
    const CURVE = validatePointOpts(opts);
    const { Fp } = CURVE; // All curves has same field / group length as for now, but they can differ
    const Fn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(CURVE.n, CURVE.nBitLength);
    const toBytes = CURVE.toBytes || ((_c, point, _isCompressed)=>{
        const a = point.toAffine();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(Uint8Array.from([
            0x04
        ]), Fp.toBytes(a.x), Fp.toBytes(a.y));
    });
    const fromBytes = CURVE.fromBytes || ((bytes)=>{
        // const head = bytes[0];
        const tail = bytes.subarray(1);
        // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return {
            x,
            y
        };
    });
    /**
     * y² = x³ + ax + b: Short weierstrass curve formula. Takes x, returns y².
     * @returns y²
     */ function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x); // x * x
        const x3 = Fp.mul(x2, x); // x2 * x
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
    }
    // Validate whether the passed curve params are valid.
    // We check if curve equation works for generator point.
    // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
    // ProjectivePoint class has not been initialized yet.
    if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx))) throw new Error('bad generator point: equation left != right');
    // Valid group elements reside in range 1..n-1
    function isWithinCurveOrder(num) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inRange"])(num, _1n, CURVE.n);
    }
    // Validates if priv key is valid and converts it to bigint.
    // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
    function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
        if (lengths && typeof key !== 'bigint') {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBytes"])(key)) key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToHex"])(key);
            // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
            if (typeof key !== 'string' || !lengths.includes(key.length)) throw new Error('invalid private key');
            key = key.padStart(nByteLength * 2, '0');
        }
        let num;
        try {
            num = typeof key === 'bigint' ? key : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('private key', key, nByteLength));
        } catch (error) {
            throw new Error('invalid private key, expected hex or ' + nByteLength + ' bytes, got ' + typeof key);
        }
        if (wrapPrivateKey) num = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(num, N); // disabled by default, enabled for BLS
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('private key', num, _1n, N); // num in range [1..N-1]
        return num;
    }
    function aprjpoint(other) {
        if (!(other instanceof Point)) throw new Error('ProjectivePoint expected');
    }
    // Memoized toAffine / validity check. They are heavy. Points are immutable.
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    const toAffineMemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoized"])((p, iz)=>{
        const { px: x, py: y, pz: z } = p;
        // Fast-path for normalized points
        if (Fp.eql(z, Fp.ONE)) return {
            x,
            y
        };
        const is0 = p.is0();
        // If invZ was 0, we return zero point. However we still want to execute
        // all operations, so we replace invZ with a random number, 1.
        if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(z);
        const ax = Fp.mul(x, iz);
        const ay = Fp.mul(y, iz);
        const zz = Fp.mul(z, iz);
        if (is0) return {
            x: Fp.ZERO,
            y: Fp.ZERO
        };
        if (!Fp.eql(zz, Fp.ONE)) throw new Error('invZ was invalid');
        return {
            x: ax,
            y: ay
        };
    });
    // NOTE: on exception this will crash 'cached' and no value will be set.
    // Otherwise true will be return
    const assertValidMemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoized"])((p)=>{
        if (p.is0()) {
            // (0, 1, 0) aka ZERO is invalid in most contexts.
            // In BLS, ZERO can be serialized, so we allow it.
            // (0, 0, 0) is invalid representation of ZERO.
            if (CURVE.allowInfinityPoint && !Fp.is0(p.py)) return;
            throw new Error('bad point: ZERO');
        }
        // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
        const { x, y } = p.toAffine();
        // Check if x, y are valid field elements
        if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error('bad point: x or y not FE');
        const left = Fp.sqr(y); // y²
        const right = weierstrassEquation(x); // x³ + ax + b
        if (!Fp.eql(left, right)) throw new Error('bad point: equation left != right');
        if (!p.isTorsionFree()) throw new Error('bad point: not in prime-order subgroup');
        return true;
    });
    /**
     * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
     * Default Point works in 2d / affine coordinates: (x, y)
     * We're doing calculations in projective, because its operations don't require costly inversion.
     */ class Point {
        constructor(px, py, pz){
            if (px == null || !Fp.isValid(px)) throw new Error('x required');
            if (py == null || !Fp.isValid(py) || Fp.is0(py)) throw new Error('y required');
            if (pz == null || !Fp.isValid(pz)) throw new Error('z required');
            this.px = px;
            this.py = py;
            this.pz = pz;
            Object.freeze(this);
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
            const { x, y } = p || {};
            if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error('invalid affine point');
            if (p instanceof Point) throw new Error('projective point not allowed');
            const is0 = (i)=>Fp.eql(i, Fp.ZERO);
            // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
            if (is0(x) && is0(y)) return Point.ZERO;
            return new Point(x, y, Fp.ONE);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */ static normalizeZ(points) {
            const toInv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FpInvertBatch"])(Fp, points.map((p)=>p.pz));
            return points.map((p, i)=>p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */ static fromHex(hex) {
            const P = Point.fromAffine(fromBytes((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('pointHex', hex)));
            P.assertValidity();
            return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
            return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // Multiscalar Multiplication
        static msm(points, scalars) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pippenger"])(Point, Fn, points, scalars);
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
            wnaf.setWindowSize(this, windowSize);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
            assertValidMemo(this);
        }
        hasEvenY() {
            const { y } = this.toAffine();
            if (Fp.isOdd) return !Fp.isOdd(y);
            throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */ equals(other) {
            aprjpoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
            return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */ negate() {
            return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
            const { a, b } = CURVE;
            const b3 = Fp.mul(b, _3n);
            const { px: X1, py: Y1, pz: Z1 } = this;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            let t0 = Fp.mul(X1, X1); // step 1
            let t1 = Fp.mul(Y1, Y1);
            let t2 = Fp.mul(Z1, Z1);
            let t3 = Fp.mul(X1, Y1);
            t3 = Fp.add(t3, t3); // step 5
            Z3 = Fp.mul(X1, Z1);
            Z3 = Fp.add(Z3, Z3);
            X3 = Fp.mul(a, Z3);
            Y3 = Fp.mul(b3, t2);
            Y3 = Fp.add(X3, Y3); // step 10
            X3 = Fp.sub(t1, Y3);
            Y3 = Fp.add(t1, Y3);
            Y3 = Fp.mul(X3, Y3);
            X3 = Fp.mul(t3, X3);
            Z3 = Fp.mul(b3, Z3); // step 15
            t2 = Fp.mul(a, t2);
            t3 = Fp.sub(t0, t2);
            t3 = Fp.mul(a, t3);
            t3 = Fp.add(t3, Z3);
            Z3 = Fp.add(t0, t0); // step 20
            t0 = Fp.add(Z3, t0);
            t0 = Fp.add(t0, t2);
            t0 = Fp.mul(t0, t3);
            Y3 = Fp.add(Y3, t0);
            t2 = Fp.mul(Y1, Z1); // step 25
            t2 = Fp.add(t2, t2);
            t0 = Fp.mul(t2, t3);
            X3 = Fp.sub(X3, t0);
            Z3 = Fp.mul(t2, t1);
            Z3 = Fp.add(Z3, Z3); // step 30
            Z3 = Fp.add(Z3, Z3);
            return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
            aprjpoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            const a = CURVE.a;
            const b3 = Fp.mul(CURVE.b, _3n);
            let t0 = Fp.mul(X1, X2); // step 1
            let t1 = Fp.mul(Y1, Y2);
            let t2 = Fp.mul(Z1, Z2);
            let t3 = Fp.add(X1, Y1);
            let t4 = Fp.add(X2, Y2); // step 5
            t3 = Fp.mul(t3, t4);
            t4 = Fp.add(t0, t1);
            t3 = Fp.sub(t3, t4);
            t4 = Fp.add(X1, Z1);
            let t5 = Fp.add(X2, Z2); // step 10
            t4 = Fp.mul(t4, t5);
            t5 = Fp.add(t0, t2);
            t4 = Fp.sub(t4, t5);
            t5 = Fp.add(Y1, Z1);
            X3 = Fp.add(Y2, Z2); // step 15
            t5 = Fp.mul(t5, X3);
            X3 = Fp.add(t1, t2);
            t5 = Fp.sub(t5, X3);
            Z3 = Fp.mul(a, t4);
            X3 = Fp.mul(b3, t2); // step 20
            Z3 = Fp.add(X3, Z3);
            X3 = Fp.sub(t1, Z3);
            Z3 = Fp.add(t1, Z3);
            Y3 = Fp.mul(X3, Z3);
            t1 = Fp.add(t0, t0); // step 25
            t1 = Fp.add(t1, t0);
            t2 = Fp.mul(a, t2);
            t4 = Fp.mul(b3, t4);
            t1 = Fp.add(t1, t2);
            t2 = Fp.sub(t0, t2); // step 30
            t2 = Fp.mul(a, t2);
            t4 = Fp.add(t4, t2);
            t0 = Fp.mul(t1, t4);
            Y3 = Fp.add(Y3, t0);
            t0 = Fp.mul(t5, t4); // step 35
            X3 = Fp.mul(t3, X3);
            X3 = Fp.sub(X3, t0);
            t0 = Fp.mul(t3, t1);
            Z3 = Fp.mul(t5, Z3);
            Z3 = Fp.add(Z3, t0); // step 40
            return new Point(X3, Y3, Z3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        wNAF(n) {
            return wnaf.wNAFCached(this, n, Point.normalizeZ);
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */ multiplyUnsafe(sc) {
            const { endo, n: N } = CURVE;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('scalar', sc, _0n, N);
            const I = Point.ZERO;
            if (sc === _0n) return I;
            if (this.is0() || sc === _1n) return this;
            // Case a: no endomorphism. Case b: has precomputes.
            if (!endo || wnaf.hasPrecomputes(this)) return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
            // Case c: endomorphism
            let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
            let k1p = I;
            let k2p = I;
            let d = this;
            while(k1 > _0n || k2 > _0n){
                if (k1 & _1n) k1p = k1p.add(d);
                if (k2 & _1n) k2p = k2p.add(d);
                d = d.double();
                k1 >>= _1n;
                k2 >>= _1n;
            }
            if (k1neg) k1p = k1p.negate();
            if (k2neg) k2p = k2p.negate();
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */ multiply(scalar) {
            const { endo, n: N } = CURVE;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('scalar', scalar, _1n, N);
            let point, fake; // Fake point is used to const-time mult
            if (endo) {
                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
                let { p: k1p, f: f1p } = this.wNAF(k1);
                let { p: k2p, f: f2p } = this.wNAF(k2);
                k1p = wnaf.constTimeNegate(k1neg, k1p);
                k2p = wnaf.constTimeNegate(k2neg, k2p);
                k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
                point = k1p.add(k2p);
                fake = f1p.add(f2p);
            } else {
                const { p, f } = this.wNAF(scalar);
                point = p;
                fake = f;
            }
            // Normalize `z` for both points, but return only real one
            return Point.normalizeZ([
                point,
                fake
            ])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */ multiplyAndAddUnsafe(Q, a, b) {
            const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
            const mul = (P, a // Select faster multiply() method
            )=>a === _0n || a === _1n || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a);
            const sum = mul(this, a).add(mul(Q, b));
            return sum.is0() ? undefined : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
            return toAffineMemo(this, iz);
        }
        isTorsionFree() {
            const { h: cofactor, isTorsionFree } = CURVE;
            if (cofactor === _1n) return true; // No subgroups, always torsion-free
            if (isTorsionFree) return isTorsionFree(Point, this);
            throw new Error('isTorsionFree() has not been declared for the elliptic curve');
        }
        clearCofactor() {
            const { h: cofactor, clearCofactor } = CURVE;
            if (cofactor === _1n) return this; // Fast-path
            if (clearCofactor) return clearCofactor(Point, this);
            return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('isCompressed', isCompressed);
            this.assertValidity();
            return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('isCompressed', isCompressed);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToHex"])(this.toRawBytes(isCompressed));
        }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO); // 0, 1, 0
    const _bits = CURVE.nBitLength;
    const wnaf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wNAF"])(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
    return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder
    };
}
function validateOpts(curve) {
    const opts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBasic"])(curve);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(opts, {
        hash: 'hash',
        hmac: 'function',
        randomBytes: 'function'
    }, {
        bits2int: 'function',
        bits2int_modN: 'function',
        lowS: 'boolean'
    });
    return Object.freeze({
        lowS: true,
        ...opts
    });
}
function weierstrass(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { Fp, n: CURVE_ORDER } = CURVE;
    const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
    const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
    function modN(a) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(a, CURVE_ORDER);
    }
    function invN(a) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invert"])(a, CURVE_ORDER);
    }
    const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
        ...CURVE,
        toBytes (_c, point, isCompressed) {
            const a = point.toAffine();
            const x = Fp.toBytes(a.x);
            const cat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('isCompressed', isCompressed);
            if (isCompressed) {
                return cat(Uint8Array.from([
                    point.hasEvenY() ? 0x02 : 0x03
                ]), x);
            } else {
                return cat(Uint8Array.from([
                    0x04
                ]), x, Fp.toBytes(a.y));
            }
        },
        fromBytes (bytes) {
            const len = bytes.length;
            const head = bytes[0];
            const tail = bytes.subarray(1);
            // this.assertValidity() is done inside of fromHex
            if (len === compressedLen && (head === 0x02 || head === 0x03)) {
                const x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(tail);
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inRange"])(x, _1n, Fp.ORDER)) throw new Error('Point is not on curve');
                const y2 = weierstrassEquation(x); // y² = x³ + ax + b
                let y;
                try {
                    y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
                } catch (sqrtError) {
                    const suffix = sqrtError instanceof Error ? ': ' + sqrtError.message : '';
                    throw new Error('Point is not on curve' + suffix);
                }
                const isYOdd = (y & _1n) === _1n;
                // ECDSA
                const isHeadOdd = (head & 1) === 1;
                if (isHeadOdd !== isYOdd) y = Fp.neg(y);
                return {
                    x,
                    y
                };
            } else if (len === uncompressedLen && head === 0x04) {
                const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
                const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
                return {
                    x,
                    y
                };
            } else {
                const cl = compressedLen;
                const ul = uncompressedLen;
                throw new Error('invalid Point, expected length of ' + cl + ', or uncompressed ' + ul + ', got ' + len);
            }
        }
    });
    const numToNByteHex = (num)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesBE"])(num, CURVE.nByteLength));
    function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n;
        return number > HALF;
    }
    function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    // slice bytes num
    const slcNum = (b, from, to)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(b.slice(from, to));
    /**
     * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
     */ class Signature {
        constructor(r, s, recovery){
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('r', r, _1n, CURVE_ORDER); // r in [1..N]
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('s', s, _1n, CURVE_ORDER); // s in [1..N]
            this.r = r;
            this.s = s;
            if (recovery != null) this.recovery = recovery;
            Object.freeze(this);
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
            const l = CURVE.nByteLength;
            hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('compactSignature', hex, l * 2);
            return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
            const { r, s } = DER.toSig((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('DER', hex));
            return new Signature(r, s);
        }
        /**
         * @todo remove
         * @deprecated
         */ assertValidity() {}
        addRecoveryBit(recovery) {
            return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
            const { r, s, recovery: rec } = this;
            const h = bits2int_modN((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('msgHash', msgHash)); // Truncate hash
            if (rec == null || ![
                0,
                1,
                2,
                3
            ].includes(rec)) throw new Error('recovery id invalid');
            const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
            if (radj >= Fp.ORDER) throw new Error('recovery id 2 or 3 invalid');
            const prefix = (rec & 1) === 0 ? '02' : '03';
            const R = Point.fromHex(prefix + numToNByteHex(radj));
            const ir = invN(radj); // r^-1
            const u1 = modN(-h * ir); // -hr^-1
            const u2 = modN(s * ir); // sr^-1
            const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
            if (!Q) throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
            Q.assertValidity();
            return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
            return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
            return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToBytes"])(this.toDERHex());
        }
        toDERHex() {
            return DER.hexFromSig(this);
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToBytes"])(this.toCompactHex());
        }
        toCompactHex() {
            return numToNByteHex(this.r) + numToNByteHex(this.s);
        }
    }
    const utils = {
        isValidPrivateKey (privateKey) {
            try {
                normPrivateKeyToScalar(privateKey);
                return true;
            } catch (error) {
                return false;
            }
        },
        normPrivateKeyToScalar: normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */ randomPrivateKey: ()=>{
            const length = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMinHashLength"])(CURVE.n);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapHashToField"])(CURVE.randomBytes(length), CURVE.n);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */ precompute (windowSize = 8, point = Point.BASE) {
            point._setWindowSize(windowSize);
            point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
            return point;
        }
    };
    /**
     * Computes public key for a private key. Checks for validity of the private key.
     * @param privateKey private key
     * @param isCompressed whether to return compact (default), or full key
     * @returns Public key, full when isCompressed=false; short when isCompressed=true
     */ function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    /**
     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
     */ function isProbPub(item) {
        const arr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBytes"])(item);
        const str = typeof item === 'string';
        const len = (arr || str) && item.length;
        if (arr) return len === compressedLen || len === uncompressedLen;
        if (str) return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point) return true;
        return false;
    }
    /**
     * ECDH (Elliptic Curve Diffie Hellman).
     * Computes shared public key from private key and public key.
     * Checks: 1) private key validity 2) shared key is on-curve.
     * Does NOT hash the result.
     * @param privateA private key
     * @param publicB different public key
     * @param isCompressed whether to return compact (default), or full key
     * @returns shared public key
     */ function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA)) throw new Error('first arg must be private key');
        if (!isProbPub(publicB)) throw new Error('second arg must be public key');
        const b = Point.fromHex(publicB); // check for being on-curve
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
    const bits2int = CURVE.bits2int || function(bytes) {
        // Our custom check "just in case"
        if (bytes.length > 8192) throw new Error('input is too large');
        // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
        // for some cases, since bytes.length * 8 is not actual bitLength.
        const num = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"])(bytes); // check for == u8 done here
        const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
        return delta > 0 ? num >> BigInt(delta) : num;
    };
    const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
        return modN(bits2int(bytes)); // can't use bytesToNumberBE here
    };
    // NOTE: pads output with zero as per spec
    const ORDER_MASK = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bitMask"])(CURVE.nBitLength);
    /**
     * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
     */ function int2octets(num) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('num < 2^' + CURVE.nBitLength, num, _0n, ORDER_MASK);
        // works with order, can have different size than numToField!
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesBE"])(num, CURVE.nByteLength);
    }
    // Steps A, D of RFC6979 3.2
    // Creates RFC6979 seed; converts msg/privKey to numbers.
    // Used only in sign, not in verify.
    // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order,
    // this will be invalid at least for P521. Also it can be bigger for P224 + SHA256
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if ([
            'recovered',
            'canonical'
        ].some((k)=>k in opts)) throw new Error('sign() legacy options not supported');
        const { hash, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts; // generates low-s sigs by default
        if (lowS == null) lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
        msgHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('msgHash', msgHash);
        validateSigVerOpts(opts);
        if (prehash) msgHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('prehashed msgHash', hash(msgHash));
        // We can't later call bits2octets, since nested bits2int is broken for curves
        // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
        const seedArgs = [
            int2octets(d),
            int2octets(h1int)
        ];
        // extraEntropy. RFC6979 3.6: additional k' (optional).
        if (ent != null && ent !== false) {
            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
            const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
            seedArgs.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('extraEntropy', e)); // check for being bytes
        }
        const seed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(...seedArgs); // Step D of RFC6979 3.2
        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
        // Converts signature params into point w r/s, checks result for validity.
        function k2sig(kBytes) {
            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
            const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
            if (!isWithinCurveOrder(k)) return; // Important: all mod() calls here must be done over N
            const ik = invN(k); // k^-1 mod n
            const q = Point.BASE.multiply(k).toAffine(); // q = Gk
            const r = modN(q.x); // r = q.x mod n
            if (r === _0n) return;
            // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
            // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
            // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
            const s = modN(ik * modN(m + r * d)); // Not using blinding here
            if (s === _0n) return;
            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n); // recovery bit (2 or 3, when q.x > n)
            let normS = s;
            if (lowS && isBiggerThanHalfOrder(s)) {
                normS = normalizeS(s); // if lowS was passed, ensure s is always
                recovery ^= 1; // // in the bottom half of N
            }
            return new Signature(r, normS, recovery); // use normS, not s
        }
        return {
            seed,
            k2sig
        };
    }
    const defaultSigOpts = {
        lowS: CURVE.lowS,
        prehash: false
    };
    const defaultVerOpts = {
        lowS: CURVE.lowS,
        prehash: false
    };
    /**
     * Signs message hash with a private key.
     * ```
     * sign(m, d, k) where
     *   (x, y) = G × k
     *   r = x mod n
     *   s = (m + dr)/k mod n
     * ```
     * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
     * @param privKey private key
     * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
     * @returns signature with recovery param
     */ function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
        const C = CURVE;
        const drbg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHmacDrbg"])(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig); // Steps B, C, D, E, F, G
    }
    // Enable precomputes. Slows down first publicKey computation by 20ms.
    Point.BASE._setWindowSize(8);
    // utils.precompute(8, ProjectivePoint.BASE)
    /**
     * Verifies a signature against message hash and public key.
     * Rejects lowS signatures by default: to override,
     * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
     *
     * ```
     * verify(r, s, h, P) where
     *   U1 = hs^-1 mod n
     *   U2 = rs^-1 mod n
     *   R = U1⋅G - U2⋅P
     *   mod(R.x, n) == r
     * ```
     */ function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        const sg = signature;
        msgHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('msgHash', msgHash);
        publicKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('publicKey', publicKey);
        const { lowS, prehash, format } = opts;
        // Verify opts, deduce signature format
        validateSigVerOpts(opts);
        if ('strict' in opts) throw new Error('options.strict was renamed to lowS');
        if (format !== undefined && format !== 'compact' && format !== 'der') throw new Error('format must be compact or der');
        const isHex = typeof sg === 'string' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBytes"])(sg);
        const isObj = !isHex && !format && typeof sg === 'object' && sg !== null && typeof sg.r === 'bigint' && typeof sg.s === 'bigint';
        if (!isHex && !isObj) throw new Error('invalid signature, expected Uint8Array, hex string or Signature instance');
        let _sig = undefined;
        let P;
        try {
            if (isObj) _sig = new Signature(sg.r, sg.s);
            if (isHex) {
                // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
                // Since DER can also be 2*nByteLength bytes, we check for it first.
                try {
                    if (format !== 'compact') _sig = Signature.fromDER(sg);
                } catch (derError) {
                    if (!(derError instanceof DER.Err)) throw derError;
                }
                if (!_sig && format !== 'der') _sig = Signature.fromCompact(sg);
            }
            P = Point.fromHex(publicKey);
        } catch (error) {
            return false;
        }
        if (!_sig) return false;
        if (lowS && _sig.hasHighS()) return false;
        if (prehash) msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
        const is = invN(s); // s^-1
        const u1 = modN(h * is); // u1 = hs^-1 mod n
        const u2 = modN(r * is); // u2 = rs^-1 mod n
        const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
        if (!R) return false;
        const v = modN(R.x);
        return v === r;
    }
    return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils
    };
}
function SWUFpSqrtRatio(Fp, Z) {
    // Generic implementation
    const q = Fp.ORDER;
    let l = _0n;
    for(let o = q - _1n; o % _2n === _0n; o /= _2n)l += _1n;
    const c1 = l; // 1. c1, the largest integer such that 2^c1 divides q - 1.
    // We need 2n ** c1 and 2n ** (c1-1). We can't use **; but we can use <<.
    // 2n ** c1 == 2n << (c1-1)
    const _2n_pow_c1_1 = _2n << c1 - _1n - _1n;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n;
    const c2 = (q - _1n) / _2n_pow_c1; // 2. c2 = (q - 1) / (2^c1)  # Integer arithmetic
    const c3 = (c2 - _1n) / _2n; // 3. c3 = (c2 - 1) / 2            # Integer arithmetic
    const c4 = _2n_pow_c1 - _1n; // 4. c4 = 2^c1 - 1                # Integer arithmetic
    const c5 = _2n_pow_c1_1; // 5. c5 = 2^(c1 - 1)                  # Integer arithmetic
    const c6 = Fp.pow(Z, c2); // 6. c6 = Z^c2
    const c7 = Fp.pow(Z, (c2 + _1n) / _2n); // 7. c7 = Z^((c2 + 1) / 2)
    let sqrtRatio = (u, v)=>{
        let tv1 = c6; // 1. tv1 = c6
        let tv2 = Fp.pow(v, c4); // 2. tv2 = v^c4
        let tv3 = Fp.sqr(tv2); // 3. tv3 = tv2^2
        tv3 = Fp.mul(tv3, v); // 4. tv3 = tv3 * v
        let tv5 = Fp.mul(u, tv3); // 5. tv5 = u * tv3
        tv5 = Fp.pow(tv5, c3); // 6. tv5 = tv5^c3
        tv5 = Fp.mul(tv5, tv2); // 7. tv5 = tv5 * tv2
        tv2 = Fp.mul(tv5, v); // 8. tv2 = tv5 * v
        tv3 = Fp.mul(tv5, u); // 9. tv3 = tv5 * u
        let tv4 = Fp.mul(tv3, tv2); // 10. tv4 = tv3 * tv2
        tv5 = Fp.pow(tv4, c5); // 11. tv5 = tv4^c5
        let isQR = Fp.eql(tv5, Fp.ONE); // 12. isQR = tv5 == 1
        tv2 = Fp.mul(tv3, c7); // 13. tv2 = tv3 * c7
        tv5 = Fp.mul(tv4, tv1); // 14. tv5 = tv4 * tv1
        tv3 = Fp.cmov(tv2, tv3, isQR); // 15. tv3 = CMOV(tv2, tv3, isQR)
        tv4 = Fp.cmov(tv5, tv4, isQR); // 16. tv4 = CMOV(tv5, tv4, isQR)
        // 17. for i in (c1, c1 - 1, ..., 2):
        for(let i = c1; i > _1n; i--){
            let tv5 = i - _2n; // 18.    tv5 = i - 2
            tv5 = _2n << tv5 - _1n; // 19.    tv5 = 2^tv5
            let tvv5 = Fp.pow(tv4, tv5); // 20.    tv5 = tv4^tv5
            const e1 = Fp.eql(tvv5, Fp.ONE); // 21.    e1 = tv5 == 1
            tv2 = Fp.mul(tv3, tv1); // 22.    tv2 = tv3 * tv1
            tv1 = Fp.mul(tv1, tv1); // 23.    tv1 = tv1 * tv1
            tvv5 = Fp.mul(tv4, tv1); // 24.    tv5 = tv4 * tv1
            tv3 = Fp.cmov(tv2, tv3, e1); // 25.    tv3 = CMOV(tv2, tv3, e1)
            tv4 = Fp.cmov(tvv5, tv4, e1); // 26.    tv4 = CMOV(tv5, tv4, e1)
        }
        return {
            isValid: isQR,
            value: tv3
        };
    };
    if (Fp.ORDER % _4n === _3n) {
        // sqrt_ratio_3mod4(u, v)
        const c1 = (Fp.ORDER - _3n) / _4n; // 1. c1 = (q - 3) / 4     # Integer arithmetic
        const c2 = Fp.sqrt(Fp.neg(Z)); // 2. c2 = sqrt(-Z)
        sqrtRatio = (u, v)=>{
            let tv1 = Fp.sqr(v); // 1. tv1 = v^2
            const tv2 = Fp.mul(u, v); // 2. tv2 = u * v
            tv1 = Fp.mul(tv1, tv2); // 3. tv1 = tv1 * tv2
            let y1 = Fp.pow(tv1, c1); // 4. y1 = tv1^c1
            y1 = Fp.mul(y1, tv2); // 5. y1 = y1 * tv2
            const y2 = Fp.mul(y1, c2); // 6. y2 = y1 * c2
            const tv3 = Fp.mul(Fp.sqr(y1), v); // 7. tv3 = y1^2; 8. tv3 = tv3 * v
            const isQR = Fp.eql(tv3, u); // 9. isQR = tv3 == u
            let y = Fp.cmov(y2, y1, isQR); // 10. y = CMOV(y2, y1, isQR)
            return {
                isValid: isQR,
                value: y
            }; // 11. return (isQR, y) isQR ? y : y*c2
        };
    }
    // No curves uses that
    // if (Fp.ORDER % _8n === _5n) // sqrt_ratio_5mod8
    return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp, opts) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateField"])(Fp);
    if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z)) throw new Error('mapToCurveSimpleSWU: invalid opts');
    const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
    if (!Fp.isOdd) throw new Error('Fp.isOdd is not implemented!');
    // Input: u, an element of F.
    // Output: (x, y), a point on E.
    return (u)=>{
        // prettier-ignore
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u); // 1.  tv1 = u^2
        tv1 = Fp.mul(tv1, opts.Z); // 2.  tv1 = Z * tv1
        tv2 = Fp.sqr(tv1); // 3.  tv2 = tv1^2
        tv2 = Fp.add(tv2, tv1); // 4.  tv2 = tv2 + tv1
        tv3 = Fp.add(tv2, Fp.ONE); // 5.  tv3 = tv2 + 1
        tv3 = Fp.mul(tv3, opts.B); // 6.  tv3 = B * tv3
        tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO)); // 7.  tv4 = CMOV(Z, -tv2, tv2 != 0)
        tv4 = Fp.mul(tv4, opts.A); // 8.  tv4 = A * tv4
        tv2 = Fp.sqr(tv3); // 9.  tv2 = tv3^2
        tv6 = Fp.sqr(tv4); // 10. tv6 = tv4^2
        tv5 = Fp.mul(tv6, opts.A); // 11. tv5 = A * tv6
        tv2 = Fp.add(tv2, tv5); // 12. tv2 = tv2 + tv5
        tv2 = Fp.mul(tv2, tv3); // 13. tv2 = tv2 * tv3
        tv6 = Fp.mul(tv6, tv4); // 14. tv6 = tv6 * tv4
        tv5 = Fp.mul(tv6, opts.B); // 15. tv5 = B * tv6
        tv2 = Fp.add(tv2, tv5); // 16. tv2 = tv2 + tv5
        x = Fp.mul(tv1, tv3); // 17.   x = tv1 * tv3
        const { isValid, value } = sqrtRatio(tv2, tv6); // 18. (is_gx1_square, y1) = sqrt_ratio(tv2, tv6)
        y = Fp.mul(tv1, u); // 19.   y = tv1 * u  -> Z * u^3 * y1
        y = Fp.mul(y, value); // 20.   y = y * y1
        x = Fp.cmov(x, tv3, isValid); // 21.   x = CMOV(x, tv3, is_gx1_square)
        y = Fp.cmov(y, value, isValid); // 22.   y = CMOV(y, y1, is_gx1_square)
        const e1 = Fp.isOdd(u) === Fp.isOdd(y); // 23.  e1 = sgn0(u) == sgn0(y)
        y = Fp.cmov(Fp.neg(y), y, e1); // 24.   y = CMOV(-y, y, e1)
        const tv4_inv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FpInvertBatch"])(Fp, [
            tv4
        ], true)[0];
        x = Fp.mul(x, tv4_inv); // 25.   x = x / tv4
        return {
            x,
            y
        };
    };
} //# sourceMappingURL=weierstrass.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/_shortw_utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCurve",
    ()=>createCurve,
    "getHash",
    ()=>getHash
]);
/**
 * Utilities for short weierstrass curves, combined with noble-hashes.
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$hmac$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/hmac.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$weierstrass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/weierstrass.js [app-client] (ecmascript)");
;
;
;
function getHash(hash) {
    return {
        hash,
        hmac: (key, ...msgs)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$hmac$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hmac"])(hash, key, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(...msgs)),
        randomBytes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomBytes"]
    };
}
function createCurve(curveDef, defHash) {
    const create = (hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$weierstrass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weierstrass"])({
            ...curveDef,
            ...getHash(hash)
        });
    return {
        ...create(defHash),
        create
    };
} //# sourceMappingURL=_shortw_utils.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/hash-to-curve.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHasher",
    ()=>createHasher,
    "expand_message_xmd",
    ()=>expand_message_xmd,
    "expand_message_xof",
    ()=>expand_message_xof,
    "hash_to_field",
    ()=>hash_to_field,
    "isogenyMap",
    ()=>isogenyMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
// Octet Stream to Integer. "spec" implementation of os2ip is 2.5x slower vs bytesToNumberBE.
const os2ip = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberBE"];
// Integer to Octet Stream (numberToBytesBE)
function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << 8 * length) throw new Error('invalid I2OSP input: ' + value);
    const res = Array.from({
        length
    }).fill(0);
    for(let i = length - 1; i >= 0; i--){
        res[i] = value & 0xff;
        value >>>= 8;
    }
    return new Uint8Array(res);
}
function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for(let i = 0; i < a.length; i++){
        arr[i] = a[i] ^ b[i];
    }
    return arr;
}
function anum(item) {
    if (!Number.isSafeInteger(item)) throw new Error('number expected');
}
function expand_message_xmd(msg, DST, lenInBytes, H) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abytes"])(msg);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abytes"])(DST);
    anum(lenInBytes);
    // https://www.rfc-editor.org/rfc/rfc9380#section-5.3.3
    if (DST.length > 255) DST = H((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])('H2C-OVERSIZE-DST-'), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255) throw new Error('expand_message_xmd: invalid lenInBytes');
    const DST_prime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2); // len_in_bytes_str
    const b = new Array(ell);
    const b_0 = H((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(b_0, i2osp(1, 1), DST_prime));
    for(let i = 1; i <= ell; i++){
        const args = [
            strxor(b_0, b[i - 1]),
            i2osp(i + 1, 1),
            DST_prime
        ];
        b[i] = H((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(...args));
    }
    const pseudo_random_bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abytes"])(msg);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abytes"])(DST);
    anum(lenInBytes);
    // https://www.rfc-editor.org/rfc/rfc9380#section-5.3.3
    // DST = H('H2C-OVERSIZE-DST-' || a_very_long_DST, Math.ceil((lenInBytes * k) / 8));
    if (DST.length > 255) {
        const dkLen = Math.ceil(2 * k / 8);
        DST = H.create({
            dkLen
        }).update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])('H2C-OVERSIZE-DST-')).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255) throw new Error('expand_message_xof: invalid lenInBytes');
    return H.create({
        dkLen: lenInBytes
    }).update(msg).update(i2osp(lenInBytes, 2))// 2. DST_prime = DST || I2OSP(len(DST), 1)
    .update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(options, {
        DST: 'stringOrUint8Array',
        p: 'bigint',
        m: 'isSafeInteger',
        k: 'isSafeInteger',
        hash: 'hash'
    });
    const { p, k, m, hash, expand, DST: _DST } = options;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abytes"])(msg);
    anum(count);
    const DST = typeof _DST === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])(_DST) : _DST;
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8); // section 5.1 of ietf draft link above
    const len_in_bytes = count * m * L;
    let prb; // pseudo_random_bytes
    if (expand === 'xmd') {
        prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
    } else if (expand === 'xof') {
        prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
    } else if (expand === '_internal_pass') {
        // for internal tests only
        prb = msg;
    } else {
        throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for(let i = 0; i < count; i++){
        const e = new Array(m);
        for(let j = 0; j < m; j++){
            const elm_offset = L * (j + i * m);
            const tv = prb.subarray(elm_offset, elm_offset + L);
            e[j] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(os2ip(tv), p);
        }
        u[i] = e;
    }
    return u;
}
function isogenyMap(field, map) {
    // Make same order as in spec
    const coeff = map.map((i)=>Array.from(i).reverse());
    return (x, y)=>{
        const [xn, xd, yn, yd] = coeff.map((val)=>val.reduce((acc, i)=>field.add(field.mul(acc, x), i)));
        // 6.6.3
        // Exceptional cases of iso_map are inputs that cause the denominator of
        // either rational function to evaluate to zero; such cases MUST return
        // the identity point on E.
        const [xd_inv, yd_inv] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FpInvertBatch"])(field, [
            xd,
            yd
        ], true);
        x = field.mul(xn, xd_inv); // xNum / xDen
        y = field.mul(y, field.mul(yn, yd_inv)); // y * (yNum / yDev)
        return {
            x,
            y
        };
    };
}
function createHasher(Point, mapToCurve, defaults) {
    if (typeof mapToCurve !== 'function') throw new Error('mapToCurve() must be defined');
    function map(num) {
        return Point.fromAffine(mapToCurve(num));
    }
    function clear(initial) {
        const P = initial.clearCofactor();
        if (P.equals(Point.ZERO)) return Point.ZERO; // zero will throw in assert
        P.assertValidity();
        return P;
    }
    return {
        defaults,
        // Encodes byte string to elliptic curve.
        // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
        hashToCurve (msg, options) {
            const u = hash_to_field(msg, 2, {
                ...defaults,
                DST: defaults.DST,
                ...options
            });
            const u0 = map(u[0]);
            const u1 = map(u[1]);
            return clear(u0.add(u1));
        },
        // Encodes byte string to elliptic curve.
        // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
        encodeToCurve (msg, options) {
            const u = hash_to_field(msg, 1, {
                ...defaults,
                DST: defaults.encodeDST,
                ...options
            });
            return clear(map(u[0]));
        },
        // Same as encodeToCurve, but without hash
        mapToCurve (scalars) {
            if (!Array.isArray(scalars)) throw new Error('expected array of bigints');
            for (const i of scalars)if (typeof i !== 'bigint') throw new Error('expected array of bigints');
            return clear(map(scalars));
        }
    };
} //# sourceMappingURL=hash-to-curve.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/nist.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "p256",
    ()=>p256,
    "p256_hasher",
    ()=>p256_hasher,
    "p384",
    ()=>p384,
    "p384_hasher",
    ()=>p384_hasher,
    "p521",
    ()=>p521,
    "p521_hasher",
    ()=>p521_hasher,
    "secp256r1",
    ()=>secp256r1,
    "secp384r1",
    ()=>secp384r1,
    "secp521r1",
    ()=>secp521r1
]);
/**
 * Internal module for NIST P256, P384, P521 curves.
 * Do not use for now.
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/sha2.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$_shortw_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/_shortw_utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/hash-to-curve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$weierstrass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/weierstrass.js [app-client] (ecmascript)");
;
;
;
;
;
const Fp256 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'));
const p256_a = Fp256.create(BigInt('-3'));
const p256_b = BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b');
const p256 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$_shortw_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCurve"])({
    a: p256_a,
    b: p256_b,
    Fp: Fp256,
    n: BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
    Gx: BigInt('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
    Gy: BigInt('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
    h: BigInt(1),
    lowS: false
}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"]);
const secp256r1 = p256;
const p256_mapSWU = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$weierstrass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapToCurveSimpleSWU"])(Fp256, {
        A: p256_a,
        B: p256_b,
        Z: Fp256.create(BigInt('-10'))
    }))();
const p256_hasher = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHasher"])(secp256r1.ProjectivePoint, (scalars)=>p256_mapSWU(scalars[0]), {
        DST: 'P256_XMD:SHA-256_SSWU_RO_',
        encodeDST: 'P256_XMD:SHA-256_SSWU_NU_',
        p: Fp256.ORDER,
        m: 1,
        k: 128,
        expand: 'xmd',
        hash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"]
    }))();
// Field over which we'll do calculations.
const Fp384 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff'));
const p384_a = Fp384.create(BigInt('-3'));
// prettier-ignore
const p384_b = BigInt('0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef');
const p384 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$_shortw_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCurve"])({
    a: p384_a,
    b: p384_b,
    Fp: Fp384,
    n: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973'),
    Gx: BigInt('0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7'),
    Gy: BigInt('0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f'),
    h: BigInt(1),
    lowS: false
}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha384"]);
const secp384r1 = p384;
const p384_mapSWU = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$weierstrass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapToCurveSimpleSWU"])(Fp384, {
        A: p384_a,
        B: p384_b,
        Z: Fp384.create(BigInt('-12'))
    }))();
const p384_hasher = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHasher"])(secp384r1.ProjectivePoint, (scalars)=>p384_mapSWU(scalars[0]), {
        DST: 'P384_XMD:SHA-384_SSWU_RO_',
        encodeDST: 'P384_XMD:SHA-384_SSWU_NU_',
        p: Fp384.ORDER,
        m: 1,
        k: 192,
        expand: 'xmd',
        hash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha384"]
    }))();
// Field over which we'll do calculations.
const Fp521 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(BigInt('0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
const p521_a = Fp521.create(BigInt('-3'));
const p521_b = BigInt('0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00');
const p521 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$_shortw_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCurve"])({
    a: p521_a,
    b: p521_b,
    Fp: Fp521,
    n: BigInt('0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409'),
    Gx: BigInt('0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66'),
    Gy: BigInt('0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650'),
    h: BigInt(1),
    lowS: false,
    allowedPrivateKeyLengths: [
        130,
        131,
        132
    ] // P521 keys are variable-length. Normalize to 132b
}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha512"]);
const secp521r1 = p521;
const p521_mapSWU = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$weierstrass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapToCurveSimpleSWU"])(Fp521, {
        A: p521_a,
        B: p521_b,
        Z: Fp521.create(BigInt('-4'))
    }))();
const p521_hasher = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHasher"])(secp521r1.ProjectivePoint, (scalars)=>p521_mapSWU(scalars[0]), {
        DST: 'P521_XMD:SHA-512_SSWU_RO_',
        encodeDST: 'P521_XMD:SHA-512_SSWU_NU_',
        p: Fp521.ORDER,
        m: 1,
        k: 256,
        expand: 'xmd',
        hash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha512"]
    }))(); //# sourceMappingURL=nist.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/p256.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * NIST secp256r1 aka p256.
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ __turbopack_context__.s([
    "encodeToCurve",
    ()=>encodeToCurve,
    "hashToCurve",
    ()=>hashToCurve,
    "p256",
    ()=>p256,
    "secp256r1",
    ()=>secp256r1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$nist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/nist.js [app-client] (ecmascript)");
;
;
const p256 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$nist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p256"];
const secp256r1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$nist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p256"];
const hashToCurve = /* @__PURE__ */ (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$nist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p256_hasher"].hashToCurve)();
const encodeToCurve = /* @__PURE__ */ (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$nist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p256_hasher"].encodeToCurve)(); //# sourceMappingURL=p256.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/edwards.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "twistedEdwards",
    ()=>twistedEdwards
]);
/**
 * Twisted Edwards curve. The formula is: ax² + y² = 1 + dx²y².
 * For design rationale of types / exports, see weierstrass module documentation.
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ // prettier-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/curve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
// prettier-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
;
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _8n = BigInt(8);
// verification rule is either zip215 or rfc8032 / nist186-5. Consult fromHex:
const VERIFY_DEFAULT = {
    zip215: true
};
function validateOpts(curve) {
    const opts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBasic"])(curve);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(curve, {
        hash: 'function',
        a: 'bigint',
        d: 'bigint',
        randomBytes: 'function'
    }, {
        adjustScalarBytes: 'function',
        domain: 'function',
        uvRatio: 'function',
        mapToCurve: 'function'
    });
    // Set defaults
    return Object.freeze({
        ...opts
    });
}
function twistedEdwards(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { Fp, n: CURVE_ORDER, prehash: prehash, hash: cHash, randomBytes, nByteLength, h: cofactor } = CURVE;
    // Important:
    // There are some places where Fp.BYTES is used instead of nByteLength.
    // So far, everything has been tested with curves of Fp.BYTES == nByteLength.
    // TODO: test and find curves which behave otherwise.
    const MASK = _2n << BigInt(nByteLength * 8) - _1n;
    const modP = Fp.create; // Function overrides
    const Fn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(CURVE.n, CURVE.nBitLength);
    // sqrt(u/v)
    const uvRatio = CURVE.uvRatio || ((u, v)=>{
        try {
            return {
                isValid: true,
                value: Fp.sqrt(u * Fp.inv(v))
            };
        } catch (e) {
            return {
                isValid: false,
                value: _0n
            };
        }
    });
    const adjustScalarBytes = CURVE.adjustScalarBytes || ((bytes)=>bytes); // NOOP
    const domain = CURVE.domain || ((data, ctx, phflag)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('phflag', phflag);
        if (ctx.length || phflag) throw new Error('Contexts/pre-hash are not supported');
        return data;
    }); // NOOP
    // 0 <= n < MASK
    // Coordinates larger than Fp.ORDER are allowed for zip215
    function aCoordinate(title, n, banZero = false) {
        const min = banZero ? _1n : _0n;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('coordinate ' + title, n, min, MASK);
    }
    function aextpoint(other) {
        if (!(other instanceof Point)) throw new Error('ExtendedPoint expected');
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    const toAffineMemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoized"])((p, iz)=>{
        const { ex: x, ey: y, ez: z } = p;
        const is0 = p.is0();
        if (iz == null) iz = is0 ? _8n : Fp.inv(z); // 8 was chosen arbitrarily
        const ax = modP(x * iz);
        const ay = modP(y * iz);
        const zz = modP(z * iz);
        if (is0) return {
            x: _0n,
            y: _1n
        };
        if (zz !== _1n) throw new Error('invZ was invalid');
        return {
            x: ax,
            y: ay
        };
    });
    const assertValidMemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoized"])((p)=>{
        const { a, d } = CURVE;
        if (p.is0()) throw new Error('bad point: ZERO'); // TODO: optimize, with vars below?
        // Equation in affine coordinates: ax² + y² = 1 + dx²y²
        // Equation in projective coordinates (X/Z, Y/Z, Z):  (aX² + Y²)Z² = Z⁴ + dX²Y²
        const { ex: X, ey: Y, ez: Z, et: T } = p;
        const X2 = modP(X * X); // X²
        const Y2 = modP(Y * Y); // Y²
        const Z2 = modP(Z * Z); // Z²
        const Z4 = modP(Z2 * Z2); // Z⁴
        const aX2 = modP(X2 * a); // aX²
        const left = modP(Z2 * modP(aX2 + Y2)); // (aX² + Y²)Z²
        const right = modP(Z4 + modP(d * modP(X2 * Y2))); // Z⁴ + dX²Y²
        if (left !== right) throw new Error('bad point: equation left != right (1)');
        // In Extended coordinates we also have T, which is x*y=T/Z: check X*Y == Z*T
        const XY = modP(X * Y);
        const ZT = modP(Z * T);
        if (XY !== ZT) throw new Error('bad point: equation left != right (2)');
        return true;
    });
    // Extended Point works in extended coordinates: (x, y, z, t) ∋ (x=x/z, y=y/z, t=xy).
    // https://en.wikipedia.org/wiki/Twisted_Edwards_curve#Extended_coordinates
    class Point {
        constructor(ex, ey, ez, et){
            aCoordinate('x', ex);
            aCoordinate('y', ey);
            aCoordinate('z', ez, true);
            aCoordinate('t', et);
            this.ex = ex;
            this.ey = ey;
            this.ez = ez;
            this.et = et;
            Object.freeze(this);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        static fromAffine(p) {
            if (p instanceof Point) throw new Error('extended point not allowed');
            const { x, y } = p || {};
            aCoordinate('x', x);
            aCoordinate('y', y);
            return new Point(x, y, _1n, modP(x * y));
        }
        static normalizeZ(points) {
            const toInv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FpInvertBatch"])(Fp, points.map((p)=>p.ez));
            return points.map((p, i)=>p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        // Multiscalar Multiplication
        static msm(points, scalars) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pippenger"])(Point, Fn, points, scalars);
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
            wnaf.setWindowSize(this, windowSize);
        }
        // Not required for fromHex(), which always creates valid points.
        // Could be useful for fromAffine().
        assertValidity() {
            assertValidMemo(this);
        }
        // Compare one point to another.
        equals(other) {
            aextpoint(other);
            const { ex: X1, ey: Y1, ez: Z1 } = this;
            const { ex: X2, ey: Y2, ez: Z2 } = other;
            const X1Z2 = modP(X1 * Z2);
            const X2Z1 = modP(X2 * Z1);
            const Y1Z2 = modP(Y1 * Z2);
            const Y2Z1 = modP(Y2 * Z1);
            return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        negate() {
            // Flips point sign to a negative one (-x, y in affine coords)
            return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
        }
        // Fast algo for doubling Extended Point.
        // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
        // Cost: 4M + 4S + 1*a + 6add + 1*2.
        double() {
            const { a } = CURVE;
            const { ex: X1, ey: Y1, ez: Z1 } = this;
            const A = modP(X1 * X1); // A = X12
            const B = modP(Y1 * Y1); // B = Y12
            const C = modP(_2n * modP(Z1 * Z1)); // C = 2*Z12
            const D = modP(a * A); // D = a*A
            const x1y1 = X1 + Y1;
            const E = modP(modP(x1y1 * x1y1) - A - B); // E = (X1+Y1)2-A-B
            const G = D + B; // G = D+B
            const F = G - C; // F = G-C
            const H = D - B; // H = D-B
            const X3 = modP(E * F); // X3 = E*F
            const Y3 = modP(G * H); // Y3 = G*H
            const T3 = modP(E * H); // T3 = E*H
            const Z3 = modP(F * G); // Z3 = F*G
            return new Point(X3, Y3, Z3, T3);
        }
        // Fast algo for adding 2 Extended Points.
        // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
        // Cost: 9M + 1*a + 1*d + 7add.
        add(other) {
            aextpoint(other);
            const { a, d } = CURVE;
            const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
            const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
            const A = modP(X1 * X2); // A = X1*X2
            const B = modP(Y1 * Y2); // B = Y1*Y2
            const C = modP(T1 * d * T2); // C = T1*d*T2
            const D = modP(Z1 * Z2); // D = Z1*Z2
            const E = modP((X1 + Y1) * (X2 + Y2) - A - B); // E = (X1+Y1)*(X2+Y2)-A-B
            const F = D - C; // F = D-C
            const G = D + C; // G = D+C
            const H = modP(B - a * A); // H = B-a*A
            const X3 = modP(E * F); // X3 = E*F
            const Y3 = modP(G * H); // Y3 = G*H
            const T3 = modP(E * H); // T3 = E*H
            const Z3 = modP(F * G); // Z3 = F*G
            return new Point(X3, Y3, Z3, T3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        wNAF(n) {
            return wnaf.wNAFCached(this, n, Point.normalizeZ);
        }
        // Constant-time multiplication.
        multiply(scalar) {
            const n = scalar;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('scalar', n, _1n, CURVE_ORDER); // 1 <= scalar < L
            const { p, f } = this.wNAF(n);
            return Point.normalizeZ([
                p,
                f
            ])[0];
        }
        // Non-constant-time multiplication. Uses double-and-add algorithm.
        // It's faster, but should only be used when you don't care about
        // an exposed private key e.g. sig verification.
        // Does NOT allow scalars higher than CURVE.n.
        // Accepts optional accumulator to merge with multiply (important for sparse scalars)
        multiplyUnsafe(scalar, acc = Point.ZERO) {
            const n = scalar;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('scalar', n, _0n, CURVE_ORDER); // 0 <= scalar < L
            if (n === _0n) return I;
            if (this.is0() || n === _1n) return this;
            return wnaf.wNAFCachedUnsafe(this, n, Point.normalizeZ, acc);
        }
        // Checks if point is of small order.
        // If you add something to small order point, you will have "dirty"
        // point with torsion component.
        // Multiplies point by cofactor and checks if the result is 0.
        isSmallOrder() {
            return this.multiplyUnsafe(cofactor).is0();
        }
        // Multiplies point by curve order and checks if the result is 0.
        // Returns `false` is the point is dirty.
        isTorsionFree() {
            return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
        }
        // Converts Extended point to default (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        toAffine(iz) {
            return toAffineMemo(this, iz);
        }
        clearCofactor() {
            const { h: cofactor } = CURVE;
            if (cofactor === _1n) return this;
            return this.multiplyUnsafe(cofactor);
        }
        // Converts hash string or Uint8Array to Point.
        // Uses algo from RFC8032 5.1.3.
        static fromHex(hex, zip215 = false) {
            const { d, a } = CURVE;
            const len = Fp.BYTES;
            hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('pointHex', hex, len); // copy hex to a new array
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('zip215', zip215);
            const normed = hex.slice(); // copy again, we'll manipulate it
            const lastByte = hex[len - 1]; // select last byte
            normed[len - 1] = lastByte & ~0x80; // clear last bit
            const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(normed);
            // zip215=true is good for consensus-critical apps. =false follows RFC8032 / NIST186-5.
            // RFC8032 prohibits >= p, but ZIP215 doesn't
            // zip215=true:  0 <= y < MASK (2^256 for ed25519)
            // zip215=false: 0 <= y < P (2^255-19 for ed25519)
            const max = zip215 ? MASK : Fp.ORDER;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('pointHex.y', y, _0n, max);
            // Ed25519: x² = (y²-1)/(dy²+1) mod p. Ed448: x² = (y²-1)/(dy²-1) mod p. Generic case:
            // ax²+y²=1+dx²y² => y²-1=dx²y²-ax² => y²-1=x²(dy²-a) => x²=(y²-1)/(dy²-a)
            const y2 = modP(y * y); // denominator is always non-0 mod p.
            const u = modP(y2 - _1n); // u = y² - 1
            const v = modP(d * y2 - a); // v = d y² + 1.
            let { isValid, value: x } = uvRatio(u, v); // √(u/v)
            if (!isValid) throw new Error('Point.fromHex: invalid y coordinate');
            const isXOdd = (x & _1n) === _1n; // There are 2 square roots. Use x_0 bit to select proper
            const isLastByteOdd = (lastByte & 0x80) !== 0; // x_0, last bit
            if (!zip215 && x === _0n && isLastByteOdd) // if x=0 and x_0 = 1, fail
            throw new Error('Point.fromHex: x=0 and x_0=1');
            if (isLastByteOdd !== isXOdd) x = modP(-x); // if x_0 != x mod 2, set x = p-x
            return Point.fromAffine({
                x,
                y
            });
        }
        static fromPrivateKey(privKey) {
            const { scalar } = getPrivateScalar(privKey);
            return G.multiply(scalar); // reduced one call of `toRawBytes`
        }
        toRawBytes() {
            const { x, y } = this.toAffine();
            const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(y, Fp.BYTES); // each y has 2 x values (x, -y)
            bytes[bytes.length - 1] |= x & _1n ? 0x80 : 0; // when compressing, it's enough to store y
            return bytes; // and use the last byte to encode sign of x
        }
        toHex() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToHex"])(this.toRawBytes()); // Same as toRawBytes, but returns string.
        }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n, modP(CURVE.Gx * CURVE.Gy));
    Point.ZERO = new Point(_0n, _1n, _1n, _0n); // 0, 1, 1, 0
    const { BASE: G, ZERO: I } = Point;
    const wnaf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wNAF"])(Point, nByteLength * 8);
    function modN(a) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(a, CURVE_ORDER);
    }
    // Little-endian SHA512 with modulo n
    function modN_LE(hash) {
        return modN((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(hash));
    }
    // Get the hashed private scalar per RFC8032 5.1.5
    function getPrivateScalar(key) {
        const len = Fp.BYTES;
        key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('private key', key, len);
        // Hash private key with curve's hash function to produce uniformingly random input
        // Check byte lengths: ensure(64, h(ensure(32, key)))
        const hashed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('hashed private key', cHash(key), 2 * len);
        const head = adjustScalarBytes(hashed.slice(0, len)); // clear first half bits, produce FE
        const prefix = hashed.slice(len, 2 * len); // second half is called key prefix (5.1.6)
        const scalar = modN_LE(head); // The actual private scalar
        return {
            head,
            prefix,
            scalar
        };
    }
    // Convenience method that creates public key from scalar. RFC8032 5.1.5
    function getExtendedPublicKey(key) {
        const { head, prefix, scalar } = getPrivateScalar(key);
        const point = G.multiply(scalar); // Point on Edwards curve aka public key
        const pointBytes = point.toRawBytes(); // Uint8Array representation
        return {
            head,
            prefix,
            scalar,
            point,
            pointBytes
        };
    }
    // Calculates EdDSA pub key. RFC8032 5.1.5. Privkey is hashed. Use first half with 3 bits cleared
    function getPublicKey(privKey) {
        return getExtendedPublicKey(privKey).pointBytes;
    }
    // int('LE', SHA512(dom2(F, C) || msgs)) mod N
    function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
        const msg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(...msgs);
        return modN_LE(cHash(domain(msg, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('context', context), !!prehash)));
    }
    /** Signs message with privateKey. RFC8032 5.1.6 */ function sign(msg, privKey, options = {}) {
        msg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('message', msg);
        if (prehash) msg = prehash(msg); // for ed25519ph etc.
        const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
        const r = hashDomainToScalar(options.context, prefix, msg); // r = dom2(F, C) || prefix || PH(M)
        const R = G.multiply(r).toRawBytes(); // R = rG
        const k = hashDomainToScalar(options.context, R, pointBytes, msg); // R || A || PH(M)
        const s = modN(r + k * scalar); // S = (r + k * s) mod L
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('signature.s', s, _0n, CURVE_ORDER); // 0 <= s < l
        const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])(R, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(s, Fp.BYTES));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('result', res, Fp.BYTES * 2); // 64-byte signature
    }
    const verifyOpts = VERIFY_DEFAULT;
    /**
     * Verifies EdDSA signature against message and public key. RFC8032 5.1.7.
     * An extended group equation is checked.
     */ function verify(sig, msg, publicKey, options = verifyOpts) {
        const { context, zip215 } = options;
        const len = Fp.BYTES; // Verifies EdDSA signature against message and public key. RFC8032 5.1.7.
        sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('signature', sig, 2 * len); // An extended group equation is checked.
        msg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('message', msg);
        publicKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('publicKey', publicKey, len);
        if (zip215 !== undefined) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abool"])('zip215', zip215);
        if (prehash) msg = prehash(msg); // for ed25519ph, etc
        const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(sig.slice(len, 2 * len));
        let A, R, SB;
        try {
            // zip215=true is good for consensus-critical apps. =false follows RFC8032 / NIST186-5.
            // zip215=true:  0 <= y < MASK (2^256 for ed25519)
            // zip215=false: 0 <= y < P (2^255-19 for ed25519)
            A = Point.fromHex(publicKey, zip215);
            R = Point.fromHex(sig.slice(0, len), zip215);
            SB = G.multiplyUnsafe(s); // 0 <= s < l is done inside
        } catch (error) {
            return false;
        }
        if (!zip215 && A.isSmallOrder()) return false;
        const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
        const RkA = R.add(A.multiplyUnsafe(k));
        // Extended group equation
        // [8][S]B = [8]R + [8][k]A'
        return RkA.subtract(SB).clearCofactor().equals(Point.ZERO);
    }
    G._setWindowSize(8); // Enable precomputes. Slows down first publicKey computation by 20ms.
    const utils = {
        getExtendedPublicKey,
        /** ed25519 priv keys are uniform 32b. No need to check for modulo bias, like in secp256k1. */ randomPrivateKey: ()=>randomBytes(Fp.BYTES),
        /**
         * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
         * values. This slows down first getPublicKey() by milliseconds (see Speed section),
         * but allows to speed-up subsequent getPublicKey() calls up to 20x.
         * @param windowSize 2, 4, 8, 16
         */ precompute (windowSize = 8, point = Point.BASE) {
            point._setWindowSize(windowSize);
            point.multiply(BigInt(3));
            return point;
        }
    };
    return {
        CURVE,
        getPublicKey,
        sign,
        verify,
        ExtendedPoint: Point,
        utils
    };
} //# sourceMappingURL=edwards.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/montgomery.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "montgomery",
    ()=>montgomery
]);
/**
 * Montgomery curve methods. It's not really whole montgomery curve,
 * just bunch of very specific methods for X25519 / X448 from
 * [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748)
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
const _0n = BigInt(0);
const _1n = BigInt(1);
function validateOpts(curve) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateObject"])(curve, {
        a: 'bigint'
    }, {
        montgomeryBits: 'isSafeInteger',
        nByteLength: 'isSafeInteger',
        adjustScalarBytes: 'function',
        domain: 'function',
        powPminus2: 'function',
        Gu: 'bigint'
    });
    // Set defaults
    return Object.freeze({
        ...curve
    });
}
function montgomery(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { P } = CURVE;
    const Fp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(P);
    const modP = (n)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(n, P);
    const montgomeryBits = CURVE.montgomeryBits;
    const montgomeryBytes = Math.ceil(montgomeryBits / 8);
    const fieldLen = CURVE.nByteLength;
    const adjustScalarBytes = CURVE.adjustScalarBytes || ((bytes)=>bytes);
    const powPminus2 = CURVE.powPminus2 || ((x)=>Fp.pow(x, P - BigInt(2)));
    // cswap from RFC7748. But it is not from RFC7748!
    /*
      cswap(swap, x_2, x_3):
           dummy = mask(swap) AND (x_2 XOR x_3)
           x_2 = x_2 XOR dummy
           x_3 = x_3 XOR dummy
           Return (x_2, x_3)
    Where mask(swap) is the all-1 or all-0 word of the same length as x_2
     and x_3, computed, e.g., as mask(swap) = 0 - swap.
    */ function cswap(swap, x_2, x_3) {
        const dummy = modP(swap * (x_2 - x_3));
        x_2 = modP(x_2 - dummy);
        x_3 = modP(x_3 + dummy);
        return [
            x_2,
            x_3
        ];
    }
    // x25519 from 4
    // The constant a24 is (486662 - 2) / 4 = 121665 for curve25519/X25519
    const a24 = (CURVE.a - BigInt(2)) / BigInt(4);
    /**
     *
     * @param pointU u coordinate (x) on Montgomery Curve 25519
     * @param scalar by which the point would be multiplied
     * @returns new Point on Montgomery curve
     */ function montgomeryLadder(u, scalar) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('u', u, _0n, P);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aInRange"])('scalar', scalar, _0n, P);
        // Section 5: Implementations MUST accept non-canonical values and process them as
        // if they had been reduced modulo the field prime.
        const k = scalar;
        const x_1 = u;
        let x_2 = _1n;
        let z_2 = _0n;
        let x_3 = u;
        let z_3 = _1n;
        let swap = _0n;
        let sw;
        for(let t = BigInt(montgomeryBits - 1); t >= _0n; t--){
            const k_t = k >> t & _1n;
            swap ^= k_t;
            sw = cswap(swap, x_2, x_3);
            x_2 = sw[0];
            x_3 = sw[1];
            sw = cswap(swap, z_2, z_3);
            z_2 = sw[0];
            z_3 = sw[1];
            swap = k_t;
            const A = x_2 + z_2;
            const AA = modP(A * A);
            const B = x_2 - z_2;
            const BB = modP(B * B);
            const E = AA - BB;
            const C = x_3 + z_3;
            const D = x_3 - z_3;
            const DA = modP(D * A);
            const CB = modP(C * B);
            const dacb = DA + CB;
            const da_cb = DA - CB;
            x_3 = modP(dacb * dacb);
            z_3 = modP(x_1 * modP(da_cb * da_cb));
            x_2 = modP(AA * BB);
            z_2 = modP(E * (AA + modP(a24 * E)));
        }
        // (x_2, x_3) = cswap(swap, x_2, x_3)
        sw = cswap(swap, x_2, x_3);
        x_2 = sw[0];
        x_3 = sw[1];
        // (z_2, z_3) = cswap(swap, z_2, z_3)
        sw = cswap(swap, z_2, z_3);
        z_2 = sw[0];
        z_3 = sw[1];
        // z_2^(p - 2)
        const z2 = powPminus2(z_2);
        // Return x_2 * (z_2^(p - 2))
        return modP(x_2 * z2);
    }
    function encodeUCoordinate(u) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(modP(u), montgomeryBytes);
    }
    function decodeUCoordinate(uEnc) {
        // Section 5: When receiving such an array, implementations of X25519
        // MUST mask the most significant bit in the final byte.
        const u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('u coordinate', uEnc, montgomeryBytes);
        if (fieldLen === 32) u[31] &= 127; // 0b0111_1111
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(u);
    }
    function decodeScalar(n) {
        const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('scalar', n);
        const len = bytes.length;
        if (len !== montgomeryBytes && len !== fieldLen) {
            let valid = '' + montgomeryBytes + ' or ' + fieldLen;
            throw new Error('invalid scalar, expected ' + valid + ' bytes, got ' + len);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(adjustScalarBytes(bytes));
    }
    function scalarMult(scalar, u) {
        const pointU = decodeUCoordinate(u);
        const _scalar = decodeScalar(scalar);
        const pu = montgomeryLadder(pointU, _scalar);
        // The result was not contributory
        // https://cr.yp.to/ecdh.html#validate
        if (pu === _0n) throw new Error('invalid private or public key received');
        return encodeUCoordinate(pu);
    }
    // Computes public key from private. By doing scalar multiplication of base point.
    const GuBytes = encodeUCoordinate(CURVE.Gu);
    function scalarMultBase(scalar) {
        return scalarMult(scalar, GuBytes);
    }
    return {
        scalarMult,
        scalarMultBase,
        getSharedSecret: (privateKey, publicKey)=>scalarMult(privateKey, publicKey),
        getPublicKey: (privateKey)=>scalarMultBase(privateKey),
        utils: {
            randomPrivateKey: ()=>CURVE.randomBytes(CURVE.nByteLength)
        },
        GuBytes: GuBytes
    };
} //# sourceMappingURL=montgomery.js.map
}),
"[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/ed25519.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ED25519_TORSION_SUBGROUP",
    ()=>ED25519_TORSION_SUBGROUP,
    "RistrettoPoint",
    ()=>RistrettoPoint,
    "ed25519",
    ()=>ed25519,
    "ed25519_hasher",
    ()=>ed25519_hasher,
    "ed25519ctx",
    ()=>ed25519ctx,
    "ed25519ph",
    ()=>ed25519ph,
    "edwardsToMontgomery",
    ()=>edwardsToMontgomery,
    "edwardsToMontgomeryPriv",
    ()=>edwardsToMontgomeryPriv,
    "edwardsToMontgomeryPub",
    ()=>edwardsToMontgomeryPub,
    "encodeToCurve",
    ()=>encodeToCurve,
    "hashToCurve",
    ()=>hashToCurve,
    "hashToRistretto255",
    ()=>hashToRistretto255,
    "hash_to_ristretto255",
    ()=>hash_to_ristretto255,
    "x25519",
    ()=>x25519
]);
/**
 * ed25519 Twisted Edwards curve with following addons:
 * - X25519 ECDH
 * - Ristretto cofactor elimination
 * - Elligator hash-to-group / point indistinguishability
 * @module
 */ /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/sha2.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/curve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$edwards$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/edwards.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/hash-to-curve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/modular.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$montgomery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/montgomery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/crypto/node_modules/@noble/curves/esm/abstract/utils.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
// 2n**255n - 19n
const ED25519_P = BigInt('57896044618658097711785492504343953926634992332820282019728792003956564819949');
// √(-1) aka √(a) aka 2^((p-1)/4)
// Fp.sqrt(Fp.neg(1))
const ED25519_SQRT_M1 = /* @__PURE__ */ BigInt('19681161376707505956807079304988542015446066515923890162744021073123829784752');
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3);
// prettier-ignore
const _5n = BigInt(5), _8n = BigInt(8);
function ed25519_pow_2_252_3(x) {
    // prettier-ignore
    const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
    const P = ED25519_P;
    const x2 = x * x % P;
    const b2 = x2 * x % P; // x^3, 11
    const b4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b2, _2n, P) * b2 % P; // x^15, 1111
    const b5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b4, _1n, P) * x % P; // x^31
    const b10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b5, _5n, P) * b5 % P;
    const b20 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b10, _10n, P) * b10 % P;
    const b40 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b20, _20n, P) * b20 % P;
    const b80 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b40, _40n, P) * b40 % P;
    const b160 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b80, _80n, P) * b80 % P;
    const b240 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b160, _80n, P) * b80 % P;
    const b250 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b240, _10n, P) * b10 % P;
    const pow_p_5_8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(b250, _2n, P) * x % P;
    // ^ To pow to (p+3)/8, multiply it by x.
    return {
        pow_p_5_8,
        b2
    };
}
function adjustScalarBytes(bytes) {
    // Section 5: For X25519, in order to decode 32 random bytes as an integer scalar,
    // set the three least significant bits of the first byte
    bytes[0] &= 248; // 0b1111_1000
    // and the most significant bit of the last to zero,
    bytes[31] &= 127; // 0b0111_1111
    // set the second most significant bit of the last byte to 1
    bytes[31] |= 64; // 0b0100_0000
    return bytes;
}
// sqrt(u/v)
function uvRatio(u, v) {
    const P = ED25519_P;
    const v3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(v * v * v, P); // v³
    const v7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(v3 * v3 * v, P); // v⁷
    // (p+3)/8 and (p-5)/8
    const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
    let x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(u * v3 * pow, P); // (uv³)(uv⁷)^(p-5)/8
    const vx2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(v * x * x, P); // vx²
    const root1 = x; // First root candidate
    const root2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(x * ED25519_SQRT_M1, P); // Second root candidate
    const useRoot1 = vx2 === u; // If vx² = u (mod p), x is a square root
    const useRoot2 = vx2 === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(-u, P); // If vx² = -u, set x <-- x * 2^((p-1)/4)
    const noRoot = vx2 === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(-u * ED25519_SQRT_M1, P); // There is no valid root, vx² = -u√(-1)
    if (useRoot1) x = root1;
    if (useRoot2 || noRoot) x = root2; // We return root2 anyway, for const-time
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(x, P)) x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])(-x, P);
    return {
        isValid: useRoot1 || useRoot2,
        value: x
    };
}
const ED25519_TORSION_SUBGROUP = [
    '0100000000000000000000000000000000000000000000000000000000000000',
    'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a',
    '0000000000000000000000000000000000000000000000000000000000000080',
    '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05',
    'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
    '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85',
    '0000000000000000000000000000000000000000000000000000000000000000',
    'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa'
];
const Fp = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(ED25519_P, undefined, true))();
const ed25519Defaults = /* @__PURE__ */ (()=>({
        // Removing Fp.create() will still work, and is 10% faster on sign
        a: Fp.create(BigInt(-1)),
        // d is -121665/121666 a.k.a. Fp.neg(121665 * Fp.inv(121666))
        d: BigInt('37095705934669439343138083508754565189542113879843219016388785533085940283555'),
        // Finite field 2n**255n - 19n
        Fp,
        // Subgroup order 2n**252n + 27742317777372353535851937790883648493n;
        n: BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989'),
        h: _8n,
        Gx: BigInt('15112221349535400772501151409588531511454012693041857206046113283949847762202'),
        Gy: BigInt('46316835694926478169428394003475163141307993866256225615783033603165251855960'),
        hash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha512"],
        randomBytes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomBytes"],
        adjustScalarBytes,
        // dom2
        // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
        // Constant-time, u/√v
        uvRatio
    }))();
const ed25519 = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$edwards$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twistedEdwards"])(ed25519Defaults))();
function ed25519_domain(data, ctx, phflag) {
    if (ctx.length > 255) throw new Error('Context is too big');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatBytes"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])('SigEd25519 no Ed25519 collisions'), new Uint8Array([
        phflag ? 1 : 0,
        ctx.length
    ]), ctx, data);
}
const ed25519ctx = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$edwards$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twistedEdwards"])({
        ...ed25519Defaults,
        domain: ed25519_domain
    }))();
const ed25519ph = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$edwards$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twistedEdwards"])(Object.assign({}, ed25519Defaults, {
        domain: ed25519_domain,
        prehash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha512"]
    })))();
const x25519 = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$montgomery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["montgomery"])({
        P: ED25519_P,
        a: BigInt(486662),
        montgomeryBits: 255,
        nByteLength: 32,
        Gu: BigInt(9),
        powPminus2: (x)=>{
            const P = ED25519_P;
            // x^(p-2) aka x^(2^255-21)
            const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mod"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pow2"])(pow_p_5_8, _3n, P) * b2, P);
        },
        adjustScalarBytes,
        randomBytes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomBytes"]
    }))();
function edwardsToMontgomeryPub(edwardsPub) {
    const { y } = ed25519.ExtendedPoint.fromHex(edwardsPub);
    const _1n = BigInt(1);
    return Fp.toBytes(Fp.create((_1n + y) * Fp.inv(_1n - y)));
}
const edwardsToMontgomery = edwardsToMontgomeryPub; // deprecated
function edwardsToMontgomeryPriv(edwardsPriv) {
    const hashed = ed25519Defaults.hash(edwardsPriv.subarray(0, 32));
    return ed25519Defaults.adjustScalarBytes(hashed).subarray(0, 32);
}
// Hash To Curve Elligator2 Map (NOTE: different from ristretto255 elligator)
// NOTE: very important part is usage of FpSqrtEven for ELL2_C1_EDWARDS, since
// SageMath returns different root first and everything falls apart
const ELL2_C1 = /* @__PURE__ */ (()=>(Fp.ORDER + _3n) / _8n)(); // 1. c1 = (q + 3) / 8       # Integer arithmetic
const ELL2_C2 = /* @__PURE__ */ (()=>Fp.pow(_2n, ELL2_C1))(); // 2. c2 = 2^c1
const ELL2_C3 = /* @__PURE__ */ (()=>Fp.sqrt(Fp.neg(Fp.ONE)))(); // 3. c3 = sqrt(-1)
// prettier-ignore
function map_to_curve_elligator2_curve25519(u) {
    const ELL2_C4 = (Fp.ORDER - _5n) / _8n; // 4. c4 = (q - 5) / 8       # Integer arithmetic
    const ELL2_J = BigInt(486662);
    let tv1 = Fp.sqr(u); //  1.  tv1 = u^2
    tv1 = Fp.mul(tv1, _2n); //  2.  tv1 = 2 * tv1
    let xd = Fp.add(tv1, Fp.ONE); //  3.   xd = tv1 + 1         # Nonzero: -1 is square (mod p), tv1 is not
    let x1n = Fp.neg(ELL2_J); //  4.  x1n = -J              # x1 = x1n / xd = -J / (1 + 2 * u^2)
    let tv2 = Fp.sqr(xd); //  5.  tv2 = xd^2
    let gxd = Fp.mul(tv2, xd); //  6.  gxd = tv2 * xd        # gxd = xd^3
    let gx1 = Fp.mul(tv1, ELL2_J); //  7.  gx1 = J * tv1         # x1n + J * xd
    gx1 = Fp.mul(gx1, x1n); //  8.  gx1 = gx1 * x1n       # x1n^2 + J * x1n * xd
    gx1 = Fp.add(gx1, tv2); //  9.  gx1 = gx1 + tv2       # x1n^2 + J * x1n * xd + xd^2
    gx1 = Fp.mul(gx1, x1n); //  10. gx1 = gx1 * x1n       # x1n^3 + J * x1n^2 * xd + x1n * xd^2
    let tv3 = Fp.sqr(gxd); //  11. tv3 = gxd^2
    tv2 = Fp.sqr(tv3); //  12. tv2 = tv3^2           # gxd^4
    tv3 = Fp.mul(tv3, gxd); //  13. tv3 = tv3 * gxd       # gxd^3
    tv3 = Fp.mul(tv3, gx1); //  14. tv3 = tv3 * gx1       # gx1 * gxd^3
    tv2 = Fp.mul(tv2, tv3); //  15. tv2 = tv2 * tv3       # gx1 * gxd^7
    let y11 = Fp.pow(tv2, ELL2_C4); //  16. y11 = tv2^c4        # (gx1 * gxd^7)^((p - 5) / 8)
    y11 = Fp.mul(y11, tv3); //  17. y11 = y11 * tv3       # gx1*gxd^3*(gx1*gxd^7)^((p-5)/8)
    let y12 = Fp.mul(y11, ELL2_C3); //  18. y12 = y11 * c3
    tv2 = Fp.sqr(y11); //  19. tv2 = y11^2
    tv2 = Fp.mul(tv2, gxd); //  20. tv2 = tv2 * gxd
    let e1 = Fp.eql(tv2, gx1); //  21.  e1 = tv2 == gx1
    let y1 = Fp.cmov(y12, y11, e1); //  22.  y1 = CMOV(y12, y11, e1)  # If g(x1) is square, this is its sqrt
    let x2n = Fp.mul(x1n, tv1); //  23. x2n = x1n * tv1       # x2 = x2n / xd = 2 * u^2 * x1n / xd
    let y21 = Fp.mul(y11, u); //  24. y21 = y11 * u
    y21 = Fp.mul(y21, ELL2_C2); //  25. y21 = y21 * c2
    let y22 = Fp.mul(y21, ELL2_C3); //  26. y22 = y21 * c3
    let gx2 = Fp.mul(gx1, tv1); //  27. gx2 = gx1 * tv1       # g(x2) = gx2 / gxd = 2 * u^2 * g(x1)
    tv2 = Fp.sqr(y21); //  28. tv2 = y21^2
    tv2 = Fp.mul(tv2, gxd); //  29. tv2 = tv2 * gxd
    let e2 = Fp.eql(tv2, gx2); //  30.  e2 = tv2 == gx2
    let y2 = Fp.cmov(y22, y21, e2); //  31.  y2 = CMOV(y22, y21, e2)  # If g(x2) is square, this is its sqrt
    tv2 = Fp.sqr(y1); //  32. tv2 = y1^2
    tv2 = Fp.mul(tv2, gxd); //  33. tv2 = tv2 * gxd
    let e3 = Fp.eql(tv2, gx1); //  34.  e3 = tv2 == gx1
    let xn = Fp.cmov(x2n, x1n, e3); //  35.  xn = CMOV(x2n, x1n, e3)  # If e3, x = x1, else x = x2
    let y = Fp.cmov(y2, y1, e3); //  36.   y = CMOV(y2, y1, e3)    # If e3, y = y1, else y = y2
    let e4 = Fp.isOdd(y); //  37.  e4 = sgn0(y) == 1        # Fix sign of y
    y = Fp.cmov(y, Fp.neg(y), e3 !== e4); //  38.   y = CMOV(y, -y, e3 XOR e4)
    return {
        xMn: xn,
        xMd: xd,
        yMn: y,
        yMd: _1n
    }; //  39. return (xn, xd, y, 1)
}
const ELL2_C1_EDWARDS = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FpSqrtEven"])(Fp, Fp.neg(BigInt(486664))))(); // sgn0(c1) MUST equal 0
function map_to_curve_elligator2_edwards25519(u) {
    const { xMn, xMd, yMn, yMd } = map_to_curve_elligator2_curve25519(u); //  1.  (xMn, xMd, yMn, yMd) =
    // map_to_curve_elligator2_curve25519(u)
    let xn = Fp.mul(xMn, yMd); //  2.  xn = xMn * yMd
    xn = Fp.mul(xn, ELL2_C1_EDWARDS); //  3.  xn = xn * c1
    let xd = Fp.mul(xMd, yMn); //  4.  xd = xMd * yMn    # xn / xd = c1 * xM / yM
    let yn = Fp.sub(xMn, xMd); //  5.  yn = xMn - xMd
    let yd = Fp.add(xMn, xMd); //  6.  yd = xMn + xMd    # (n / d - 1) / (n / d + 1) = (n - d) / (n + d)
    let tv1 = Fp.mul(xd, yd); //  7. tv1 = xd * yd
    let e = Fp.eql(tv1, Fp.ZERO); //  8.   e = tv1 == 0
    xn = Fp.cmov(xn, Fp.ZERO, e); //  9.  xn = CMOV(xn, 0, e)
    xd = Fp.cmov(xd, Fp.ONE, e); //  10. xd = CMOV(xd, 1, e)
    yn = Fp.cmov(yn, Fp.ONE, e); //  11. yn = CMOV(yn, 1, e)
    yd = Fp.cmov(yd, Fp.ONE, e); //  12. yd = CMOV(yd, 1, e)
    const [xd_inv, yd_inv] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FpInvertBatch"])(Fp, [
        xd,
        yd
    ], true); // batch division
    return {
        x: Fp.mul(xn, xd_inv),
        y: Fp.mul(yn, yd_inv)
    }; //  13. return (xn, xd, yn, yd)
}
const ed25519_hasher = /* @__PURE__ */ (()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHasher"])(ed25519.ExtendedPoint, (scalars)=>map_to_curve_elligator2_edwards25519(scalars[0]), {
        DST: 'edwards25519_XMD:SHA-512_ELL2_RO_',
        encodeDST: 'edwards25519_XMD:SHA-512_ELL2_NU_',
        p: Fp.ORDER,
        m: 1,
        k: 128,
        expand: 'xmd',
        hash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha512"]
    }))();
const hashToCurve = /* @__PURE__ */ (()=>ed25519_hasher.hashToCurve)();
const encodeToCurve = /* @__PURE__ */ (()=>ed25519_hasher.encodeToCurve)();
function aristp(other) {
    if (!(other instanceof RistPoint)) throw new Error('RistrettoPoint expected');
}
// √(-1) aka √(a) aka 2^((p-1)/4)
const SQRT_M1 = ED25519_SQRT_M1;
// √(ad - 1)
const SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt('25063068953384623474111414158702152701244531502492656460079210482610430750235');
// 1 / √(a-d)
const INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt('54469307008909316920995813868745141605393597292927456921205312896311721017578');
// 1-d²
const ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt('1159843021668779879193775521855586647937357759715417654439879720876111806838');
// (d-1)²
const D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt('40440834346308536858101042469323190826248399146238708352240133220865137265952');
// Calculates 1/√(number)
const invertSqrt = (number)=>uvRatio(_1n, number);
const MAX_255B = /* @__PURE__ */ BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
const bytes255ToNumberLE = (bytes)=>ed25519.CURVE.Fp.create((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToNumberLE"])(bytes) & MAX_255B);
// Computes Elligator map for Ristretto
// https://ristretto.group/formulas/elligator.html
function calcElligatorRistrettoMap(r0) {
    const { d } = ed25519.CURVE;
    const P = ed25519.CURVE.Fp.ORDER;
    const mod = ed25519.CURVE.Fp.create;
    const r = mod(SQRT_M1 * r0 * r0); // 1
    const Ns = mod((r + _1n) * ONE_MINUS_D_SQ); // 2
    let c = BigInt(-1); // 3
    const D = mod((c - d * r) * mod(r + d)); // 4
    let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D); // 5
    let s_ = mod(s * r0); // 6
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(s_, P)) s_ = mod(-s_);
    if (!Ns_D_is_sq) s = s_; // 7
    if (!Ns_D_is_sq) c = r; // 8
    const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D); // 9
    const s2 = s * s;
    const W0 = mod((s + s) * D); // 10
    const W1 = mod(Nt * SQRT_AD_MINUS_ONE); // 11
    const W2 = mod(_1n - s2); // 12
    const W3 = mod(_1n + s2); // 13
    return new ed25519.ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
}
/**
 * Each ed25519/ExtendedPoint has 8 different equivalent points. This can be
 * a source of bugs for protocols like ring signatures. Ristretto was created to solve this.
 * Ristretto point operates in X:Y:Z:T extended coordinates like ExtendedPoint,
 * but it should work in its own namespace: do not combine those two.
 * https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-ristretto255-decaf448
 */ class RistPoint {
    // Private property to discourage combining ExtendedPoint + RistrettoPoint
    // Always use Ristretto encoding/decoding instead.
    constructor(ep){
        this.ep = ep;
    }
    static fromAffine(ap) {
        return new RistPoint(ed25519.ExtendedPoint.fromAffine(ap));
    }
    /**
     * Takes uniform output of 64-byte hash function like sha512 and converts it to `RistrettoPoint`.
     * The hash-to-group operation applies Elligator twice and adds the results.
     * **Note:** this is one-way map, there is no conversion from point to hash.
     * https://ristretto.group/formulas/elligator.html
     * @param hex 64-byte output of a hash function
     */ static hashToCurve(hex) {
        hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('ristrettoHash', hex, 64);
        const r1 = bytes255ToNumberLE(hex.slice(0, 32));
        const R1 = calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(hex.slice(32, 64));
        const R2 = calcElligatorRistrettoMap(r2);
        return new RistPoint(R1.add(R2));
    }
    /**
     * Converts ristretto-encoded string to ristretto point.
     * https://ristretto.group/formulas/decoding.html
     * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
     */ static fromHex(hex) {
        hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureBytes"])('ristrettoHex', hex, 32);
        const { a, d } = ed25519.CURVE;
        const P = ed25519.CURVE.Fp.ORDER;
        const mod = ed25519.CURVE.Fp.create;
        const emsg = 'RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint';
        const s = bytes255ToNumberLE(hex);
        // 1. Check that s_bytes is the canonical encoding of a field element, or else abort.
        // 3. Check that s is non-negative, or else abort
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["equalBytes"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(s, 32), hex) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(s, P)) throw new Error(emsg);
        const s2 = mod(s * s);
        const u1 = mod(_1n + a * s2); // 4 (a is -1)
        const u2 = mod(_1n - a * s2); // 5
        const u1_2 = mod(u1 * u1);
        const u2_2 = mod(u2 * u2);
        const v = mod(a * d * u1_2 - u2_2); // 6
        const { isValid, value: I } = invertSqrt(mod(v * u2_2)); // 7
        const Dx = mod(I * u2); // 8
        const Dy = mod(I * Dx * v); // 9
        let x = mod((s + s) * Dx); // 10
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(x, P)) x = mod(-x); // 10
        const y = mod(u1 * Dy); // 11
        const t = mod(x * y); // 12
        if (!isValid || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(t, P) || y === _0n) throw new Error(emsg);
        return new RistPoint(new ed25519.ExtendedPoint(x, y, _1n, t));
    }
    static msm(points, scalars) {
        const Fn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"])(ed25519.CURVE.n, ed25519.CURVE.nBitLength);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pippenger"])(RistPoint, Fn, points, scalars);
    }
    /**
     * Encodes ristretto point to Uint8Array.
     * https://ristretto.group/formulas/encoding.html
     */ toRawBytes() {
        let { ex: x, ey: y, ez: z, et: t } = this.ep;
        const P = ed25519.CURVE.Fp.ORDER;
        const mod = ed25519.CURVE.Fp.create;
        const u1 = mod(mod(z + y) * mod(z - y)); // 1
        const u2 = mod(x * y); // 2
        // Square root always exists
        const u2sq = mod(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod(u1 * u2sq)); // 3
        const D1 = mod(invsqrt * u1); // 4
        const D2 = mod(invsqrt * u2); // 5
        const zInv = mod(D1 * D2 * t); // 6
        let D; // 7
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(t * zInv, P)) {
            let _x = mod(y * SQRT_M1);
            let _y = mod(x * SQRT_M1);
            x = _x;
            y = _y;
            D = mod(D1 * INVSQRT_A_MINUS_D);
        } else {
            D = D2; // 8
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(x * zInv, P)) y = mod(-y); // 9
        let s = mod((z - y) * D); // 10 (check footer's note, no sqrt(-a))
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$modular$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNegativeLE"])(s, P)) s = mod(-s);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToBytesLE"])(s, 32); // 11
    }
    toHex() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToHex"])(this.toRawBytes());
    }
    toString() {
        return this.toHex();
    }
    // Compare one point to another.
    equals(other) {
        aristp(other);
        const { ex: X1, ey: Y1 } = this.ep;
        const { ex: X2, ey: Y2 } = other.ep;
        const mod = ed25519.CURVE.Fp.create;
        // (x1 * y2 == y1 * x2) | (y1 * y2 == x1 * x2)
        const one = mod(X1 * Y2) === mod(Y1 * X2);
        const two = mod(Y1 * Y2) === mod(X1 * X2);
        return one || two;
    }
    add(other) {
        aristp(other);
        return new RistPoint(this.ep.add(other.ep));
    }
    subtract(other) {
        aristp(other);
        return new RistPoint(this.ep.subtract(other.ep));
    }
    multiply(scalar) {
        return new RistPoint(this.ep.multiply(scalar));
    }
    multiplyUnsafe(scalar) {
        return new RistPoint(this.ep.multiplyUnsafe(scalar));
    }
    double() {
        return new RistPoint(this.ep.double());
    }
    negate() {
        return new RistPoint(this.ep.negate());
    }
}
const RistrettoPoint = /* @__PURE__ */ (()=>{
    if (!RistPoint.BASE) RistPoint.BASE = new RistPoint(ed25519.ExtendedPoint.BASE);
    if (!RistPoint.ZERO) RistPoint.ZERO = new RistPoint(ed25519.ExtendedPoint.ZERO);
    return RistPoint;
})();
const hashToRistretto255 = (msg, options)=>{
    const d = options.DST;
    const DST = typeof d === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])(d) : d;
    const uniform_bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$crypto$2f$node_modules$2f40$noble$2f$curves$2f$esm$2f$abstract$2f$hash$2d$to$2d$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expand_message_xmd"])(msg, DST, 64, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha512"]);
    const P = RistPoint.hashToCurve(uniform_bytes);
    return P;
};
const hash_to_ristretto255 = hashToRistretto255; // legacy
 //# sourceMappingURL=ed25519.js.map
}),
]);

//# sourceMappingURL=0d613_%40noble_curves_esm_0c9853d4._.js.map