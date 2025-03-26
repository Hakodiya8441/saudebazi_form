const express = require("express");
const router = express.Router();
const Content = require("../Models/Content");

// Get all content
router.get("/content", async (req, res) => {
    try {
      const contents = await Content.find();
      res.status(200).json(contents);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get content by ID
  router.get("/content/:id", async (req, res) => {
    try {
      const content = await Content.findById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching content by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get content by serialNo
router.get("/content/serial/:serialNo", async (req, res) => {
    try {
      const content = await Content.findOne({ serialNo: req.params.serialNo });
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching content by serialNo:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new content
router.post("/content", async (req, res) => {
    try {
      const { serialNo, image, heading, content } = req.body;
  
      // Check if serialNo already exists
      const existingContent = await Content.findOne({ serialNo });
      if (existingContent) {
        return res.status(400).json({ message: "Serial number already exists" });
      }
  
      const newContent = new Content({ serialNo, image, heading, content });
      await newContent.save();
      res.status(201).json(newContent);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  module.exports = router;