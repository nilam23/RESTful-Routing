const expressSanitizer = require("express-sanitizer");

var express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    sanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");
const port = 3000;

mongoose.connect("mongodb://localhost/restful_blog", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(sanitizer());

var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "First test blog",
//     image: "https://cdn.business2community.com/wp-content/uploads/2016/11/Blogging.jpg",
//     body: "This is a sample post content to test our application."
// });

app.get("/", (req, res) => res.redirect("/blogs"));

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, items) => {
        if (err)
            console.log(err);
        else
            res.render("index", { blogs: items });
    })
});

app.get("/blogs/new", (req, res) => {
    res.render("new");
});

app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, item) => {
        if (err)
            res.render("new");
        else
            res.redirect("/blogs");
    });
});

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, item) => {
        if (err)
            res.redirect("/blogs");
        else
            res.render("show", { blog: item });
    })
});

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, item) => {
        if (err)
            res.redirect("/blogs");
        else
            res.render("edit", { blog: item });
    });
});

app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, item) => {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/" + req.params.id);
    })
});

app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    })
})

app.listen(port, () => console.log(`Server is running at the port ${port}...`));