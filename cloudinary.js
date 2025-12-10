// cloudinary.js
// Handles PDF (raw) uploads and image uploads (screenshots)
export async function uploadPdfToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_unsigned_pdf"; // ensure this exists

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);
  fd.append("resource_type", "raw");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: fd
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary PDF upload failed", data);
    throw new Error(data.error?.message || "Cloudinary upload error");
  }

  // Force Cloudinary to serve inline / correct mime with f_auto
  // If secure_url already contains /upload/ this replacement works.
  const viewableUrl = data.secure_url.replace("/upload/", "/upload/f_auto/");
  return { raw: data.secure_url, viewable: viewableUrl, meta: data };
}

export async function uploadImageToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_images"; // create unsigned preset for images or reuse if allowed

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: fd
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Cloudinary image upload error");
  return data.secure_url;
}
