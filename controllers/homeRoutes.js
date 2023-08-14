const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const { Video, User } = require('../models');
// let socket = io()
// const { createServer } = require("http");
// const server = require("http").createServer();
// const io = require("socket.io")(server)
// const {v4: uuidv4} = require("uuid")

// const httpServer = createServer();

// router.get("/testing", (req, res) => {
//   res.redirect(`/testing/${uuidv4()}`)
// })

// router.get("/:room", (req, res) => {
//   res.render("room", {roomid: req.params.room})
// });

router.get("/", async (req, res) => {
  try {
  const videoData = await Video.findAll({
    include: [
      {
      model: User,
    },
    ],
  });

  const videos = videoData.map((video) => {
    return video.get({
      plain: true,
    })
  });
  console.log(videos);

  res.render("homepage")
  }catch(err) {
    res.status(500).json(err)
  }
  });

router.get("/room", (req, res) => {
  console.log({ req, res })
  res.render("room")
});

const storeVideoData = async () => {
  try {
    const options = {
      resource_type: 'video'
    };
    const result = await cloudinary.api.resources(options);
    for (const resource of result.resources) {
      if (resource.resource_type === 'video') {
        const existingVideo = await Video.findOne({
          where: { link: resource.url }
        });
        if (!existingVideo) {
          await Video.create({
            link: resource.url,
            created_on: resource.created_at,
          });
        }
      }
    }
    console.log('Video data stored successfully.');
  } catch (error) {
    console.error('Error storing video data:', error);
  }
};
storeVideoData();

module.exports = router