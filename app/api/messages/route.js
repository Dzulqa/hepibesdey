import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "messages.json");

function getMessages() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]), "utf-8");
      return [];
    }
    const content = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
}

function saveMessages(messages) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving messages:", error);
  }
}

export async function GET() {
  const messages = getMessages();
  return NextResponse.json({ success: true, messages });
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

    const messages = getMessages();
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
      id: Date.now(),
      sender,
      text: text.trim(),
      reaction: reaction || "❤️",
      date: formattedDate,
      time: formattedTime,
      timestamp: `${formattedDate} ${formattedTime}`,
      read: false,
    };

    messages.unshift(newMessage);
    saveMessages(messages);

    return NextResponse.json({ success: true, message: newMessage });
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
      return NextResponse.json({ success: false, error: "ID dibutuhkan" }, { status: 400 });
    }

    let messages = getMessages();
    messages = messages.filter((m) => String(m.id) !== String(id));
    saveMessages(messages);

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("DELETE messages error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus pesan" }, { status: 500 });
  }
}
