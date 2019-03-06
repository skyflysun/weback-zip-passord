
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');



class webpack_zip{
  constructor(obj,options){
    this.options = Object.assign(
      {
        output: './www',
        entry:  './www',
        password: '',
        exclude: [],
        name: '',
      },
      options
    );
    this.cmdStr = 'zip -x "*.DS_Store" ';
    this.filesNames = this.findFileName();
    this.exCludeFile();
    this.encryption();
    this.renameAndOutput();
    this.entryName();
    this.executeShell();
  }


  getTime(){
    let date = new Date();
    let year = date.getFullYear();

    let fillZero = (str)=> {
      return String(str).length > 1 ? str: ('0' + str);
    }
    let month = fillZero(date.getMonth() + 1);
    let day = fillZero(date.getDate());
    return year + month + day;
  }



  exCludeFile(){
    let exclude = this.options.exclude;
    let cmdStr = this.cmdStr;
    if(Array.isArray(exclude)){
      exclude.forEach( item => {
        let fileName = this.filesNames[item];
        cmdStr += ' -x "*' + fileName + '"'
      })
    }
    else{
      cmdStr += ' -x "*' + exclude + '"'
    }
    this.cmdStr = cmdStr
  }

  encryption(){
    let cmdStr = this.cmdStr;
    let options = this.options;
    cmdStr += ' -r ';
    if(options.password){
      cmdStr += ' -e -P ' + options.password
    }
    this.cmdStr = cmdStr
  }

  renameAndOutput(){
    let cmdStr = this.cmdStr;
    let options = this.options;
    if( options.name){
      cmdStr +=  ' '+ options.output + '/' + options.name
    }
    else{
      cmdStr += ' ' +  options.output + '/' + options.entry.split("/").pop() + this.getTime();
    }
    this.cmdStr = cmdStr
  }

  entryName(){
    let options = this.options;
    let cmdStr = this.cmdStr;
    cmdStr += ' ' +  options.entry;
    this.cmdStr = cmdStr
  }

  executeShell(){
    let cmdStr = this.cmdStr;
    console.log(cmdStr);
    exec(cmdStr, function (err, stdout, srderr) {
      if(err) {
        console.log(srderr);
      } else {
        console.log(stdout);
      }
    });
  }

  findFileName(outPath){
    let fileObj = {};
    outPath = outPath || this.options.output;
    let files = fs.readdirSync(outPath);
    files.some( file => {
      let tempPath = outPath + '/' + file;
      fs.stat( tempPath ,( err,stat )=>{
        if( !stat.isFile()){
          this.findFileName( tempPath );
        }
        else {
          let hashFileName = file.split('.');
          if(hashFileName.length == 2 ){
            fileObj[file] = file;
          }
          else{
            hashFileName.splice(1,1);
            fileObj[hashFileName.join('.')] = file;
          }
        }
      })
    });
    console.log(fileObj)
    return fileObj;
  }

}




class MyPlugin {
  constructor(options){
    this.options = options;
  }

  apply (compiler) {
    // 绑定钩子事件
    compiler.hooks.done.tapAsync('MyPlugin', (compilation,callback) => {
      new webpack_zip( compilation.assets,this.options );
      callback();
    })
  }
}

module.exports = MyPlugin;

