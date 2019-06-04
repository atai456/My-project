
//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Movie = require("../models/movie");


// 查询所有电影信息路由
router.post("/getMovieList", (req, res) => {
    
    var chineseName = req.body.chineseName,
        dType = req.body.dType,
        movieType = new RegExp(req.body.movieType),
        pageNumber = req.body.pageNumber,
        pageRow = req.body.pageRow;

  // 根据查询入参个数，动态生成sql查询语句
  var sqlObj = {};

  if(chineseName){
    sqlObj.chineseName = chineseName;
  }
  if(dType){
    sqlObj.dType = dType;
  }
  if(movieType){
    sqlObj.movieType = movieType;
  }

  
  var movieList = Movie.find(sqlObj);

      //对查询的结果进行筛选，skip跳过结果集中的前多少
      movieList.skip((pageNumber - 1)*pageRow);
      //对剩下来的数据进行限制返回个数
      movieList.limit(pageRow)



    // 实现分页的关键步骤
    movieList.exec(function(err,result){
        if(err){
          res.json({
            status:"fail",
            error:err
          });
        }else{
            Movie.find(sqlObj,function(err,movies){
            res.json({
              status:"success",
              movieList:result,
              total:movies.length
            });
          })
        }
    })
});

// 通过ObjectId查询单个电影信息路由
router.get("/getMovieDetail/:id", (req, res) => {
    Movie.findById(req.params.id)
    .then(movie => {
      res.json(movie);
    })
    .catch(err => {
      res.json(err);
    });
});

// 添加一个电影信息路由
router.post("/addMovie", (req, res) => {
  // 使用Movie model上的create方法储存数据
  console.log(req)
  Movie.create(req.body, (err, movie) => {
    if (err) {
      res.json({
        status:"fail",
        error:err
      });
    } else {
      res.json({
        status:"success",
        message:"新增成功"
      });
    }
  });

  console.log(req.body)
});

//更新一条电影信息数据路由
router.put("/modifyMovie/:id", (req, res) => {
  console.log(req.params)
  Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
        $set: {
            chineseName:req.body.chineseName, //电影中文名称
            englishName:req.body.englishName, //电影英文名称
            movieType: req.body.movieType, //电影类型 动作、剧情
            dType: req.body.dType, //电影放映类型 2d 3d等
            playArea:req.body.playArea, // 播放地区
            movieTime:req.body.movieTime,// 电影时长
            showTime:req.body.showTime,// 上映时间
            users:req.body.users,// 用户人数
            userScore:req.body.userScore,// 用户评分
            professors:req.body.professors,// 专业人员人数
            professorScore:req.body.professorScore,// 专业人员评分
            totalBoxOffice:req.body.totalBoxOffice,
      }
    },
    {
      new: true
    }
  )
    .then(movie => res.json({
      status:"success",
      message:"修改成功"
    }))
    .catch(err => res.json({
      status:"fail",
      error:"修改失败"
    }));
});

// 添加图片路由
router.put("/addMoviePic/:id", (req, res) => {
  Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        imgArr: req.body.url
      }
    },
    {
      new: true
    }
  )
    .then(movie => res.json({
      status:"success",
      message:"新增图片成功"
    }))
    .catch(err => res.json({
      status:"fail",
      message:"新增图片失败"
    }));
});

//删除一条电影信息路由
router.delete("/deleteMovie/:id", (req, res) => {
  Movie.findOneAndRemove({
    _id: req.params.id
  })
    .then(movie => res.json({
      status:"success",
      message:"删除成功"
    }))
    .catch(err => res.json({
      status:"fail",
      message:"删除失败"
    }));
});

module.exports = router;




















