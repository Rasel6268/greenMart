import axios from "axios";
import { useState } from "react";

const useImageUpload = () => {
  const [uploadImages, setImages] = useState([]); // keep your existing name

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return res.data; // return full image data
    } catch (error) {
      console.error("Cloudinary upload failed:", error.response?.data || error);
      return null;
    }
  };

  const imageHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Upload all selected images concurrently
    const uploadedResults = await Promise.all(files.map(uploadImage));

    // Filter out failed uploads
    const validUploads = uploadedResults.filter(Boolean);

    // Combine previous images + new uploads
    const allImages = [...uploadImages, ...validUploads];

    // Update state
    setImages(allImages);

    // Return all images
    return allImages;
  };

  return { uploadImages, imageHandler };
};

export default useImageUpload;
