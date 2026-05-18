import express from "express";
import cloudinary from "cloudinary";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// creating a book model
// router.post("/", protectRoute, async (req, res) => {
//   try {
//     const { title, caption, image, rating, user } = req.body;

//     if (!image || !caption || !title || !rating) {
//       return res.status(400).json({ message: "Please provide all the fields" });
//     }

//     // upload the image to cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(image);
//     const imageUrl = uploadResponse.secure_url;
//     // save all to database

//     const newBook = new Book({
//       title,
//       caption,
//       image: imageUrl,
//       rating,
//       user: req.user._id,
//     });

//     await newBook.save();
//     res.status(201).json({ book: newBook });
//   } catch (error) {
//     console.log("Error creating book", error);

//     res.status(500).json({ message: "Internal Server error" });
//   }
// });


// TODO-"Problem in this function to be done tomorrow"
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!image || !caption || !title || !rating) {
      return res.status(400).json({
        message: "Please provide all the fields",
      });
    }

    console.log("Before cloudinary upload");

    const uploadResponse = await cloudinary.uploader.upload(image);

    console.log("After cloudinary upload");

    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });

    await newBook.save();

    console.log("Book saved");

    res.status(201).json({
      book: newBook,
    });
  } catch (error) {
    console.log("Error creating book", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = (await Book.find())
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks: totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error fetching books", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// get recommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ books });
  } catch (error) {
    console.log("Get user books error", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    //   check if the user is the owner of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // deleting the image
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

export default router;
