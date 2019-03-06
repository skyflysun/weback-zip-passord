# weback-zip-passord
webpack 加密


### 使用

    npm install webpack-zip-password
    
    
    
> options < Object > 

    {
        name: '' //输出名称 默认 入口文件夹名称 + 当前的年日月
        output: '' //输出的相对路径  默认 './www' 
        entry: '' //入口的相对路径  默认'.../www'
        password: '' //加密使用的密码 默认  ''
        exclude: '' //排除的文件
        
    }
    
    
>options.exclude
    
   数组或者字符串
   
       new webpack-zip-password({
            exclude: [
                'main.js'  //只需要名称和类型，遇到在不同的文件夹相同的名称同一类型的文件会就算hash值不一样也都被排除掉
            ]
       })
 
   字符串
   
        new webpack-zip-password({
               exclude: 'main.js'  //只需要名称和类型，遇到在不同的文件夹相同的名称同一类型的文件会就算hash值不一样也都被排除掉
               
          })