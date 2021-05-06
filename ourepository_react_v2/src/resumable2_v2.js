import * as SparkMD5 from 'spark-md5';
import projectApiService from "./services/projectApi";
import mosaicApiService from "./services/mosaicApi";

var mosaics = [];

var paused = [];

var chunkSize = 1 * 1024 * 1024; //5MB

function getUniqueIdentifier(file) {
  var relativePath = file.webkitRelativePath || file.fileName || file.name; // Some confusion in different versions of Firefox
  var size = file.size;

  return (size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
}

function getMd5Hash(file, onFinish) {

  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = function (e) {
    //console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk % 5 == 0) {
      var percent = (currentChunk / chunks) * 100.0;
    }

    if (currentChunk < chunks) {
      //console.log('loaded chunk ' + currentChunk + ' of ' + chunks);
      loadNext();
    } else {
      //console.log('finished loading');
      //console.info('computed hash', spark.end());  // Compute hash

      //reset progress bar for uploading
      var percent = 0.0;

      onFinish(spark.end());
    }
  };

  fileReader.onerror = function () {

  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
}

export function startUpload(mosaicName, file, projectUuid) {
  var identifier = getUniqueIdentifier(file);
  //different versions of firefox have different field names
  var filename = file.webkitRelativePath || file.fileName || file.name;
  file.identifier = identifier;
  paused[identifier] = false;

  var numberChunks = Math.ceil(file.size / chunkSize);

  var mosaicInfo = {};
  mosaicInfo.identifier = identifier;
  mosaicInfo.filename = filename;
  mosaicInfo.uploadedChunks = 0;
  mosaicInfo.numberChunks = numberChunks;
  mosaicInfo.sizeBytes = file.size;
  mosaicInfo.bytesUploaded = 0;
  mosaicInfo.status = 'HASHING';

  function onFinish(md5Hash) {
    file.md5Hash = md5Hash;
    console.log("got md5Hash: '" + md5Hash + "'");

    projectApiService.createMosaic(mosaicName, projectUuid, file, file.name, file.size, md5Hash, numberChunks).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        var mosaicInfo = data.message.mosaicInfo;
        mosaicInfo.file = file; //set the file in the response mosaicInfo so it can be used later
        uploadChunk(mosaicInfo, file);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }

  getMd5Hash(file, onFinish);
}

function uploadChunk(mosaicInfo, file) {
  //store the mosaic info in case the upload needs to be restarted
  mosaics[mosaicInfo.identifier] = mosaicInfo;

  if (paused[mosaicInfo.identifier] === true) return;

  //console.log(response);

  var numberChunks = parseInt(mosaicInfo.numberChunks);
  var filename = mosaicInfo.filename;

  var chunkStatus = mosaicInfo.chunkStatus;
  var chunkNumber = chunkStatus.indexOf("0");
  //console.log("chunk status: '" + chunkStatus + "'");
  console.log("next chunk: " + chunkNumber + " of " + numberChunks);

  var fileReader = new FileReader();

  var startByte = parseInt(chunkNumber) * parseInt(chunkSize);
  var endByte = Math.min(parseInt(startByte) + parseInt(chunkSize), file.size);
  //console.log("startByte: " + startByte + ", endByte: " + endByte + ", chunkSize: " + chunkSize);

  var func = (file.slice ? 'slice' : (file.mozSlice ? 'mozSlice' : (file.webkitSlice ? 'webkitSlice' : 'slice')));
  var bytes = file[func](startByte, endByte, void 0);

  //console.log(bytes);

  mosaicApiService.uploadChunk(chunkNumber, file.identifier, file.md5Hash, bytes).then((response) => {
    const data = response.data;
    if (data.code === "SUCCESS") {
      var mosaicInfo = data.message;
      mosaicInfo["file"] = file; //set the fileObject so we can use it for restarts

      var bytesUploaded = mosaicInfo.bytesUploaded;
      var sizeBytes = mosaicInfo.sizeBytes;

      var percent = (bytesUploaded / sizeBytes) * 100.0;

      var numberChunks = Math.ceil(file.size / chunkSize);
      console.log("uploaded chunk " + chunkNumber + " of " + numberChunks);

      var chunkStatus = mosaicInfo.chunkStatus;
      chunkNumber = chunkStatus.indexOf("0");
      console.log("chunk status: '" + chunkStatus + "'");
      console.log("next chunk: " + chunkNumber);
      //chunkNumber = chunkNumber + 1;

      if (chunkNumber > -1) {
        //console.log("uploading next chunk with response:");
        //console.log(response);

        uploadChunk(mosaicInfo, file);
      } else {

      }
    } else {
      alert(data.message);
    }
  }).catch((err) => {
    console.log(err);
    alert(err);
  });
}

// function ordinal_suffix(n) {
//     var original = n;
//     n = parseInt(n) % 100; // protect against large numbers
//     if (n < 11 || n > 13) {
//         switch(n % 10) {
//             case 1: return original + 'st';
//             case 2: return original + 'nd';
//             case 3: return original + 'rd';
//         }
//     }
//     return original + 'th';
// }
