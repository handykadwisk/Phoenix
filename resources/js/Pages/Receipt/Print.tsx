import { jsPDF } from "jspdf";

const loadImageAsBase64 = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
};

const generateReceiptPDF = async () => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a5",
    });

    const logoUrl = "/fresnel.jpeg";
    const logoBase64 = await loadImageAsBase64(logoUrl);

    // Header
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(16);
    doc.addImage(logoBase64, "JPEG", 10, 5, 60, 15);
    //doc.text("FRESNEL", 10, 20); // Nama perusahaan

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("K W I T A N S I", 105, 25, { align: "center" }); // Kwitansi title

    // Garis header (horizontal bawah)
    doc.line(80, 27, 130, 27); // (x1, y1, x2, y2)

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("OFFICIAL RECEIPT", 105, 32, { align: "center" }); // Subtitle

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("No. 24.11.02787/RCP", 180, 40, { align: "right" }); // Nomor dokumen

    // Isi Kwitansi
    doc.setFontSize(10);

    // TERIMA DARI
    doc.text("TERIMA DARI", 10, 55);
    doc.text("RECEIPT FROM", 10, 60);
    doc.text(":", 80, 55);
    doc.text("Indonesia Morowali Industrial Park", 85, 55);
    // Garis terima dari (horizontal bawah)
    doc.line(10, 56, 42, 56); // (x1, y1, x2, y2)

    // JUMLAH
    doc.text("JUMLAH", 10, 70);
    doc.text("AMOUNT OF", 10, 75);
    doc.text(":", 80, 70);
    doc.text(
        "Tujuh Ratus Dua Puluh Juta Delapan Ratus Dua Puluh Empat Ribu Seratus Empat Puluh Dua Rupiah",
        85,
        70,
        { maxWidth: 110 }
    );
    // Garis jumlah (horizontal bawah)
    doc.line(10, 71, 42, 71); // (x1, y1, x2, y2)

    // PEMBAYARAN
    doc.text("PEMBAYARAN", 10, 85);
    doc.text("PAYMENT OF", 10, 90);
    doc.text(":", 80, 85);
    doc.text("KR OTOMATIS", 85, 85);
    doc.text("LLG-MANDIRI INDONESIA MOROWALI", 85, 90);
    doc.text("Asuransi - 4413003", 85, 95);
    // Garis pembayaran (horizontal bawah)
    doc.line(10, 86, 42, 86); // (x1, y1, x2, y2)

    // Amount in IDR (di tengah, besar, tebal)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    // Tambahkan teks
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    const amount = "IDR 720,826,142.00";
    const x = 45; // Posisi x
    const y = 110; // Posisi y

    doc.text(amount, x, y);

    // Hitung ukuran teks untuk border
    const textWidth = doc.getTextWidth(amount);
    const padding = 2; // Padding di sekitar teks

    // Gambarkan border
    doc.setDrawColor(0, 0, 0); // Warna garis (hitam)
    doc.setLineWidth(0.2); // Ketebalan garis
    doc.rect(10, y - 7, textWidth + padding * 36, 11); // x, y, width, height

    // Catatan bawah
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const line1 = "Pembayaran dengan cek / giro berlaku jika sudah diuangkan";
    const line2 =
        "Payment made by cheques / draft is subject to be clear by bank concerned";
    const xNote = 70; // Posisi x (kiri)
    const y1 = 128; // Posisi y untuk baris pertama
    const y2 = 133; // Posisi y untuk baris kedua

    doc.text(line1, xNote, y1, { align: "center" });
    doc.text(line2, xNote, y2, { align: "center" });

    // Hitung ukuran border
    const textWidthNote = Math.max(
        doc.getTextWidth(line1),
        doc.getTextWidth(line2)
    ); // Lebar border mengikuti teks terpanjang
    const paddingNote = 2; // Padding di sekitar teks
    const lineHeight = 5; // Jarak antar baris teks
    const totalHeight = 13; // Tinggi kotak (baris pertama + kedua + padding)

    // Gambarkan border
    doc.setDrawColor(0, 0, 0); // Warna garis (hitam)
    doc.setLineWidth(0.2); // Ketebalan garis
    doc.rect(
        10,
        y1 - lineHeight,
        textWidthNote + paddingNote * 15,
        totalHeight
    ); // x, y, width, height

    // Footer
    doc.setFontSize(10);
    doc.text("Jakarta, 14 November 2024", 150, 105);
    doc.setFont("helvetica", "bold");
    doc.text("PT. Fresnel Perdana Mandiri", 150, 110);

    // Garis tanda tangan
    doc.setFont("helvetica", "normal");
    doc.text(".................................................", 150, 130);

    // Simpan PDF
    doc.save("Receipt.pdf");
};

generateReceiptPDF();
