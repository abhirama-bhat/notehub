export default async function uploadToCloudinary(file) {
  const cloudName = "duluosq5w";
  const uploadPreset = "notehub_preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url;
}
