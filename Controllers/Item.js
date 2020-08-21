const Item = require("../Models/Item");
const path = require("path");
const User = require("../Models/User");
const fs = require("fs");

/**
 * Display all items
 */

module.exports.Items = async (req, res) => {
  let lastIndex = req.params.id;
  if (lastIndex) {
    console.log("here");
    Item.find({ _id: { $gt: lastIndex } })
      .limit(4)
      .then((d) => {
        res.json(d);
      });
  } else {
    const firstItems = await Item.find().limit(4);
    res.json(firstItems);
  }
};
/**
 * Adding item to the current logged in user
 */
module.exports.addItem = async (req, res) => {
  let { username } = req.user;
  req.body.Owner = username;
  let item = new Item(req.body);
  let image = req.files.image;
  let extension = image.name.split(".");
  let imageLocal =
    path.join(__dirname, "../", "public", "images/") +
    item._id.toString() +
    "." +
    extension[extension.length - 1];

  let imageLink =
    "/images/" + item._id.toString() + "." + extension[extension.length - 1];
  image.mv(imageLocal, (err) => {
    item.Image = imageLink;
    item.save();
    req.user.Items.push(item);
    req.user.save();
    res.send("item added");
  });
};

/**
 * displaying connected user items
 */

module.exports.myItems = async (req, res) => {
  let items = await User.findById(req.user._id)
    .populate("Items")
    .select("Items");

  res.json(items);
};

/**
 * Basic item search by product name
 */

module.exports.SearchItem = async (req, res) => {
  const { query } = req.body;
  let items = await Item.find({
    ProductName: { $regex: `^${query}`, $options: "i" },
  });

  res.json(items);
};

/**
 * Removing an item
 */
module.exports.DeleteItem = async (req, res) => {
  let id = req.params.id;
  let item = await Item.findById(id);

  if (item == null) {
    res.send("Item not found");
    return;
  }
  //Logged in user is the item owner ?
  if (item.Owner === req.user.username) {
    fs.unlink(path.join(__dirname, "../", "public", item.Image), (err) => {
      if (err) console.log(err);
    });
    item.remove();
    item.save();
    await User.updateOne({ _id: req.user._id }, { $pull: { Items: id } });

    res.send("Deleted");
  } else {
    res.send("Unauthorized");
  }
};
