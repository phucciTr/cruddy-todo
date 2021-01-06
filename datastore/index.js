const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw err;
    } else {
      let filename = path.join(exports.dataDir, id.toString() + '.txt');

      fs.writeFile(filename, text, (err) => {
        if (err) {
          throw ('error writing todo');
        } else {
          items[id] = text;
          callback(null, { id, text });
        }

      });
    }
  });
};

exports.readAll = (callback) => {
  var data = [];

  fs.readdir(exports.dataDir, (err, files) => {
    _.each(files, file => {
      var id = file.split('.')[0];
      data.push({id, text: id });
    });
    callback(null, data);
  });

};

exports.readOne = (id, callback) => {

  let todoPath = path.join(exports.dataDir, id.toString() + '.txt');
  fs.readFile(todoPath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  let todoPath = path.join(exports.dataDir, id.toString() + '.txt');

  if (fs.existsSync(todoPath)) {
    fs.writeFile(todoPath, text, (err) => {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null, { id, text });
      }
    });

  } else {
    callback('non existent id');
  }
};

exports.delete = (id, callback) => {
  let todoPath = path.join(exports.dataDir, id.toString() + '.txt');

  if (fs.existsSync(todoPath)) {
    fs.unlink(todoPath, (err) => {
      if (err) {
        callback(new Error(`Cannot delete item with id: ${id}`));
      } else {
        callback(`Deleted item with id: ${id}`);
      }
    });

  } else {
    callback('non existent id');
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
