import { supabase } from "./supabase";

/**
 * Kompresi gambar di sisi klien menggunakan HTML5 Canvas
 * Mengurangi ukuran gambar dari 5-15MB menjadi ~80-180KB agar:
 * 1. Upload sangat cepat di HP (hemat kuota & anti lelet)
 * 2. Tidak melampaui batas payload API
 * 3. Langsung tampil cepat di HP pasangan
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File bukan gambar yang valid"));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Pertahankan rasio aspek
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({
            dataUrl: e.target.result,
            blob: file,
            width: img.width,
            height: img.height,
          });
        }

        // Gambar ke canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Coba format WebP terlebih dahulu (paling hemat & jernih)
        let format = "image/webp";
        let dataUrl = canvas.toDataURL(format, quality);

        // Jika browser tidak mendukung ekspor webp (fallback ke jpeg)
        if (!dataUrl.startsWith("data:image/webp")) {
          format = "image/jpeg";
          dataUrl = canvas.toDataURL(format, quality);
        }

        canvas.toBlob(
          (blob) => {
            resolve({
              dataUrl,
              blob: blob || file,
              width,
              height,
              format,
            });
          },
          format,
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Ambil semua foto galeri dari Supabase
 */
export async function getCloudPhotos() {
  try {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: err, data: [] };
  }
}

/**
 * Upload foto ke Supabase:
 * 1. Coba upload ke Supabase Storage (bucket 'gallery' / 'photos') jika tersedia
 * 2. Jika storage belum ada, otomatis simpan langsung sebagai dataUrl terkompresi di database
 */
export async function savePhotoToCloud({ title, category, dataUrl, blob, sender = "Kita" }) {
  let photoSrc = dataUrl;

  // Coba unggah ke Supabase Storage jika bucket tersedia
  if (blob) {
    try {
      const ext = blob.type?.includes("webp") ? "webp" : "jpg";
      const fileName = `foto_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { data: storageData, error: storageErr } = await supabase.storage
        .from("gallery")
        .upload(fileName, blob, {
          contentType: blob.type || "image/jpeg",
          upsert: true,
        });

      if (!storageErr && storageData?.path) {
        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(storageData.path);
        if (publicUrlData?.publicUrl) {
          photoSrc = publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      // Storage belum diset atau error, fallback tetap pakai dataUrl terkompresi
      console.warn("Supabase storage upload skipped, using compressed dataUrl:", e);
    }
  }

  // Simpan record ke tabel gallery_photos
  const payload = {
    title: title.trim(),
    category: category || "favorit",
    src: photoSrc,
    likes: 0,
    sender,
  };

  const { data, error } = await supabase
    .from("gallery_photos")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { success: true, photo: data };
}

/**
 * Hapus foto dari Supabase berdasarkan ID (atau array of IDs)
 */
export async function deleteCloudPhotos(ids) {
  const idArray = Array.isArray(ids) ? ids : [ids];
  if (idArray.length === 0) return { success: true };

  const { error } = await supabase
    .from("gallery_photos")
    .delete()
    .in("id", idArray);

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * Update jumlah suka (likes) di Supabase
 */
export async function updateCloudPhotoLikes(id, newLikes) {
  try {
    const { error } = await supabase
      .from("gallery_photos")
      .update({ likes: Math.max(0, newLikes) })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn("Gagal update likes di cloud:", err);
    return { success: false, error: err };
  }
}
