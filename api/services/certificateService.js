import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  async generateCertificate(data) {
    const { studentName, courseName, courseDuration, completionDate, professorName } = data;
    console.log(`[Certificado] Gerando para: ${studentName}, Curso: ${courseName}, Horas: ${courseDuration}`);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 0
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const rootPath = process.cwd();
      const logoPath = path.join(rootPath, 'public', 'src', 'logo.png');

      // --- ESTRUTURA ---
      // Fundo Branco (Seguro para Firefox)
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

      // Bordas Decorativas
      doc.lineWidth(15)
         .strokeColor('#1b2232')
         .rect(10, 10, doc.page.width - 20, doc.page.height - 20)
         .stroke();
      
      doc.lineWidth(2)
         .strokeColor('#c5a059')
         .rect(28, 28, doc.page.width - 56, doc.page.height - 56)
         .stroke();

      // --- LOGO (Centralização Perfeita) ---
      const logoWidth = 100;
      const logoX = (doc.page.width - logoWidth) / 2;
      
      try {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, logoX, 50, { width: logoWidth });
        }
      } catch (e) {
        console.warn("[Certificado] Falha ao carregar logo:", e.message);
      }

      doc.fillColor('#1b2232')
         .fontSize(12)
         .font('Helvetica')
         .text('EDUCATION HIGH SPHERE', 0, 140, { align: 'center', characterSpacing: 1 });

      // --- TÍTULO ---
      doc.fillColor('#c5a059')
         .fontSize(48)
         .font('Helvetica-Bold')
         .text('CERTIFICADO', 0, 190, { align: 'center' });
      
      doc.fillColor('#1b2232')
         .fontSize(18)
         .font('Helvetica')
         .text('DE CONCLUSÃO', 0, 240, { align: 'center', characterSpacing: 2 });

      // --- CORPO DO TEXTO ---
      doc.moveDown(2.5);
      doc.fillColor('#4a5568')
         .fontSize(18)
         .font('Helvetica')
         .text('Certificamos para os devidos fins que', { align: 'center' });

      doc.moveDown(0.5);
      doc.fillColor('#1a202c')
         .fontSize(36)
         .font('Helvetica-Bold')
         .text(studentName.toUpperCase(), { align: 'center' });

      doc.moveDown(0.5);
      doc.fillColor('#4a5568')
         .fontSize(18)
         .font('Helvetica')
         .text('concluiu com êxito o curso de', { align: 'center' });

      doc.moveDown(0.5);
      doc.fillColor('#c5a059')
         .fontSize(30)
         .font('Helvetica-Bold')
         .text(courseName, { align: 'center' });

      // --- CARGA HORÁRIA ---
      doc.moveDown(1);
      doc.fillColor('#4a5568')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text(`Carga Horária Total: ${courseDuration}`, { align: 'center' });

      // --- RODAPÉ ---
      const footerY = 510;

      // Data de Emissão
      doc.fillColor('#718096')
         .fontSize(12)
         .font('Helvetica')
         .text(`Data de emissão: ${completionDate}`, 80, footerY);

      // Linha de Assinatura
      doc.moveTo(doc.page.width - 330, footerY + 20)
         .lineTo(doc.page.width - 80, footerY + 20)
         .lineWidth(1)
         .stroke('#c5a059');

      // Nome do Instrutor
      doc.fillColor('#1a202c')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(professorName, doc.page.width - 330, footerY + 30, { width: 250, align: 'center' });
      
      doc.fillColor('#718096')
         .fontSize(11)
         .font('Helvetica')
         .text('Professor Instrutor / CEO EHS', doc.page.width - 330, footerY + 50, { width: 250, align: 'center' });

      // Finalização
      doc.end();
    });
  }
};
