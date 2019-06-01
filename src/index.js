const {Command, flags} = require('@oclif/command')
const fs = require('fs');
const exec = require('child_process').exec;

class InstadayCommand extends Command {
  async run() {
    const {flags} = this.parse(InstadayCommand);
    const importFile = flags.file || 'media.json';

    this.log('Importing ' + importFile + '...');

    fs.readFile(importFile, 'utf8', (err, data) => {
      if (err) throw err;

      try {
        data = JSON.parse(data)
      } catch(err) {
        console.log('JSON parse error.');
        return;
      }

      var allPhotos = data.photos;

      allPhotos.sort(function(a, b) {
        return getSortValue(a.taken_at) - getSortValue(b.taken_at);
      });

      this.log('Importing ' + allPhotos.length + ' posts');

      var importEntries = [];
      var imageType = 'jpg';
      var postNum = 1;

      exec('mkdir dayone-import && mkdir dayone-import/photos', function (error, stdout, stderr) {
        if (error) {
          console.log('exec error: ' + error);
          return;
        }
      });

      allPhotos.forEach((photo) => {

        // Standard title with date
        var entryText = 'Instagram #' + postNum;
        postNum++;

        // If we have a location, add to the first line of text
        if (photo.location) {
          entryText += ' @ ' + photo.location;
        }

        // Add line breaks to start paragraph formatting
        entryText += "\n\n" + photo.caption;

        // Photo photo
        var photoFileName = photo.path.split('/')[2];

        // Copy the photo to the new Directory
        exec('cp ' + photo.path + ' ./dayone-import/photos/' + photoFileName, function (error, stdout, stderr) {
          if (error) {
            console.log('exec error: ' + error);
            return;
          }
        });

        var newEntry = {
          text: entryText,
          timeZone: 'America\/Los_Angeles',
          creationDate : photo.taken_at + 'Z',
          tags: [ 'Instagram' ],
          photos : [
            {
              type : imageType,
              md5 : photoFileName.replace('.' + imageType, '')
            }
          ]
        }

        importEntries.push(newEntry);
      });

      this.log('Created ' + importEntries.length + ' posts');

      var importJson = {
        metadata : {
          version : "1.0"
        },
        entries : importEntries
      };

      fs.writeFileSync(
        "./dayone-import/Journal-Instagram.json",
        JSON.stringify(
          importJson,
          null,
          2
        )
      );
    });
  }
}

function getSortValue( dateTime ) {
  var sortVal = dateTime.split('T')[0];
  sortVal = sortVal.split('-').join('');
  return parseInt(sortVal, 10);
}

InstadayCommand.description = `
Describe the command here
...
Extra documentation goes here
`;

InstadayCommand.flags = {
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
  file: flags.string({description: 'file to import, media.json default'}),
};

module.exports = InstadayCommand;
