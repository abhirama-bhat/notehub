export async function uploadToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_unsigned_pdf"; // NEW PRESET NAME

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  return data.secure_url;
}
