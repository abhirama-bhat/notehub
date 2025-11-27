export async function uploadToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_preset";

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  return data.secure_url;
}
