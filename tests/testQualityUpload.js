import { createReadStream } from "fs";
import { join } from "path";
import { post } from "axios";
import FormData from "form-data";

// This is a test script to demonstrate how to upload files with specific qualities
async function testEpisodeUpload() {
  try {
    const form = new FormData();

    // Add episode metadata
    form.append("title", "Test Episode");
    form.append("description", "This is a test episode");
    form.append("releaseDate", "2023-01-01");
    form.append("runtime", "45");
    form.append("episodeNumber", "1");
    form.append("seasonNumber", "1");
    form.append("seriesTitle", "Test Series");
    form.append("series", "60d21b4f1c9d440000d1e1b5"); // Example series ID

    // Add qualities for each file
    form.append("qualities", "720p");
    form.append("qualities", "1080p");

    // Add picture files
    const picturePath = join(__dirname, "test-picture.jpg");
    form.append("pictures", createReadStream(picturePath));

    // Add video files
    const videoPath1 = join(__dirname, "test-video-720p.mp4");
    const videoPath2 = join(__dirname, "test-video-1080p.mp4");
    form.append("files", createReadStream(videoPath1));
    form.append("files", createReadStream(videoPath2));

    // Send the request
    const response = await post("http://localhost:3000/api/episodes", form, {
      headers: {
        ...form.getHeaders(),
        Authorization: "Bearer YOUR_AUTH_TOKEN",
      },
    });

    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error(
      "Upload failed:",
      error.response ? error.response.data : error.message,
    );
  }
}

async function testMovieUpload() {
  try {
    const form = new FormData();

    // Add movie metadata
    form.append("title", "Test Movie");
    form.append("description", "This is a test movie");
    form.append("director", "60d21b4f1c9d440000d1e1b6"); // Example director ID
    form.append("release_date", "2023-01-01");
    form.append("duration", "120");
    form.append("genres", JSON.stringify(["Action", "Adventure"]));
    form.append("category", JSON.stringify(["Hollywood"]));
    form.append("country", "USA");
    form.append("language", "English");
    form.append("rotten_rating", "8.5");
    form.append("imdb_rating", "8.7");

    // Add qualities for each file
    form.append("qualities", "720p");
    form.append("qualities", "1080p");
    form.append("qualities", "4K");

    // Add required files
    const thumbnailPath = join(__dirname, "test-thumbnail.jpg");
    const coverPath = join(__dirname, "test-cover.jpg");
    const trailerPath = join(__dirname, "test-trailer.mp4");
    form.append("thumbnail", createReadStream(thumbnailPath));
    form.append("cover", createReadStream(coverPath));
    form.append("trailer", createReadStream(trailerPath));

    // Add video files
    const videoPath1 = join(__dirname, "test-video-720p.mp4");
    const videoPath2 = join(__dirname, "test-video-1080p.mp4");
    const videoPath3 = join(__dirname, "test-video-4k.mp4");
    form.append("files", createReadStream(videoPath1));
    form.append("files", createReadStream(videoPath2));
    form.append("files", createReadStream(videoPath3));

    // Send the request
    const response = await post("http://localhost:3000/api/movies", form, {
      headers: {
        ...form.getHeaders(),
        Authorization: "Bearer YOUR_AUTH_TOKEN",
      },
    });

    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error(
      "Upload failed:",
      error.response ? error.response.data : error.message,
    );
  }
}

// Run the tests
console.log("Testing episode upload with specific qualities...");
testEpisodeUpload();

console.log("Testing movie upload with specific qualities...");
testMovieUpload();
