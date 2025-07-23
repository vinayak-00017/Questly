import { NextRequest, NextResponse } from "next/server";

// Dynamically import cloudinary to avoid build issues
const getCloudinary = async () => {
  const { v2: cloudinary } = await import("cloudinary");

  // Validate environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(`Missing Cloudinary configuration: 
      cloud_name: ${cloudName ? "✓" : "✗"}
      api_key: ${apiKey ? "✓" : "✗"}
      api_secret: ${apiSecret ? "✓" : "✗"}`);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
};

export async function POST(request: NextRequest) {
  try {
    const { image, folder = "questly/avatars" } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const cloudinary = await getCloudinary();

    console.log("Uploading image to Cloudinary...");

    // Simple upload - let Cloudinary upload preset handle all transformations
    const result = await cloudinary.uploader.upload(image, {
      folder,
      // No transformations - let Cloudinary upload preset handle everything
    });

    console.log("Upload successful:", {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "No public ID provided" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete image with publicId:", publicId);

    const cloudinary = await getCloudinary();

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary delete result:", result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
