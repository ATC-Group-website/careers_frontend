import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface CVData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  university?: string;
  major?: string;
  graduationYear?: string;
}

export class PDFParser {
  // constructor() {
  //   // Verify worker initialization
  //   if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  //     throw new Error('PDF.js worker source is not set');
  //   }
  // }
  // private static readonly EMAIL_REGEX =
  //   /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  // private static readonly PHONE_REGEX =
  //   /(\+?\d{1,3}[-.]?)?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  // // Common education-related keywords
  // private static readonly EDUCATION_KEYWORDS = [
  //   'university',
  //   'college',
  //   'institute',
  //   'school',
  // ];
  // private static readonly DEGREE_KEYWORDS = [
  //   'bachelor',
  //   'master',
  //   'ph.d',
  //   'mba',
  //   'bs',
  //   'ba',
  //   'ms',
  //   'ma',
  // ];
  // async extractFromFile(file: File): Promise<CVData> {
  //   const arrayBuffer = await this.readFileAsArrayBuffer(file);
  //   const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  //   const textContent = await this.extractAllPages(pdf);
  //   return this.parseCV(textContent);
  // }
  // private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as ArrayBuffer);
  //     reader.onerror = reject;
  //     reader.readAsArrayBuffer(file);
  //   });
  // }
  // private async extractAllPages(
  //   pdf: pdfjsLib.PDFDocumentProxy,
  // ): Promise<string> {
  //   let fullText = '';
  //   for (let i = 1; i <= pdf.numPages; i++) {
  //     const page = await pdf.getPage(i);
  //     const textContent = await page.getTextContent();
  //     fullText +=
  //       textContent.items.map((item: any) => item.str).join(' ') + '\n';
  //   }
  //   return fullText;
  // }
  // private parseCV(text: string): CVData {
  //   const lines = text.split('\n').map((line) => line.trim());
  //   const cvData: CVData = {};
  //   // Extract email
  //   const emailMatch = text.match(PDFParser.EMAIL_REGEX);
  //   if (emailMatch) {
  //     cvData.email = emailMatch[0];
  //   }
  //   // Extract phone
  //   const phoneMatch = text.match(PDFParser.PHONE_REGEX);
  //   if (phoneMatch) {
  //     cvData.phone = phoneMatch[0];
  //   }
  //   // Extract name (usually in the first few lines, before email)
  //   const possibleNameLines = lines
  //     .slice(0, 5)
  //     .filter(
  //       (line) =>
  //         line.length > 0 &&
  //         !line.match(PDFParser.EMAIL_REGEX) &&
  //         !line.match(PDFParser.PHONE_REGEX) &&
  //         !line.toLowerCase().includes('curriculum vitae') &&
  //         !line.toLowerCase().includes('resume'),
  //     );
  //   if (possibleNameLines.length > 0) {
  //     cvData.name = possibleNameLines[0];
  //   }
  //   // Extract education information
  //   const educationInfo = this.extractEducationInfo(text);
  //   if (educationInfo) {
  //     cvData.university = educationInfo.university;
  //     cvData.major = educationInfo.major;
  //     cvData.graduationYear = educationInfo.graduationYear;
  //   }
  //   // Extract address (looking for patterns with state abbreviations or zip codes)
  //   const addressMatch = this.extractAddress(lines);
  //   if (addressMatch) {
  //     cvData.address = addressMatch;
  //   }
  //   return cvData;
  // }
  // private extractEducationInfo(text: string): {
  //   university?: string;
  //   major?: string;
  //   graduationYear?: string;
  // } {
  //   const lines = text.toLowerCase().split('\n');
  //   const result: {
  //     university?: string;
  //     major?: string;
  //     graduationYear?: string;
  //   } = {};
  //   for (let i = 0; i < lines.length; i++) {
  //     const line = lines[i];
  //     // Look for education section
  //     if (
  //       PDFParser.EDUCATION_KEYWORDS.some((keyword) => line.includes(keyword))
  //     ) {
  //       // Extract university name
  //       const universityLine = lines
  //         .slice(i, i + 3)
  //         .find((l) =>
  //           PDFParser.EDUCATION_KEYWORDS.some((keyword) => l.includes(keyword)),
  //         );
  //       if (universityLine) {
  //         result.university = this.capitalizeWords(universityLine);
  //       }
  //       // Look for degree/major information
  //       const degreeLines = lines.slice(i, i + 5);
  //       for (const degreeLine of degreeLines) {
  //         if (
  //           PDFParser.DEGREE_KEYWORDS.some((keyword) =>
  //             degreeLine.includes(keyword),
  //           )
  //         ) {
  //           result.major = this.capitalizeWords(degreeLine);
  //           // Try to extract graduation year
  //           const yearMatch = degreeLine.match(/20\d{2}|19\d{2}/);
  //           if (yearMatch) {
  //             result.graduationYear = yearMatch[0];
  //           }
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   return result;
  // }
  // private extractAddress(lines: string[]): string | undefined {
  //   // Look for lines containing state abbreviations or zip codes
  //   const stateAbbreviations = /\b[A-Z]{2}\b/;
  //   const zipCode = /\b\d{5}(-\d{4})?\b/;
  //   for (const line of lines) {
  //     if (
  //       (stateAbbreviations.test(line) || zipCode.test(line)) &&
  //       !line.match(PDFParser.EMAIL_REGEX) &&
  //       !line.match(PDFParser.PHONE_REGEX)
  //     ) {
  //       return line.trim();
  //     }
  //   }
  //   return undefined;
  // }
  // private capitalizeWords(str: string): string {
  //   return str
  //     .split(' ')
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ')
  //     .trim();
  // }
}
