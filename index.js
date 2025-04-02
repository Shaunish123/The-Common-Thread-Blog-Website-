import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;  // made to deploy on both render and locally

// Set up view engine
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//to use put, patch and delete for html forms

app.use(methodOverride("_method"));


// Sample blogs with authors
const blogs = [
    { 
        id: 1, 
        author: "John Doe", 
        title: "The Power of Habits", 
        content: "Habits shape our daily lives, influencing productivity, health, and success. Building good habits takes time and consistency, but once established, they require less effort to maintain. Small daily actions compound into significant long-term results. Whether it's reading, exercising, or journaling, investing in positive habits is key to personal growth and self-improvement." 
    },
    { 
        id: 2, 
        author: "Jane Smith", 
        title: "Why JavaScript is Everywhere", 
        content: "JavaScript has become one of the most essential programming languages in web development. It powers interactive websites, builds scalable backend systems, and even helps create mobile apps. With frameworks like React, Node.js, and Express, developers can work on both frontend and backend using a single language. Its versatility, ease of learning, and vast community support make JavaScript an ideal choice for beginners and professionals alike. The rise of modern libraries such as Vue.js and Angular enhances its capabilities. Additionally, JavaScript is used in game development, automation, and AI. With continuous improvements, JavaScript remains at the forefront of technology." 
    },
    { 
        id: 3, 
        author: "Alice Johnson", 
        title: "Exploring the Universe: A Journey Through Space", 
        content: "Space exploration has always fascinated humanity, offering insights into the vast unknown. From landing on the Moon to sending rovers to Mars, each mission expands our understanding of the universe. Scientists study black holes, exoplanets, and cosmic phenomena to unlock the secrets of space. With advancements in technology, we may soon see human missions to Mars and beyond, making space travel a reality for future generations." 
    }
];

app.get("/", (req, res) => {
    res.render("index.ejs", { blogs });
});

app.get("/write", (req, res) => {
    res.render("write.ejs", { blog: null });
});

app.post("/write", (req, res)=>{
    const {author, topic, content} = req.body;

    const newBlog = {
        id:blogs.length + 1,
        author,
        title: topic,
        content
    }

    blogs.unshift(newBlog);

    res.redirect("/");

})

app.get("/blog/:id", (req,res)=>{
    const blogId = req.params.id;
    
    // Find the blog by ID
    const blog = blogs.find(b => b.id == blogId);
    
    if (!blog) {
        return res.status(404).send("Blog not found");
    }

    // Render the blog page and pass the blog object
    res.render('blog.ejs', { blog });

})

//editing the blog

app.get("/blog/:id/edit", (req, res) => {
    const blog = blogs.find((b) => b.id == req.params.id);
    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    res.render("write.ejs", { blog });
});

app.put("/blog/:id", (req, res) => {
    const { author, topic, content } = req.body;
    const blog = blogs.find((b) => b.id == req.params.id);

    if (!blog) {
        return res.status(404).send("Blog not found");
    }

    // Update blog details
    blog.author = author;
    blog.title = topic;
    blog.content = content;

    res.redirect(`/blog/${blog.id}?action=edited&title=${encodeURIComponent(topic)}`);
});

// Delete route
app.delete("/blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    
    // Only allow deletion of blogs with id > 3
    if (blogId <= 3) {
        return res.status(403).send("Cannot delete pre-stored blogs");
    }

    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) {
        return res.status(404).send("Blog not found");
    }

    const deletedBlog = blogs[blogIndex];
    // Remove the blog from the array
    blogs.splice(blogIndex, 1);

    // Redirect to home page with success message
    res.redirect('/?action=deleted&title=' + encodeURIComponent(deletedBlog.title));
});


// About route
app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
