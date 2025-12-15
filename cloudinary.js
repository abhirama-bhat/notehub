export async function uploadPdfToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_preset"; // can stay the same

  const fd = new FormData();
  fd.append("file", file);

  // 🔥 FORCE RAW — THIS IS THE KEY
  fd.append("resource_type", "raw");
  fd.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: fd
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Cloudinary error");

  return {
    raw: data.secure_url,
    view: data.secure_url
  };
}
