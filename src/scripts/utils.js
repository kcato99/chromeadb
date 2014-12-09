// Copyright (c) 2013, importre. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

'use strict';
/* exported arrayBufferToString */
/* exported arrayBufferToBinaryString */
/* exported stringToArrayBuffer */
/* exported newZeroArray */
/* exported getChartId */
/* exported integerToArrayBuffer */

/**
 * Converts ArrayBuffer to string.
 *
 * @param buf
 * @param callback
 */
function arrayBufferToString(buf, callback) {
  var b = new Blob([new Uint8Array(buf)]);
  var f = new FileReader();
  f.onload = function (e) {
    callback(e.target.result);
  };
  f.readAsText(b);
}

function arrayBufferToBinaryString(buf, callback) {
  var b = new Blob(buf);
  var f = new FileReader();
  f.onload = function (e) {
    callback(e.target.result);
  };
  f.readAsBinaryString(b);
}


/**
 * Converts string to ArrayBuffer.
 *
 * @param buf
 * @param callback
 */
function stringToArrayBuffer(str, callback) {
  var b = new Blob([str]);
  var f = new FileReader();
  f.onload = function (e) {
    callback(e.target.result);
  };
  f.readAsArrayBuffer(b);
}

function newZeroArray(size) {
  var arr = new Array(size);
  for (var i = 0; i < size; i++) {
    arr[i] = 0;
  }
  return arr;
}

function getChartId(idx) {
  switch (idx) {
    case 0:
      return 'heap_native_chart';
    case 1:
      return 'heap_dalvik_chart';
  }
  return null;
}

function integerToArrayBuffer(value) {
  var result = new Uint32Array(1);
  result[0] = value;
  return result;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
