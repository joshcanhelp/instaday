# InstaDay

Create a Day One import file from an Instagram backup.

## Use It

Clone this repo and navigate into the `instaday` folder. Run NPM install:

```bash
$ npm install
```

Login to Instagram and [download your Instagram backup file](https://www.instagram.com/download/request/).

Unzip the file nearby, then import with this command:

```bash
$ nbin/run --file=path/to/instagram/file.json
```

You should end up with a directory you can compress and import to DayOne!

**Note:** This tags all posts with `Instagram` and sets the timezone to Pacific time. Look for the line `var newEntry` to change this. 
