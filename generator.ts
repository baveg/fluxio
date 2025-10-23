import { Project, SyntaxKind } from 'npm:ts-morph@23.0.0';
import { join, dirname, basename } from 'jsr:@std/path@1';
import { ensureDir } from 'jsr:@std/fs@1';

/**
 * Splits a TypeScript file into multiple files, one per exported declaration
 * Usage: deno run -A generator.ts split path/to/file.ts
 */
async function splitFile(filePath: string): Promise<void> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  if (!sourceFile) {
    throw new Error(`Could not load file: ${filePath}`);
  }

  // Get the directory where split files will be created
  const fileDir = dirname(filePath);
  const fileName = basename(filePath, '.ts');
  const outputDir = join(fileDir, fileName);

  await ensureDir(outputDir);

  console.log(`Splitting ${filePath} into ${outputDir}/`);

  // Extract types first
  const types: string[] = [];
  sourceFile.getTypeAliases().forEach((typeAlias) => {
    if (typeAlias.isExported()) {
      types.push(typeAlias.getText());
    }
  });
  sourceFile.getInterfaces().forEach((iface) => {
    if (iface.isExported()) {
      types.push(iface.getText());
    }
  });

  // Create types.ts if there are exported types
  if (types.length > 0) {
    const typesFile = project.createSourceFile(join(outputDir, 'types.ts'), '', {
      overwrite: true,
    });
    typesFile.addStatements(types);
    console.log(`  ✓ types.ts (${types.length} types)`);
  }

  // Get all import declarations from original file
  const imports = sourceFile.getImportDeclarations();
  const importTexts = imports.map((imp) => imp.getText());

  // Extract each exported function/const
  const exports = sourceFile.getExportedDeclarations();
  let count = 0;

  exports.forEach((declarations, name) => {
    declarations.forEach((decl) => {
      // Skip type declarations (already handled)
      if (
        decl.isKind(SyntaxKind.TypeAliasDeclaration) ||
        decl.isKind(SyntaxKind.InterfaceDeclaration)
      ) {
        return;
      }

      // Create new file for this export
      const newFileName = join(outputDir, `${name}.ts`);
      const newFile = project.createSourceFile(newFileName, '', { overwrite: true });

      // Add imports (we'll add all for simplicity, could be optimized)
      importTexts.forEach((importText) => {
        newFile.addStatements(importText);
      });

      // Add type imports if types.ts exists
      if (types.length > 0) {
        newFile.addImportDeclaration({
          moduleSpecifier: './types',
          namedImports: extractTypeNames(types),
        });
      }

      // Get the full text of the declaration including JSDoc comments
      let declText = '';

      // Check if there's a JSDoc comment before the declaration
      const leadingComments = decl.getLeadingCommentRanges();
      if (leadingComments.length > 0) {
        const fullText = sourceFile.getFullText();
        leadingComments.forEach((comment) => {
          declText += fullText.slice(comment.getPos(), comment.getEnd()) + '\n';
        });
      }

      declText += decl.getText();

      // Add the declaration
      newFile.addStatements(declText);

      console.log(`  ✓ ${name}.ts`);
      count++;
    });
  });

  // Save all new files
  await project.save();

  console.log(`\n✓ Split complete: ${count} files created in ${outputDir}/`);
  console.log(`\nNext: deno run -A generator.ts index ${outputDir}`);
}

/**
 * Combines multiple TypeScript files from a directory into a single file
 * Usage: deno run -A generator.ts combine path/to/dir
 */
async function combineFiles(dirPath: string): Promise<void> {
  const project = new Project();

  // Read all .ts files in the directory (except index.ts)
  const files: string[] = [];
  for await (const entry of Deno.readDir(dirPath)) {
    if (entry.isFile && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      files.push(join(dirPath, entry.name));
    }
  }

  if (files.length === 0) {
    console.error(`No TypeScript files found in ${dirPath}`);
    Deno.exit(1);
  }

  console.log(`Combining ${files.length} files from ${dirPath}/`);

  // Create output file
  const dirName = basename(dirPath);
  const outputPath = join(dirname(dirPath), `${dirName}.ts`);
  const outputFile = project.createSourceFile(outputPath, '', { overwrite: true });

  // Collect all imports and declarations
  const allImports = new Set<string>();
  const allDeclarations: string[] = [];

  files.forEach((filePath) => {
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Collect imports (excluding relative imports to types.ts or similar)
    sourceFile.getImportDeclarations().forEach((imp) => {
      const moduleSpec = imp.getModuleSpecifierValue();
      if (!moduleSpec.startsWith('.')) {
        allImports.add(imp.getText());
      }
    });

    // Collect all exported declarations
    sourceFile.getExportedDeclarations().forEach((declarations) => {
      declarations.forEach((decl) => {
        // Get full text including JSDoc
        let declText = '';
        const leadingComments = decl.getLeadingCommentRanges();
        if (leadingComments.length > 0) {
          const fullText = sourceFile.getFullText();
          leadingComments.forEach((comment) => {
            declText += fullText.slice(comment.getPos(), comment.getEnd()) + '\n';
          });
        }
        declText += decl.getText();
        allDeclarations.push(declText);
      });
    });
  });

  // Add all imports
  allImports.forEach((importText) => {
    outputFile.addStatements(importText);
  });

  // Add empty line
  outputFile.addStatements('');

  // Add all declarations
  allDeclarations.forEach((declText) => {
    outputFile.addStatements(declText);
    outputFile.addStatements(''); // Add spacing between declarations
  });

  await project.save();

  console.log(`\n✓ Combined into ${outputPath}`);
}

/**
 * Creates an index.ts file that re-exports all files in a directory
 * Usage: deno run -A generator.ts index path/to/dir
 */
async function createIndex(dirPath: string): Promise<void> {
  const project = new Project();

  // Read all .ts files in the directory (except index.ts)
  const files: string[] = [];
  for await (const entry of Deno.readDir(dirPath)) {
    if (entry.isFile && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      files.push(entry.name.replace('.ts', ''));
    }
  }

  if (files.length === 0) {
    console.error(`No TypeScript files found in ${dirPath}`);
    Deno.exit(1);
  }

  console.log(`Creating index.ts with ${files.length} exports in ${dirPath}/`);

  // Create index.ts
  const indexPath = join(dirPath, 'index.ts');
  const indexFile = project.createSourceFile(indexPath, '', { overwrite: true });

  // Add re-exports for each file
  files.sort().forEach((fileName) => {
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${fileName}`,
    });
    console.log(`  ✓ export * from './${fileName}';`);
  });

  await project.save();

  console.log(`\n✓ Index created: ${indexPath}`);
}

/**
 * Extract type names from type declaration strings
 */
function extractTypeNames(types: string[]): string[] {
  const names: string[] = [];
  types.forEach((typeText) => {
    const match = typeText.match(/(?:export\s+)?(?:type|interface)\s+(\w+)/);
    if (match && match[1]) {
      names.push(match[1]);
    }
  });
  return names;
}

// Main CLI
if (import.meta.main) {
  const command = Deno.args[0];
  const target = Deno.args[1];

  if (!command || !target) {
    console.error(`
Usage:
  deno run -A generator.ts split <file>     Split file into multiple files
  deno run -A generator.ts combine <dir>    Combine directory files into one
  deno run -A generator.ts index <dir>      Create index.ts with re-exports

Examples:
  deno run -A generator.ts split src/color.ts
  deno run -A generator.ts index src/color
  deno run -A generator.ts combine src/color
    `);
    Deno.exit(1);
  }

  try {
    switch (command) {
      case 'split':
        await splitFile(target);
        break;
      case 'combine':
        await combineFiles(target);
        break;
      case 'index':
        await createIndex(target);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.error(`Valid commands: split, combine, index`);
        Deno.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    Deno.exit(1);
  }
}
