# 这是小程序 Crooner 的代码
___

## 环境搭建
1. [使用mpvue开发小程序教程](https://www.jianshu.com/p/6f8d74be3ff8)（注意：在步骤 <font color='red'>创建第一个基于mpvue的小程序项目代码</font>）中，需要配置小程序的appid，暂时可以跳过此阶段。
2. 下载本项目，打开微信开发者工具，选择：项目->导入项目，导入此项目
3. 记得在微信开发者工具的菜单》设置 》编辑设置 中，将“保存时自动编译小程序”勾选上。
4. 在项目文件夹下，打开终端，输入: npm start
5. 在微信开发者工具中，点“编译”按钮，即可看小程序界面
___

## 项目代码说明
1. 主页代码在pages/index 中，该模块是小程序的主页
2. “练一练”相关页面的代码在pages/normal 中
3. “闯关模式”相关页面的代码在pages/barrier 中
___

## 开发前必看
1. 熟练 [vuejs](https://cn.vuejs.org/v2/guide/)
2. [mapvue](http://mpvue.com/mpvue/) 这里提到了mpvue不支持的vue中的部分功能。但凡遇到按照vuejs的写法应当可行的代码，在小程序中不可行时，一定要检查此文档
___

## 开发步骤
本项目按照进行，提供两种方法：
1. 难一点的规范化版本：[git的分支协作开发](https://segmentfault.com/a/1190000011010729)：
  1.1. clone 本项目，此时会有一个 master 分支
  1.2. ```git checkout -b your_brach_name```
  1.3. 愉快地在你的分支上进行开发工作
  1.4. 开发完成后, ```git push origin your_brach_name```
  1.5. 在github上选择new pull request(如下图)
  ![new pull request ](./readmeImgs/mr.png)
  ![new pull request ](./readmeImgs/mr2.png)
       base 永远是master,compare选择你的分支即可
  1.6. 每次开发之前:

    ```
      git checkout master
      git pull origin master
      git branch -D your_branch_name（如果每次取相同的名字就需要删掉。实际上不要每次都取一样的名字，比如dev之类的）
    ```
    
    1.7. 从 1.2 开始重复

***
2. 简单版本(不采用，这种方法无法维护项目，管理成本太大)：
  2.1. clone 本项目
  2.2. 愉快地进行开发工作
  2.3. 提交代码之前```git pull origin master```
  2.4. 痛苦的修复冲突，参考[git的分支协作开发](https://segmentfault.com/a/1190000011010729)文档中的“分支冲突解决”部分
  2.5. 修复冲突后```git add .``` ```git commit -m"your message"```
  2.5. 提交代码```git push origin master```
***

## 注释说明
1. 由于各种(懒)原因，代码中有一些hack或者todo标注的代码块，这种代码不建议参考，有兴趣(时间)可以修改一下
___
## 相关公众号推荐
crooning



