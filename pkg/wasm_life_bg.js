import * as wasm from './wasm_life_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
*/
export const Cell = Object.freeze({ Dead:0,"0":"Dead",Alive:1,"1":"Alive", });
/**
*/
export class World {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(World.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_world_free(ptr);
    }
    /**
    * @param {number} width
    * @param {number} height
    * @returns {World}
    */
    static new(width, height) {
        _assertNum(width);
        _assertNum(height);
        const ret = wasm.world_new(width, height);
        return World.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    width() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.world_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    height() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.world_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    cells() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.world_cells(this.ptr);
        return ret;
    }
    /**
    * @param {number} width
    * @param {number} height
    */
    set_size(width, height) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(width);
        _assertNum(height);
        wasm.world_set_size(this.ptr, width, height);
    }
    /**
    * panics if row or col is out of range
    * @param {number} row
    * @param {number} col
    */
    toggle_cell(row, col) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(row);
        _assertNum(col);
        wasm.world_toggle_cell(this.ptr, row, col);
    }
    /**
    * @param {number} row
    * @param {number} col
    */
    spawn_ship(row, col) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(row);
        _assertNum(col);
        wasm.world_spawn_ship(this.ptr, row, col);
    }
    /**
    */
    clear() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.world_clear(this.ptr);
    }
    /**
    */
    tick() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.world_tick(this.ptr);
    }
    /**
    * @returns {string}
    */
    render() {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertNum(this.ptr);
            wasm.world_render(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}

export function __wbg_crypto_e1d53a1d73fb10b8() { return logError(function (arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_msCrypto_6e7d3e1f92610cbb() { return logError(function (arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getRandomValues_805f1c3d65988a5a() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

export function __wbg_randomFillSync_6894564c2c334c42() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_require_78a3dcfbdba9cbce() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_process_038c26bf42b093f8() { return logError(function (arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_versions_ab37218d2f0b24a8() { return logError(function (arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_node_080f4b19d15bc1fe() { return logError(function (arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    _assertBoolean(ret);
    return ret;
};

export function __wbg_newnoargs_b5b063fc6c2f0376() { return logError(function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_97ae9d8645dc388b() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_168da88779e35f61() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_7f206bda628d5286() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_self_6d479506f72c6a71() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_f2557cc78490aceb() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_ba75c50d1cf384f4() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_8c3f0052272a457a() { return logError(function (arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_newwithlength_f5933855e4f48a19() { return logError(function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
}, arguments) };

export function __wbg_subarray_58ad4efbb5bcb886() { return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
}, arguments) };

export function __wbg_length_9e1ae1900cb0fbd5() { return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_set_83db9690f9353e79() { return logError(function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}, arguments) };

export function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_buffer_3f3d764d4747d564() { return logError(function (arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_error_f851667af71bcfc6() { return logError(function (arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
}, arguments) };

export function __wbg_new_abda76e883ba8a5f() { return logError(function () {
    const ret = new Error();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_stack_658279fe44541cf6() { return logError(function (arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

