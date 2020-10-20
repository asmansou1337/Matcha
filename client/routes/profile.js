var express = require("express");
var router = express.Router();
const axios = require("axios");
const chalk = require("chalk");
const upload = require("../middleware/uploadImg");
const fs = require("fs");
const multer = require("multer");
const headerAuth = require("../middleware/authHeader");
const handle = require("../middleware/functions");

// edit basic infos form POST
router.post("/editProfile", headerAuth.connectedHeader, async (req, res) => {
  let userInfos = req.body;
  let user = undefined;
  let success = undefined;
  let error = undefined;
  // Edit infos
  await axios.post(`${process.env.HostApi}/profile/editBasic`, userInfos)
    .then((response) => {
      success = response.data;
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          error = e.response.data.errorMessage;
        }
      }
    });
  // get user infos
  await axios.get(`${process.env.HostApi}/profile/getInfos`)
    .then((resp) => {
      user = resp.data.user;
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          error = e.response.data.errorMessage;
        }
      }
    });
  res.render("editProfile", {success, error, userInfos: user, nav: { path: "basic" }, token: req.cookies.jwt});
});

// Update password
router.post("/updatePassword", headerAuth.connectedHeader, async (req, res) => {
  let user = undefined;
  let error = undefined;
  let success = undefined;
  await axios.post(`${process.env.HostApi}/profile/updatePassword`, req.body)
    .then((response) => {
      // console.log(chalk.blue(response.data.successMessage));
      success = response.data;
    })
    .catch((e) => {
      if (typeof e.response !== "undefined") {
        handle.authError(e);
        if (e.response.status === 400) {
          error = e.response.data.errorMessage;
        }
      }
    });
    // get user infos
    await axios.get(`${process.env.HostApi}/profile/getInfos`)
    .then((resp) => {
      user = resp.data.user;
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          error = e.response.data.errorMessage;
        }
      }
    });
  res.render("editProfile", {success, error, userInfos: user, nav: { path: "password" }, token: req.cookies.jwt});
});

// Upload profile picture form
router.post("/uploadProfile", headerAuth.connectedHeader, (req, res) => {
  req.flash("path", "picture");
  let oldProfilePic = "";
  // Get The old profile picture name if exists
  axios.get(`${process.env.HostApi}/profile/getProfilePic`)
    .then((resp) => {
      // console.log(chalk.magenta(JSON.stringify(resp.data.user.profilePic)));
      oldProfilePic = resp.data.user.profilePic;
    })
    .catch((e) => {
      if (typeof e.response !== "undefined") {
        handle.authError(e);
        if (e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/profile/editProfile");
        }
      }
    });

  // upload new picture
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(chalk.red(err));
      req.flash("error", "Images Allowed (jpg, jpeg, png, gif), size: less than 10MB");
      res.redirect("/profile/editProfile");
    } else if (err) {
      // console.log(chalk.red(err));
      req.flash("error", err);
      res.redirect("/profile/editProfile");
    } else {
      if (req.file == undefined) {
        req.flash("error", "Please Select An Image To Upload!");
        res.redirect("/profile/editProfile");
      } else {
        // Update the image name on the backend
        let pic = {
          name: req.file.filename,
        };
        //console.log(chalk.green(JSON.stringify(req.file)));
        axios.post(`${process.env.HostApi}/profile/updateProfilePic`, pic)
          .then((response) => {
            // delete old picture first before redirecting
            if (oldProfilePic != "" && oldProfilePic != null)
              fs.unlinkSync(process.cwd() + "/public/uploads/" + oldProfilePic);
            req.flash("successMessage", response.data.successMessage);
            res.redirect("/profile/editProfile");
          })
          .catch((e) => {
            if (typeof e.response !== "undefined") {
              handle.authError(e);
              if (e.response.status === 400) {
                req.flash("error", e.response.data.errorMessage.error);
                res.redirect("/profile/editProfile");
              }
            }
          });
      }
    }
  });
});

// Delete profile picture form
router.post("/deleteProfile", headerAuth.connectedHeader, (req, res) => {
  req.flash("path", "picture");
  axios.get(`${process.env.HostApi}/profile/getProfilePic`)
    .then((resp) => {
      if (resp.data.user.profilePic != "" && resp.data.user.profilePic != null)
        fs.unlinkSync(process.cwd() + "/public/uploads/" + resp.data.user.profilePic);
      // Update the image name on the backend
      let pic = {
        name: null,
      };
      axios.post(`${process.env.HostApi}/profile/updateProfilePic`, pic)
        .then((response) => {
          console.log(chalk.blue(response.data.successMessage));
        })
        .catch((e) => {
          if (typeof e.response !== "undefined") {
            if (e.response.status === 400) {
              req.flash("error", e.response.data.errorMessage.error);
              res.redirect("/profile/editProfile");
            }
          }
          handle.authError(e, req, res);
        });
      req.flash("successMessage", "Your profile picture is deleted successfully.");
      res.redirect("/profile/editProfile");
    })
    .catch((e) => {
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/profile/editProfile");
        }
      }
      handle.authError(e, req, res);
    });
});

// Upload other picture form (max 4)
router.post("/uploadPicture", headerAuth.connectedHeader, (req, res) => {
  req.flash("path", "picture");
  axios.get(`${process.env.HostApi}/profile/picturesCount`)
    .then((resp) => {
      // upload new picture
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          console.log(chalk.red(err));
          req.flash("error", "Images Allowed (jpg, jpeg, png, gif), size: less than 10MB");
          res.redirect("/profile/editProfile");
        } else if (err) {
          console.log(chalk.red(err));
          req.flash("error", err);
          res.redirect("/profile/editProfile");
        } else {
          if (req.file == undefined) {
            req.flash("error", "Please Select An Image To Upload!");
            res.redirect("/profile/editProfile");
          } else {
            // Update the image name on the backend
            let pic = {
              name: req.file.filename,
            };
            // console.log(chalk.green(JSON.stringify(req.file)));
            axios.post(`${process.env.HostApi}/profile/addNewPic`, pic)
              .then((response) => {
                req.flash("successMessage", response.data.successMessage);
                res.redirect("/profile/editProfile");
              })
              .catch((e) => {
                if (typeof e.response !== "undefined") {
                  if (e.response.status === 400) {
                    req.flash("error", e.response.data.errorMessage.error);
                    res.redirect("/profile/editProfile");
                  }
                }
                handle.authError(e, req, res);
              });
          }
        }
      });
    })
    .catch((e) => {
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/profile/editProfile");
        }
      }
      handle.authError(e, req, res);
    });
});

// Delete profile picture form
router.post("/deletePicture", headerAuth.connectedHeader, (req, res) => {
  req.flash("path", "picture");
  let img = req.body.img;
  //console.log(chalk.magenta(JSON.stringify(req.body)));
  if (fs.existsSync(process.cwd() + "/public/uploads/" + img)) {
    fs.unlinkSync(process.cwd() + "/public/uploads/" + img);
    // Remove the image name on the backend
    let pic = {
      name: img,
    };
    //console.log(chalk.green(JSON.stringify(req.file)));
    axios.post(`${process.env.HostApi}/profile/deletePic`, pic)
      .then((response) => {
        // console.log(chalk.blue(response.data.successMessage));
        req.flash("successMessage", response.data.successMessage);
        res.redirect("/profile/editProfile");
      })
      .catch((e) => {
        if (typeof e.response !== "undefined") {
          if (e.response.status === 400) {
            req.flash("error", e.response.data.errorMessage.error);
            res.redirect("/profile/editProfile");
          }
        }
        handle.authError(e, req, res);
      });
  } else {
    req.flash("error", "This image does not exists!!");
    res.redirect("/profile/editProfile");
  }
});

// edit tags infos form POST
router.post("/addTags", headerAuth.connectedHeader, (req, res) => {
  req.flash("path", "tag");
  // console.log(chalk.yellow(req.body.TagsTab));
  // verify if tags tab is an array
  try {
    let userTags = JSON.parse(req.body.TagsTab);
    axios.post(`${process.env.HostApi}/profile/updateTags`, userTags)
    .then((response) => {
      req.flash("successMessage", response.data.successMessage);
      res.redirect("/profile/editProfile");
    })
    .catch((e) => {
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/profile/editProfile");
        }
      }
      handle.authError(e, req, res);
    });
  } catch(e) {
    req.flash("error", 'Invalid Tags');
    res.redirect("/profile/editProfile");
  }
});

router.get("/getTags", headerAuth.connectedHeader, (req, res) => {
  axios.get(`${process.env.HostApi}/tagsList`)
  .then((result) => {
    let tags = result.data.tags
    return res.send({tags})
  })
})

/* GET edit profile page. */
router.get("/editProfile", headerAuth.connectedHeader, (req, res) => {
  // getting success/error messages from redirect
  let path = req.flash("path");
  let err = req.flash("error");
  let successMessage = req.flash("successMessage");
  let error = {},
    success = {},
    user = undefined;
  let tagsList = [];

  if (JSON.stringify(err) === "[]") error = undefined;
  else error.error = err;
  if (JSON.stringify(successMessage) === "[]") success = undefined;
  else success.successMessage = successMessage;
  if (JSON.stringify(path) === "[]") path = "basic";
  // get user infos
  axios.get(`${process.env.HostApi}/profile/getInfos`)
    .then((response) => {
      user = response.data.user;
      res.render("editProfile", {success, error, userInfos: user, nav: { path }, tagsList, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            // console.log(e.response.data);
            let error = {error: e.response.data.errorMessage.error}
            res.render("editProfile", {success, error, userInfos: user, nav: { path }, tagsList, token: req.cookies.jwt});
        }
      }    
    });
});

// Update user location
router.post("/updateLocation", headerAuth.connectedHeader, async (req, res) => {
  req.flash("path", "location");
  let userCoor = { latitude: req.body.latitude, longitude: req.body.longitude };
  if (handle.isEmpty(userCoor.latitude) || handle.isEmpty(userCoor.longitude)) {
    // locate the user automatically
    await axios.get(`http://ip-api.com/json`).then((response) => {
      userCoor.longitude = response.data.lon;
      userCoor.latitude = response.data.lat;
    });
  }
  // update user location on the backend
  axios.post(`${process.env.HostApi}/profile/updateLocation`, userCoor)
    .then((response) => {
      req.flash("successMessage", response.data.successMessage);
      res.redirect("/profile/editProfile");
    })
    .catch((e) => {
      if (typeof e.response !== "undefined") {
        if (e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/profile/editProfile");
        }
      }
      handle.authError(e, req, res);
    });
});

module.exports = router;
