// =========================================================
// UTILITY 1: DEFINE 'path' UTILITY OBJECT for browser compatibility
// =========================================================
const path = {
    basename: (filePath) => {
        const lastSeparator = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
        return filePath.substring(lastSeparator + 1);
    },
    dirname: (filePath) => {
        const lastSeparator = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
        if (lastSeparator <= 0) return '.';
        return filePath.substring(0, lastSeparator);
    }
};
// =========================================================

/**
 * CORE FUNCTION: Handles the file selection, renaming, header insertion, and ZIP creation.
 * This function is called by the "Standardize FileName" button.
 */
async function standardizeFileName() {
    const input = document.getElementById('folderInput');
    const files = input.files;
    const status = document.getElementById('status');

    if (!files.length) {
        alert('Please select a folder.');
        return;
    }

    status.textContent = 'Processing files...';
    const zip = new JSZip();

    for (const file of files) {
        const relativePath = file.webkitRelativePath;
        
        // Skip directories and entries without a path
        if (file.type === "" && file.size === 0 && relativePath.endsWith("/")) {
            continue;
        }

        try {
            const content = await file.text();
            
            // 1. Get Path Information
            const directoryPath = path.dirname(relativePath);
            const originalFileName = path.basename(relativePath);
            
            // ROBUST CHECK: Skip if the filename is empty or invalid
            if (!originalFileName || originalFileName === '.' || originalFileName === '..') {
                console.warn(`Skipping invalid or empty file entry: ${relativePath}`);
                continue;
            }
            
            // 2. Process the Filename (Renaming & Description Extraction)
            // The utility function has the same name as the main button function, but is nested below.
            const result = standardizeFileNameUtility(originalFileName); 
            
            // 3. APPLY CONTENT MODIFICATION (Find and insert header)
            let newContent = content;
            
            // Regex to find [Collection(...)], including any leading whitespace/tabs
            const collectionRegex = /(\s*)\[Collection\(ApplicationTestFixture\.ApplicationTestFixtureCollection\)\]/i;
            const header = `\r\n\t// [Testcase] ${result.description}`; 

            // Search for the [Collection(...)] line
            const match = newContent.match(collectionRegex);

            if (match) {
                const matchString = match[0];
                const replacementString = header + matchString;
                newContent = newContent.replace(matchString, replacementString);
            } else {
                // FALLBACK: Prepend the header to the file start
                newContent = header + newContent;
            }
            
            // 4. Construct Final Path
            const newFileName = result.newFileName;
            const newRelativePath = directoryPath === '.' ? newFileName : `${directoryPath}/${newFileName}`;

            // 5. Add to ZIP
            zip.file(newRelativePath, newContent);
            
        } catch (e) {
            console.error(`Error processing file ${relativePath}:`, e);
            status.textContent = `Error processing file: ${relativePath}. Check console.`;
        }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const fileName = 'Processed_Files_Renamed.zip';
    
    saveAs(blob, fileName);
    status.textContent = 'Done! ZIP file is downloading.';
}

/**
 * UTILITY 2: Analyzes the original filename, extracts/standardizes the code part (API_XXXX_TC_YYYY)
 * This is the helper function called by the main standardizeFileName() loop.
 */
function standardizeFileNameUtility(originalName) {
    // Extract the file extension
    const extIndex = originalName.lastIndexOf('.');
    const extension = extIndex > 0 ? originalName.substring(extIndex) : '';
    const nameWithoutExt = extIndex > 0 ? originalName.substring(0, extIndex) : originalName;

    // Flexible Regex: Catches API, followed by 1-4 digits, TC, followed by 1-4 digits.
    const flexibleMatch = nameWithoutExt.match(/(API[_\s-]*\d{1,4}[_\s-]*TC[_\s-]*\d{1,4})/i);

    let newFileNamePart = nameWithoutExt;
    let descriptionPart = '';
    let isCodeFound = false;

    if (flexibleMatch) {
        isCodeFound = true;
        const rawCodePart = flexibleMatch[1]; 
        
        // Extract only the numbers (API and TC numbers)
        const numberComponents = rawCodePart.match(/\d{1,4}/g);
        
        if (numberComponents && numberComponents.length === 2) {
            
            // Standardize by padding with leading zeros to ensure 4 digits
            const num1 = numberComponents[0].padStart(4, '0');
            const num2 = numberComponents[1].padStart(4, '0');
            
            // Final standardized filename part: API_XXXX_TC_YYYY
            newFileNamePart = `API_${num1}_TC_${num2}`; 
            
            // 2. Get the Description Part (the string immediately following the matched code)
            const matchIndex = nameWithoutExt.indexOf(flexibleMatch[1]);
            descriptionPart = nameWithoutExt.substring(matchIndex + flexibleMatch[1].length);
            
            // Remove any leading separators (underscores, spaces, etc.) from the description
            descriptionPart = descriptionPart.replace(/^[^A-Z0-9]+/, ''); 
            
        } else {
            isCodeFound = false;
            newFileNamePart = nameWithoutExt; 
            descriptionPart = "NO_VALID_CODE_FOUND: " + nameWithoutExt;
        }

    } else {
        // CASE: NO MATCH FOUND
        newFileNamePart = nameWithoutExt; 
        descriptionPart = "NO_VALID_CODE_FOUND: " + nameWithoutExt;
    } 

    // Final new filename (e.g., API_0297_TC_1737.cs)
    const newFileName = newFileNamePart + extension;
    
    return {
        newFileName: newFileName,
        description: descriptionPart,
        isCodeFound: isCodeFound
    };
}


/**
 * SEPARATE FUNCTION: Handles commenting or uncommenting the entire file content.
 * This is called by the "Comment files" and "Uncomment files" buttons.
 */
async function commentFiles(isCommenting) {
    const input = document.getElementById('folderInput');
    const files = input.files;
    const status = document.getElementById('status');

    if (!files.length) {
        alert('Please select a folder');
        return;
    }

    status.textContent = isCommenting ? 'Commenting files...' : 'Uncommenting files...';
    const zip = new JSZip();

    for (const file of files) {
        const relativePath = file.webkitRelativePath;
        const content = await file.text();
        const trimmed = content.trimStart();

        let newContent = content;

        if (isCommenting) {
            // Add block comments if not already commented
            if (!trimmed.startsWith('/*')) {
                newContent = `/*\n${content}\n*/`;
            }
        } else {
            // Remove block comments if they exist
            if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
                newContent = trimmed.replace(/^\/\*\s*\n?/, '').replace(/\n?\s*\*\/$/, '');
            }
        }

        // We use the original file path for comment/uncomment mode
        zip.file(relativePath, newContent);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const fileName = isCommenting ? 'commented_folder.zip' : 'uncommented_folder.zip';
    saveAs(blob, fileName);
    status.textContent = 'Done! ZIP file is downloading.';
}