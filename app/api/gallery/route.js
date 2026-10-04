import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/gallery — Ambil semua foto dari Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, photos: data || [] });
  } catch (error) {
    console.error("GET gallery error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil foto dari server", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/gallery — Simpan foto baru ke Supabase
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category = "favorit", src, sender = "Kita" } = body;

    if (!src || !title) {
      return NextResponse.json(
        { success: false, message: "Foto dan judul wajib diisi" },
        { status: 400 }
      );
    }

    const payload = {
      title: title.trim(),
      category,
      src,
      likes: 0,
      sender,
    };

    const { data, error } = await supabase
      .from("gallery_photos")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, photo: data });
  } catch (error) {
    console.error("POST gallery error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan foto ke server", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery?id=... — Hapus foto dari Supabase
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const ids = searchParams.get("ids"); // comma-separated for bulk delete

    const targetIds = ids ? ids.split(",").map((s) => s.trim()) : id ? [id] : [];

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "ID foto dibutuhkan" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .in("id", targetIds);

    if (error) throw error;

    return NextResponse.json({ success: true, deletedCount: targetIds.length });
  } catch (error) {
    console.error("DELETE gallery error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus foto dari server", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/gallery — Update suka (likes) foto
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, likes } = body;

    if (!id || typeof likes !== "number") {
      return NextResponse.json(
        { success: false, error: "ID dan likes dibutuhkan" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("gallery_photos")
      .update({ likes: Math.max(0, likes) })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, photo: data });
  } catch (error) {
    console.error("PATCH gallery error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate suka", details: error.message },
      { status: 500 }
    );
  }
}
