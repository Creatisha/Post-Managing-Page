const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { v4: uuidv4 } = require("uuid");

///////To add images to new posts created 
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");  
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

let posts = [ 
    {
        id: uuidv4(),
        username: "love_for_cats",
        image: "/images/cat.jpg",
        caption: "staling the show"
    },
    {
        id: uuidv4(),
        username: "facts_4U",
        image: "/images/dolphin.jpg",
        caption: "Dolphins can regenerate skin remarkably fastins."
    },
    {
        id: uuidv4(),
        username: "jungle_dost",
        image: "/images/jungle.jpg",
        caption: "The place where beings live with no worries"
    },
    {
        id: uuidv4(),
        username: "hashtag_Candles",
        image: "/images/candle.jpg",
        caption: "A fragrant whisper that turns a house into a home"
    },
    {
        id: uuidv4(),
        username: "peaceful_soul",
        image: "/images/manStream.jpg",
        caption: "Worries make you belong from nowhere, Choose nature to find peace over them"
    },
    {
        id: uuidv4(),
        username: "__flowerist__",
        image: "/images/bouqet.jpg",
        caption: "Flowers don't worry about how they're going to bloom. They just open up and turn toward the light and that makes them beautiful",
    }
]

app.get("/posts", (req, res) => {
    res.render("instagram", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new");
});

app.post("/posts/new", upload.single("image"), (req, res) => {
    let { username , caption } = req.body;

    let image = "/uploads/" + req.file.filename;
    let id = uuidv4();

    posts.push({id, username , caption, image});
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let{ id } = req.params;
    let post = posts.find((p) => id === p.id);

    if (!post) {
        return res.send("Post not found");
    }

    res.render("detail", { post });
});

app.get("/posts/:id/edit", (req, res) => {
    let{ id } = req.params;
    let post = posts.find((p) => id === p.id);

    res.render("edit", { post });
});

app.patch("/posts/:id", (req, res) => { 
    let { id } = req.params;
    let { caption } = req.body;
    let post = posts.find((p) => id === p.id);
    post.caption = caption;
    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
   }); 

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is listening on port ${port}`);
});
