// Copyright (c) 2013, importre. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

'use strict';

//var adb = angular.module('chromeADB', ['base64']);
var adb = angular.module('chromeADB');

//adb.factory('socketService', ['$rootScope', '$q', '$base64', function ($rootScope, $q, $base64) {
adb.factory('socketService', ['$rootScope', '$q', function ($rootScope, $q) {
  /*
  function base64_encode(binary) {
    console.log('hagahahgagah');
    var img = $base64.encode('a syn');
    console.log('hagahahgagah');
    console.log(img);
    return img
  }
  */


  function create() {
    var defer = $q.defer();

    chrome.socket.create('tcp', {}, function (createInfo) {
      if (createInfo.socketId >= 0) {
        $rootScope.$apply(function () {
          defer.resolve(createInfo);
        });
      } else {
        console.log('create error:', createInfo);
      }
    });

    return defer.promise;
  }

  function connect(createInfo, host, port) {
    var defer = $q.defer();

    if (typeof port !== 'number') {
      port = parseInt(port, 10);
    }

    chrome.socket.connect(createInfo.socketId, host, port, function (result) {
      if (result >= 0) {
        $rootScope.$apply(function () {
          defer.resolve(createInfo);
        });
      } else {
        chrome.socket.destroy(createInfo.socketId);
        defer.reject(createInfo);
      }
    });

    return defer.promise;
  }

  function write(createInfo, str) {
    var defer = $q.defer();
    // console.log('service:write:str[ ', str, ' ]');

    stringToArrayBuffer(str, function (bytes) {
      writeBytes(createInfo, bytes)
        .then(function (createInfo) {
          defer.resolve(createInfo);
        });
    });

    return defer.promise;
  }

  function writeBytes(createInfo, bytes) {
    var defer = $q.defer();
    chrome.socket.write(createInfo.socketId, bytes, function (writeInfo) {
      if (writeInfo.bytesWritten > 0) {
        $rootScope.$apply(function () {
          var param = {
            createInfo: createInfo,
            writeInfo: writeInfo
          };
          defer.resolve(param);
        });
      } else {
        console.log('write error:', writeInfo.bytesWritten);
        defer.reject(writeInfo);
      }
    });

    return defer.promise;
  }

  function read(createInfo, size) {
    var defer = $q.defer();

    chrome.socket.read(createInfo.socketId, size, function (readInfo) {
      if (readInfo.resultCode > 0) {
        // console.log(readInfo);
        arrayBufferToString(readInfo.data, function (str) {
          $rootScope.$apply(function () {
            var param = {
              createInfo: createInfo,
              data: str
            };
            defer.resolve(param);
          });
        });
      } else {
        defer.reject(readInfo);
      }
    });

    return defer.promise;
  }

  function readAll(createInfo, stringConverter) {
    var defer = $q.defer();
    var data = '';

    (function readAllData() {
      chrome.socket.read(createInfo.socketId, 1024, function (readInfo) {
        if (readInfo.resultCode > 0) {
          stringConverter(readInfo.data, function (str) {
            data += str;
            readAllData();
          });
        } else {
          $rootScope.$apply(function () {
            var param = {
              createInfo: createInfo,
              data: data
            };
            defer.resolve(param);
          });
        }
      });
    })();

    return defer.promise;
  }

  function readPng(createInfo) {
    var defer = $q.defer();
    var data = [];
    var blob, url, binary, arraybuffer;

    (function readAllData() {
      chrome.socket.read(createInfo.socketId, 4096, function (readInfo) {
        if (readInfo.resultCode > 0) {
          var str = ab2str(readInfo.data);
          //binary = str.replace(/\r\n/g, "\n");
          //var buf = str2ab(binary);
          //data.push(buf);
          data.push(str);
          readAllData();
        } else {
          var string = data.join('');
          binary = string.replace(/\r\n/g, "\n");
          var buf = str2ab(binary);
          $rootScope.$apply(function () {
            //blob = new Blob(data, {type: "image/png"});
            blob = new Blob([buf], {type: "image/png"});
            url = window.URL.createObjectURL(blob);
            var param = {
              createInfo: createInfo,
              data: url
            };
            defer.resolve(param);
          });
        }
      });
    })();

    return defer.promise;

  }

  return {
    create: create,
    connect: connect,
    write: write,
    writeBytes: writeBytes,
    read: read,
    readAll: readAll,
    readPng: readPng
  };
}]);
