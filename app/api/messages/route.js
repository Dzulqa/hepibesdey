import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, messages: data || [] });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil pesan" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, reaction, sender = "Alika" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      sender,
      text: text.trim(),
      reaction: reaction || "❤️",
      date: formattedDate,
      time: formattedTime,
      timestamp: `${formattedDate} ${formattedTime}`,
      read: false,
    };

    const { data, error } = await supabase
      .from("messages")
      .insert([newMessage])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("POST messages error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pesan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID dibutuhkan" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Ambil sisa pesan setelah hapus
    const { data, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    return NextResponse.json({ success: true, messages: data || [] });
  } catch (error) {
    console.error("DELETE messages error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pesan" },
      { status: 500 }
    );
  }
}
