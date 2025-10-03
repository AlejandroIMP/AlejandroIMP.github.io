export const prerender = false;
import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  
  const data = {
    name: name,
    email: email,
    message: message,
    date: new Date().toISOString()
  }

  const filePath = path.resolve("public/contact-messages.json");

  try {
    let fileData = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      fileData = JSON.parse(existing);
    } catch (error) {
      fileData = [];
    }
    fileData.push(data);
    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));
    
    return new Response (
      JSON.stringify({ success: true, message: "Mensaje guardado", }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response (
      JSON.stringify({ success: false, message: "Error al guardar el mensaje" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}