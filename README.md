# WhatsApp Bot with Gemini AI Integration

Bot WhatsApp yang diintegrasikan dengan Google Gemini AI untuk memberikan respons cerdas dan berbagai fitur grup yang berguna.

## 🌟 Fitur

- 🤖 Integrasi dengan Google Gemini AI
- 💬 Sistem chat dengan konteks (memory)
- 👥 Fitur grup WhatsApp
- 🔄 Auto-reply
- 📝 Sistem quote message

## 📋 Prasyarat

- Node.js (v14 atau lebih tinggi)
- NPM
- API Key Google Gemini
- WhatsApp yang terpasang di smartphone

## 🛠️ Instalasi

1. Clone repositori ini:
```bash
git clone https://github.com/kingzuy/wa-asisten.git
cd wa-asisten
```

2. Install dependencies:
```bash
npm install
```
3. Buat file `.env` dan tambahkan API key Gemini:
```.env
GEMINI_API_KEY=<KEY_GEMINI>
```
4. Jalankan aplikasi:
```bash
npm start
```
## 🛠️ Instalasi Docker

1. Clone repositori ini:
```bash
git clone https://github.com/kingzuy/wa-asisten.git
cd wa-asisten
```

2. Install dependencies:
```bash
npm install
```
3. Buat file `.env` dan tambahkan API key Gemini:
```.env
GEMINI_API_KEY=<KEY_GEMINI>
```
4. Build Docker image:
```bash
docker build -t wa-asisten .
```
5. Jalankan container Docker:
```bash
docker run -it --name wa-asisten-container wa-asisten
```

## 📱 Cara Penggunaan

Setelah menjalankan aplikasi, scan QR code yang muncul di terminal menggunakan WhatsApp di smartphone Anda.

Perintah yang Tersedia
| Perintah | Fungsi | Contoh |
|:--:|:--:|:--:|
| `@ask` | Bertanya kepada AI | `@ask Apa itu JavaScript?` |
| `@ping` | Mengecek bot aktif | `@ping` |
| `@reset` | Mereset history chat | `@reset` |
| `@group` | Menampilkan info grup | `@group` |
| `@everyone` | Mention semua member (admin only) | `@everyone` |
| `@help` | Menampilkan bantuan | `@help` |


