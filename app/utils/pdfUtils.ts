export async function parsePDFToText(file: File, options?: { 
  maxLength?: number; 
  summarize?: boolean;
  maxPages?: number;
  extractFormFields?: boolean;
}): Promise<string> {
  try {
    // Import PDF.js legacy build for browser compatibility
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // Set the worker source URL
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/legacy/build/pdf.worker.mjs',
        import.meta.url
      ).toString();
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages;
    const maxPagesToProcess = options?.maxPages || Math.min(numPages, 50); // Limit pages by default
    const maxLength = options?.maxLength || 10000; // Default 10k chars
    
    let fullText = '';
    let summary = `PDF Document: ${file.name}\nTotal Pages: ${numPages}\n`;
    
    // Extract form fields if requested
    if (options?.extractFormFields || options?.extractFormFields === undefined) {
      try {
        const formFields: any[] = [];
        
        // Get all form fields from all pages
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const annotations = await page.getAnnotations();
          
          for (const annotation of annotations) {
            if (annotation.fieldType) {
              // Detect if this is a date field
              const fieldName = (annotation.fieldName || annotation.title || '').toLowerCase();
              const isDateField = fieldName.includes('date') || 
                                fieldName.includes('dob') || 
                                fieldName.includes('birth') ||
                                fieldName.includes('day') ||
                                fieldName.includes('month') ||
                                fieldName.includes('year') ||
                                fieldName.includes('mm') ||
                                fieldName.includes('dd') ||
                                fieldName.includes('yyyy');
              
              // Try to detect format from field name or placeholder
              let dateFormat = '';
              if (isDateField) {
                if (fieldName.includes('mm/dd/yyyy') || fieldName.includes('mm-dd-yyyy')) {
                  dateFormat = 'MM/DD/YYYY';
                } else if (fieldName.includes('dd/mm/yyyy') || fieldName.includes('dd-mm-yyyy')) {
                  dateFormat = 'DD/MM/YYYY';
                } else if (fieldName.includes('yyyy-mm-dd') || fieldName.includes('yyyy/mm/dd')) {
                  dateFormat = 'YYYY-MM-DD';
                } else if (fieldName.includes('mm') && fieldName.includes('dd') && fieldName.includes('yyyy')) {
                  dateFormat = 'MM/DD/YYYY'; // Default to US format
                } else if (fieldName.includes('month') || fieldName.includes('day') || fieldName.includes('year')) {
                  dateFormat = 'Separate fields';
                }
              }
              
              const fieldInfo = {
                page: pageNum,
                fieldName: annotation.fieldName || annotation.title || 'Unnamed Field',
                fieldType: annotation.fieldType,
                fieldValue: annotation.fieldValue || annotation.defaultFieldValue || '',
                required: annotation.fieldFlags ? (annotation.fieldFlags & 2) !== 0 : false,
                readOnly: annotation.fieldFlags ? (annotation.fieldFlags & 1) !== 0 : false,
                multiline: annotation.fieldFlags ? (annotation.fieldFlags & 4096) !== 0 : false,
                options: annotation.options || [],
                rect: annotation.rect, // Position on page [x1, y1, x2, y2]
                isDateField,
                dateFormat,
                maxLength: annotation.maxLength || null,
              };
              
              formFields.push(fieldInfo);
            }
          }
        }
        
        if (formFields.length > 0) {
          summary += `\n=== FORM FIELDS DETECTED: ${formFields.length} fields ===\n`;
          
          // Group fields by type
          const fieldsByType: Record<string, any[]> = {};
          formFields.forEach(field => {
            const type = field.fieldType || 'Unknown';
            if (!fieldsByType[type]) fieldsByType[type] = [];
            fieldsByType[type].push(field);
          });
          
          // Add field summary
          for (const [type, fields] of Object.entries(fieldsByType)) {
            summary += `\n${type} Fields (${fields.length}):\n`;
            fields.forEach((field, idx) => {
              if (idx < 50) { // Limit to first 50 fields per type to avoid huge outputs
                let fieldDetails = `  - ${field.fieldName} (Page ${field.page})`;
                if (field.required) fieldDetails += ' [REQUIRED]';
                if (field.isDateField) fieldDetails += ` [DATE: ${field.dateFormat || 'Unknown format'}]`;
                if (field.maxLength) fieldDetails += ` [MAX: ${field.maxLength}]`;
                if (field.fieldValue) fieldDetails += ` = "${field.fieldValue}"`;
                summary += fieldDetails + '\n';
              }
            });
            if (fields.length > 50) {
              summary += `  ... and ${fields.length - 50} more ${type} fields\n`;
            }
          }
          summary += '\n';
        }
      } catch (error) {
        console.warn('Error extracting form fields:', error);
        summary += '\n[Warning: Could not extract form fields from this PDF]\n';
      }
    }
    
    if (numPages > maxPagesToProcess) {
      summary += `Note: Processing first ${maxPagesToProcess} pages only (out of ${numPages} total)\n\n`;
    }

    // Extract text from each page
    for (let pageNum = 1; pageNum <= Math.min(numPages, maxPagesToProcess); pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items with proper spacing and line breaks
      const pageText = textContent.items
        .map((item: any) => {
          // Add line breaks after items that typically end sentences/paragraphs
          const text = item.str;
          if (text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            return text + '\n';
          }
          return text;
        })
        .filter((str: string) => str.trim() !== '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (pageText) {
        // Check if adding this page would exceed max length
        const newText = `\n--- Page ${pageNum} ---\n${pageText}\n`;
        if (fullText.length + newText.length > maxLength) {
          summary += `\n[Content truncated at page ${pageNum - 1} due to length constraints]`;
          break;
        }
        fullText += newText;
      }
    }

    // If summarize option is true, return a condensed version
    if (options?.summarize) {
      const words = fullText.split(/\s+/);
      const wordCount = words.length;
      const preview = words.slice(0, 500).join(' ');
      
      return `${summary}
Word Count: ~${wordCount}
Content Preview:
${preview}...

[Full content available but summarized for processing. To build a page from this PDF, please provide specific instructions about what information you need extracted.]`;
    }

    return summary + fullText.trim() || 'No text content found in PDF';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file: ' + (error as Error).message);
  }
}

export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface ProcessedFile {
  type: 'image' | 'pdf';
  content: string;
  fileName: string;
  originalFile: File;
  fullContent?: string; // Full extracted content for debug view
  formFieldsCount?: number; // Number of form fields found
}

export async function processUploadedFile(file: File): Promise<ProcessedFile> {
  if (isPDFFile(file)) {
    // First, get the full content for debug view (with reasonable limits)
    const fullText = await parsePDFToText(file, {
      maxLength: 50000,    // Higher limit for debug view
      maxPages: 100,       // More pages for full view
      summarize: false,
      extractFormFields: true
    });
    
    // Count form fields from the full text
    const formFieldsMatch = fullText.match(/=== FORM FIELDS DETECTED: (\d+) fields ===/);
    const formFieldsCount = formFieldsMatch ? parseInt(formFieldsMatch[1]) : 0;
    
    // Then get the processed version for AI consumption
    const processedText = await parsePDFToText(file, {
      maxLength: 5000,     // Reduced to leave room for form fields
      maxPages: 10,        // Focus on first 10 pages where forms usually are
      summarize: false,    // Get actual content but limited
      extractFormFields: true // Always extract form fields
    });
    
    // Add instructions for the AI
    const processedContent = `${processedText}

=== INSTRUCTIONS FOR AI ===
This PDF contains form fields that need to be carefully preserved. When building a web form based on this PDF:
1. Create an HTML form that includes ALL form fields listed above
2. Maintain the same field names and types
3. FOR DEMONSTRATION PURPOSES: Make date fields OPTIONAL (not required) even if marked as required in the PDF
4. For other fields, mark required fields appropriately as indicated
5. Group fields logically based on their page numbers
6. If there are too many fields to build at once, create a multi-step form
7. Preserve any dropdown options or field constraints
8. For date fields, use appropriate HTML5 date input types or date pickers:
   - Use type="date" for single date fields
   - Use separate dropdowns for month/day/year if specified as separate fields
   - Add placeholder text showing the expected format (e.g., "MM/DD/YYYY")
   - Add pattern validation but DO NOT make them required
=========================`;
    
    return {
      type: 'pdf',
      content: processedContent,
      fileName: file.name,
      originalFile: file,
      fullContent: fullText,
      formFieldsCount: formFieldsCount,
    };
  } else if (isImageFile(file)) {
    const base64 = await fileToBase64(file);
    return {
      type: 'image',
      content: base64,
      fileName: file.name,
      originalFile: file,
    };
  } else {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
}
