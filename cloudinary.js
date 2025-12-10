export async function uploadPdfToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_unsigned_pdf";

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, { method:"POST", body:fd });
  const data = await res.json();
  const view = data.secure_url.replace("/upload/", "/upload/f_auto/");
  return { raw: data.secure_url, view };
}

export async function uploadImageToCloudinary(file) {
  const cloudName = "duluosq5w";
  const preset = "notehub_images";

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method:"POST", body:fd });
  const data = await res.json();
  return data.secure_url;
}
