#!/usr/bin/env node

/**
 * Workspace Deep Dive Analysis Tool
 * Comprehensive analysis of all program design implementations and components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkspaceAnalyzer {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.analysis = {
            timestamp: new Date().toISOString(),
            directoryStructure: {},
            programDesignFiles: [],
            components: {},
            routes: [],
            entryPoints: [],
            dependencies: {},
            implementations: []
        };
    }

    async analyzeWorkspace() {
        console.log('🔍 Starting comprehensive workspace analysis...');

        try {
            // 1. Analyze directory structure
            await this.analyzeDirectoryStructure();

            // 2. Find all program design related files
            await this.findProgramDesignFiles();

            // 3. Analyze components
            await this.analyzeComponents();

            // 4. Find routing configurations
            await this.analyzeRoutes();

            // 5. Identify entry points
            await this.findEntryPoints();

            // 6. Map dependencies
            await this.mapDependencies();

            // 7. Generate report
            await this.generateReport();

            console.log('✅ Analysis complete!');

        } catch (error) {
            console.error('❌ Analysis failed:', error);
        }
    }

    async analyzeDirectoryStructure() {
        console.log('📁 Analyzing directory structure...');

        const getDirectoryTree = (dirPath, level = 0) => {
            const tree = {};

            try {
                const items = fs.readdirSync(dirPath);

                items.forEach(item => {
                    const itemPath = path.join(dirPath, item);
                    const stats = fs.statSync(itemPath);

                    if (stats.isDirectory()) {
                        // Skip node_modules, .git, dist, build folders
                        if (['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
                            tree[item] = '[SKIPPED]';
                        } else if (level < 4) { // Limit depth
                            tree[item] = getDirectoryTree(itemPath, level + 1);
                        } else {
                            tree[item] = '[MAX_DEPTH]';
                        }
                    } else {
                        tree[item] = 'FILE';
                    }
                });
            } catch (error) {
                tree['ERROR'] = error.message;
            }

            return tree;
        };

        this.analysis.directoryStructure = getDirectoryTree(this.rootPath);
    }

    async findProgramDesignFiles() {
        console.log('🎯 Finding program design files...');

        const searchPatterns = [
            /program/i,
            /design/i,
            /assessment/i,
            /goals/i,
            /periodization/i,
            /training/i,
            /block/i,
            /sequence/i,
            /loading/i,
            /methods/i,
            /preview/i
        ];

        const findFiles = (dir, files = []) => {
            try {
                const items = fs.readdirSync(dir);

                items.forEach(item => {
                    const fullPath = path.join(dir, item);
                    const stats = fs.statSync(fullPath);

                    if (stats.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(item)) {
                        findFiles(fullPath, files);
                    } else if (stats.isFile() && (item.endsWith('.jsx') || item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.tsx'))) {
                        // Check if filename matches any pattern
                        const matchesPattern = searchPatterns.some(pattern => pattern.test(item));

                        if (matchesPattern) {
                            files.push({
                                path: fullPath,
                                relativePath: path.relative(this.rootPath, fullPath),
                                name: item,
                                type: path.extname(item),
                                size: stats.size,
                                modified: stats.mtime
                            });
                        }
                    }
                });
            } catch (error) {
                console.warn('Error reading directory:', dir, error.message);
            }

            return files;
        };

        this.analysis.programDesignFiles = findFiles(this.rootPath);
    }

    async analyzeComponents() {
        console.log('🧩 Analyzing components...');

        for (const file of this.analysis.programDesignFiles) {
            try {
                const content = fs.readFileSync(file.path, 'utf8');

                // Extract component information
                const componentInfo = {
                    path: file.relativePath,
                    name: this.extractComponentName(content, file.name),
                    exports: this.extractExports(content),
                    imports: this.extractImports(content),
                    props: this.extractProps(content),
                    hooks: this.extractHooks(content),
                    routes: this.extractRoutes(content),
                    hasNavigation: this.hasNavigationLogic(content),
                    hasTabs: this.hasTabLogic(content),
                    hasFormValidation: this.hasFormValidation(content),
                    textContent: this.extractTextContent(content),
                    lineCount: content.split('\n').length
                };

                this.analysis.components[file.relativePath] = componentInfo;

            } catch (error) {
                console.warn('Error analyzing component:', file.path, error.message);
            }
        }
    }

    extractComponentName(content, filename) {
        // Try to find component name from export or function declaration
        const exportMatch = content.match(/export\s+default\s+(\w+)/);
        if (exportMatch) return exportMatch[1];

        const functionMatch = content.match(/(?:function|const)\s+(\w+)/);
        if (functionMatch) return functionMatch[1];

        return filename.replace(/\.(jsx?|tsx?)$/, '');
    }

    extractExports(content) {
        const exports = [];

        // Default export
        const defaultExport = content.match(/export\s+default\s+(\w+)/);
        if (defaultExport) exports.push({ type: 'default', name: defaultExport[1] });

        // Named exports
        const namedExports = content.match(/export\s+(?:const|function|class)\s+(\w+)/g);
        if (namedExports) {
            namedExports.forEach(exp => {
                const match = exp.match(/export\s+(?:const|function|class)\s+(\w+)/);
                if (match) exports.push({ type: 'named', name: match[1] });
            });
        }

        return exports;
    }

    extractImports(content) {
        const imports = [];
        const importLines = content.match(/import\s+.*?from\s+['"][^'"]+['"];?/g);

        if (importLines) {
            importLines.forEach(line => {
                const match = line.match(/import\s+(.*?)\s+from\s+['"]([^'"]+)['"]/);
                if (match) {
                    imports.push({
                        imports: match[1].trim(),
                        from: match[2]
                    });
                }
            });
        }

        return imports;
    }

    extractProps(content) {
        const props = [];

        // Look for destructured props in function parameters
        const propsMatch = content.match(/\(\s*\{\s*([^}]+)\s*\}\s*\)/);
        if (propsMatch) {
            const propNames = propsMatch[1].split(',').map(prop => prop.trim());
            props.push(...propNames);
        }

        return props;
    }

    extractHooks(content) {
        const hooks = [];
        const hookMatches = content.match(/use\w+\(/g);

        if (hookMatches) {
            hookMatches.forEach(hook => {
                const hookName = hook.replace('(', '');
                if (!hooks.includes(hookName)) {
                    hooks.push(hookName);
                }
            });
        }

        return hooks;
    }

    extractRoutes(content) {
        const routes = [];

        // Look for route definitions
        const routeMatches = content.match(/(?:path|to)=["']([^"']+)["']/g);
        if (routeMatches) {
            routeMatches.forEach(match => {
                const route = match.match(/["']([^"']+)["']/)[1];
                if (!routes.includes(route)) {
                    routes.push(route);
                }
            });
        }

        return routes;
    }

    hasNavigationLogic(content) {
        const navigationKeywords = [
            'onNext', 'onPrevious', 'handleNext', 'handlePrevious',
            'navigate', 'router', 'Link', 'NavLink'
        ];

        return navigationKeywords.some(keyword => content.includes(keyword));
    }

    hasTabLogic(content) {
        const tabKeywords = [
            'Tab', 'TabsList', 'TabsContent', 'activeTab', 'setActiveTab',
            'tabs', 'tabId', 'currentTab'
        ];

        return tabKeywords.some(keyword => content.includes(keyword));
    }

    hasFormValidation(content) {
        const validationKeywords = [
            'isValid', 'validation', 'validate', 'isFormValid',
            'required', 'error', 'disabled'
        ];

        return validationKeywords.some(keyword => content.includes(keyword));
    }

    extractTextContent(content) {
        const textMatches = [];

        // Extract string literals that might be UI text
        const stringMatches = content.match(/["']([^"']{10,})["']/g);
        if (stringMatches) {
            stringMatches.forEach(match => {
                const text = match.slice(1, -1); // Remove quotes
                if (text.length > 10 && !text.includes('/') && !text.includes('\\')) {
                    textMatches.push(text);
                }
            });
        }

        return textMatches.slice(0, 10); // Limit to first 10 matches
    }

    async analyzeRoutes() {
        console.log('🛣️ Analyzing routes...');

        // Find routing configuration files
        const routeFiles = this.analysis.programDesignFiles.filter(file =>
            file.name.toLowerCase().includes('route') ||
            file.name.toLowerCase().includes('app') ||
            file.name.toLowerCase().includes('index')
        );

        // Extract route information from components
        for (const [path, component] of Object.entries(this.analysis.components)) {
            if (component.routes.length > 0) {
                this.analysis.routes.push(...component.routes.map(route => ({
                    route,
                    component: path,
                    hasNavigation: component.hasNavigation,
                    hasTabs: component.hasTabs
                })));
            }
        }
    }

    async findEntryPoints() {
        console.log('🚪 Finding entry points...');

        const entryPointCandidates = [
            'src/index.js',
            'src/index.jsx',
            'src/App.js',
            'src/App.jsx',
            'src/main.js',
            'src/main.jsx',
            'index.js',
            'app.js'
        ];

        entryPointCandidates.forEach(candidate => {
            const fullPath = path.join(this.rootPath, candidate);
            if (fs.existsSync(fullPath)) {
                this.analysis.entryPoints.push({
                    path: candidate,
                    exists: true
                });
            }
        });
    }

    async mapDependencies() {
        console.log('🔗 Mapping dependencies...');

        // Create dependency map between components
        for (const [componentPath, component] of Object.entries(this.analysis.components)) {
            const dependencies = [];

            component.imports.forEach(imp => {
                if (imp.from.startsWith('./') || imp.from.startsWith('../')) {
                    dependencies.push(imp.from);
                }
            });

            this.analysis.dependencies[componentPath] = dependencies;
        }
    }

    async generateReport() {
        console.log('📋 Generating analysis report...');

        const report = {
            summary: {
                totalFiles: this.analysis.programDesignFiles.length,
                totalComponents: Object.keys(this.analysis.components).length,
                totalRoutes: this.analysis.routes.length,
                entryPoints: this.analysis.entryPoints.length,
                timestamp: this.analysis.timestamp
            },
            implementations: this.identifyImplementations(),
            keyFindings: this.generateKeyFindings(),
            recommendations: this.generateRecommendations()
        };

        // Write detailed report
        const reportContent = this.formatReport(report);
        fs.writeFileSync(
            path.join(this.rootPath, 'WORKSPACE_ANALYSIS_DETAILED.md'),
            reportContent
        );

        // Write JSON data
        fs.writeFileSync(
            path.join(this.rootPath, 'workspace-analysis.json'),
            JSON.stringify(this.analysis, null, 2)
        );

        console.log('📄 Reports saved:');
        console.log('  - WORKSPACE_ANALYSIS_DETAILED.md');
        console.log('  - workspace-analysis.json');
    }

    identifyImplementations() {
        const implementations = [];

        // Group components by likely implementation
        const groups = {};

        Object.entries(this.analysis.components).forEach(([path, component]) => {
            const dir = path.split('/').slice(0, -1).join('/');
            if (!groups[dir]) groups[dir] = [];
            groups[dir].push({ path, ...component });
        });

        Object.entries(groups).forEach(([dir, components]) => {
            if (components.length > 1) {
                implementations.push({
                    directory: dir,
                    components: components.length,
                    files: components.map(c => c.path),
                    hasNavigation: components.some(c => c.hasNavigation),
                    hasTabs: components.some(c => c.hasTabs),
                    hasValidation: components.some(c => c.hasFormValidation)
                });
            }
        });

        return implementations;
    }

    generateKeyFindings() {
        const findings = [];

        // Find components with navigation
        const navComponents = Object.entries(this.analysis.components)
            .filter(([path, comp]) => comp.hasNavigation)
            .map(([path]) => path);

        if (navComponents.length > 0) {
            findings.push(`Found ${navComponents.length} components with navigation logic`);
        }

        // Find components with tabs
        const tabComponents = Object.entries(this.analysis.components)
            .filter(([path, comp]) => comp.hasTabs)
            .map(([path]) => path);

        if (tabComponents.length > 0) {
            findings.push(`Found ${tabComponents.length} components with tab functionality`);
        }

        // Find components with form validation
        const validationComponents = Object.entries(this.analysis.components)
            .filter(([path, comp]) => comp.hasFormValidation)
            .map(([path]) => path);

        if (validationComponents.length > 0) {
            findings.push(`Found ${validationComponents.length} components with form validation`);
        }

        return findings;
    }

    generateRecommendations() {
        return [
            'Review all identified implementations to understand the architecture',
            'Identify which implementation the user is currently viewing',
            'Create a unified navigation system if multiple implementations exist',
            'Consolidate duplicate functionality where appropriate'
        ];
    }

    formatReport(report) {
        return `# Workspace Analysis Report

Generated: ${report.summary.timestamp}

## Summary
- **Total Files:** ${report.summary.totalFiles}
- **Total Components:** ${report.summary.totalComponents}
- **Total Routes:** ${report.summary.totalRoutes}
- **Entry Points:** ${report.summary.entryPoints}

## Identified Implementations
${report.implementations.map(impl => `
### ${impl.directory}
- Components: ${impl.components}
- Files: ${impl.files.join(', ')}
- Has Navigation: ${impl.hasNavigation}
- Has Tabs: ${impl.hasTabs}
- Has Validation: ${impl.hasValidation}
`).join('')}

## Key Findings
${report.keyFindings.map(finding => `- ${finding}`).join('\n')}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Detailed Component Analysis
${Object.entries(this.analysis.components).map(([path, comp]) => `
### ${path}
- **Name:** ${comp.name}
- **Exports:** ${comp.exports.map(e => `${e.type}:${e.name}`).join(', ')}
- **Props:** ${comp.props.join(', ')}
- **Hooks:** ${comp.hooks.join(', ')}
- **Has Navigation:** ${comp.hasNavigation}
- **Has Tabs:** ${comp.hasTabs}
- **Has Validation:** ${comp.hasFormValidation}
- **Text Content:** ${comp.textContent.slice(0, 3).join(', ')}
`).join('')}
`;
    }
}

// Export for use in Node.js environment
export default WorkspaceAnalyzer;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const workspacePath = process.argv[2] || process.cwd();
    const analyzer = new WorkspaceAnalyzer(workspacePath);
    analyzer.analyzeWorkspace();
}
