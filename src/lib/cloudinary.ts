import axios from "axios";

export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gutter-audio"); // Use the preset created in Cloudinary

    try {
        // Upload file to Cloudinary
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dmgleojtk/upload`, // Replace 'your_cloud_name' with your actual Cloudinary cloud name
            formData
        );

        // Return the secure URL of the uploaded file
        return response.data.secure_url; // ✅ Cloudinary returns a public URL
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
}
