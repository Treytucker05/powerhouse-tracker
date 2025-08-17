const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Application Mapper
 * Maps all routes, components, pages, and their relationships
 */

class ApplicationMapper {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.map = {
            timestamp: new Date().toISOString(),
            routes: [],
            pages: [],
            components: [],
            unused: [],
            dependencies: {},
            entryPoints: [],
            summary: {}
        };
    }

    async mapApplication() {
        console.log('🗺️ Starting comprehensive application mapping...');
        
        try {
            // 1. Find all entry points
            await this.findEntryPoints();
            
            // 2. Map all routes
            await this.mapRoutes();
            
            // 3. Map all pages
            await this.mapPages();
            
            // 4. Map all components
            await this.mapComponents();
            
            // 5. Analyze dependencies
            await this.analyzeDependencies();
            
            // 6. Find unused files
            await this.findUnusedFiles();
            
            // 7. Generate comprehensive report
            await this.generateReport();
            
            console.log('✅ Application mapping complete!');
            
        } catch (error) {
            console.error('❌ Mapping failed:', error);
        }
    }

    async findEntryPoints() {
        console.log('🚪 Finding entry points...');
        
        const entryPointCandidates = [
            'src/main.jsx',
            'src/main.js',
            'src/index.jsx',
            'src/index.js',
            'src/App.jsx',
            'src/App.js'
        ];
        
        for (const candidate of entryPointCandidates) {
            const fullPath = path.join(this.rootPath, candidate);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                this.map.entryPoints.push({
                    path: candidate,
                    type: this.determineEntryPointType(candidate, content),
                    imports: this.extractImports(content),
                    routes: this.extractRoutes(content),
                    size: content.length
                });
            }
        }
    }

    determineEntryPointType(path, content) {
        if (path.includes('main')) return 'main';
        if (path.includes('index')) return 'index';
        if (path.includes('App')) return 'app';
        if (content.includes('ReactDOM.render') || content.includes('createRoot')) return 'root';
        return 'unknown';
    }

    async mapRoutes() {
        console.log('🛣️ Mapping routes...');
        
        // Find files that likely contain routing
        const routingFiles = await this.findFiles(this.rootPath, (filePath, content) => {
            return content.includes('Route') || 
                   content.includes('router') || 
                   content.includes('BrowserRouter') ||
                   content.includes('Routes');
        });
        
        for (const file of routingFiles) {
            const content = fs.readFileSync(file.path, 'utf8');
            const routes = this.extractDetailedRoutes(content);
            
            if (routes.length > 0) {
                this.map.routes.push({
                    file: file.relativePath,
                    routes: routes,
                    type: this.determineRoutingType(content)
                });
            }
        }
    }

    extractDetailedRoutes(content) {
        const routes = [];
        
        // Match React Router routes
        const routeMatches = content.match(/<Route[^>]*>/g);
        if (routeMatches) {
            routeMatches.forEach(match => {
                const pathMatch = match.match(/path=["']([^"']+)["']/);
                const elementMatch = match.match(/element=\{([^}]+)\}/);
                const componentMatch = match.match(/component=\{([^}]+)\}/);
                
                if (pathMatch) {
                    routes.push({
                        path: pathMatch[1],
                        element: elementMatch ? elementMatch[1] : null,
                        component: componentMatch ? componentMatch[1] : null,
                        type: 'react-router'
                    });
                }
            });
        }
        
        // Match programmatic navigation
        const navigateMatches = content.match(/navigate\(['"]([^'"]+)['"]\)/g);
        if (navigateMatches) {
            navigateMatches.forEach(match => {
                const pathMatch = match.match(/navigate\(['"]([^'"]+)['"]\)/);
                if (pathMatch) {
                    routes.push({
                        path: pathMatch[1],
                        type: 'programmatic-navigation',
                        action: 'navigate'
                    });
                }
            });
        }
        
        return routes;
    }

    determineRoutingType(content) {
        if (content.includes('BrowserRouter')) return 'react-router-dom';
        if (content.includes('HashRouter')) return 'react-router-hash';
        if (content.includes('MemoryRouter')) return 'react-router-memory';
        if (content.includes('Router')) return 'react-router';
        return 'unknown';
    }

    async mapPages() {
        console.log('📄 Mapping pages...');
        
        // Find all files in pages directory
        const pagesDir = path.join(this.rootPath, 'src/pages');
        if (fs.existsSync(pagesDir)) {
            const pageFiles = await this.findFiles(pagesDir);
            
            for (const file of pageFiles) {
                const content = fs.readFileSync(file.path, 'utf8');
                this.map.pages.push({
                    path: file.relativePath,
                    name: this.extractComponentName(content, file.name),
                    exports: this.extractExports(content),
                    imports: this.extractImports(content),
                    routes: this.extractRoutes(content),
                    tabs: this.extractTabs(content),
                    navigation: this.hasNavigationLogic(content),
                    components: this.extractUsedComponents(content),
                    hooks: this.extractHooks(content),
                    size: content.length,
                    complexity: this.calculateComplexity(content)
                });
            }
        }
    }

    async mapComponents() {
        console.log('🧩 Mapping components...');
        
        // Find all component files
        const componentDirs = [
            'src/components',
            'src/contexts',
            'src/hooks',
            'src/utils'
        ];
        
        for (const dir of componentDirs) {
            const fullDir = path.join(this.rootPath, dir);
            if (fs.existsSync(fullDir)) {
                const componentFiles = await this.findFiles(fullDir);
                
                for (const file of componentFiles) {
                    const content = fs.readFileSync(file.path, 'utf8');
                    this.map.components.push({
                        path: file.relativePath,
                        directory: dir,
                        name: this.extractComponentName(content, file.name),
                        type: this.determineComponentType(file.relativePath, content),
                        exports: this.extractExports(content),
                        imports: this.extractImports(content),
                        props: this.extractProps(content),
                        hooks: this.extractHooks(content),
                        hasState: content.includes('useState'),
                        hasEffects: content.includes('useEffect'),
                        hasNavigation: this.hasNavigationLogic(content),
                        hasTabs: this.hasTabLogic(content),
                        hasValidation: this.hasValidationLogic(content),
                        size: content.length,
                        complexity: this.calculateComplexity(content),
                        lastModified: fs.statSync(file.path).mtime
                    });
                }
            }
        }
    }

    determineComponentType(filePath, content) {
        if (filePath.includes('Context')) return 'context';
        if (filePath.includes('hooks')) return 'hook';
        if (filePath.includes('utils')) return 'utility';
        if (filePath.includes('ui/')) return 'ui-component';
        if (filePath.includes('program/tabs')) return 'program-tab';
        if (filePath.includes('assessment')) return 'assessment';
        if (content.includes('useState') || content.includes('useEffect')) return 'stateful-component';
        if (content.includes('function') && content.includes('return')) return 'functional-component';
        return 'unknown';
    }

    extractTabs(content) {
        const tabs = [];
        
        // Look for tab definitions
        const tabMatches = content.match(/\{[^}]*id[^}]*label[^}]*\}/g);
        if (tabMatches) {
            tabMatches.forEach(match => {
                const idMatch = match.match(/id:\s*['"]([^'"]+)['"]/);
                const labelMatch = match.match(/label:\s*['"]([^'"]+)['"]/);
                
                if (idMatch && labelMatch) {
                    tabs.push({
                        id: idMatch[1],
                        label: labelMatch[1]
                    });
                }
            });
        }
        
        return tabs;
    }

    extractUsedComponents(content) {
        const components = [];
        
        // Extract JSX component usage
        const jsxMatches = content.match(/<[A-Z][a-zA-Z0-9]*[^>]*>/g);
        if (jsxMatches) {
            jsxMatches.forEach(match => {
                const componentMatch = match.match(/<([A-Z][a-zA-Z0-9]*)/);
                if (componentMatch && !components.includes(componentMatch[1])) {
                    components.push(componentMatch[1]);
                }
            });
        }
        
        return components;
    }

    calculateComplexity(content) {
        let complexity = 0;
        
        // Basic complexity metrics
        complexity += (content.match(/function/g) || []).length;
        complexity += (content.match(/useState/g) || []).length * 2;
        complexity += (content.match(/useEffect/g) || []).length * 2;
        complexity += (content.match(/if\s*\(/g) || []).length;
        complexity += (content.match(/for\s*\(/g) || []).length;
        complexity += (content.match(/while\s*\(/g) || []).length;
        complexity += (content.match(/switch\s*\(/g) || []).length * 2;
        
        return complexity;
    }

    hasNavigationLogic(content) {
        const navigationKeywords = [
            'onNext', 'onPrevious', 'handleNext', 'handlePrevious',
            'navigate', 'router', 'Link', 'NavLink', 'useNavigate'
        ];
        return navigationKeywords.some(keyword => content.includes(keyword));
    }

    hasTabLogic(content) {
        const tabKeywords = [
            'Tab', 'TabsList', 'TabsContent', 'activeTab', 'setActiveTab',
            'tabs', 'tabId', 'currentTab', 'TabsTrigger'
        ];
        return tabKeywords.some(keyword => content.includes(keyword));
    }

    hasValidationLogic(content) {
        const validationKeywords = [
            'isValid', 'validation', 'validate', 'isFormValid',
            'required', 'error', 'disabled', 'phaCleared'
        ];
        return validationKeywords.some(keyword => content.includes(keyword));
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
                        from: match[2],
                        isLocal: match[2].startsWith('./') || match[2].startsWith('../')
                    });
                }
            });
        }
        
        return imports;
    }

    extractRoutes(content) {
        const routes = [];
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

    extractProps(content) {
        const props = [];
        
        // Look for destructured props in function parameters
        const propsMatch = content.match(/\(\s*\{\s*([^}]+)\s*\}\s*\)/);
        if (propsMatch) {
            const propNames = propsMatch[1].split(',').map(prop => prop.trim().split(':')[0].trim());
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

    async findFiles(dir, filter = null) {
        const files = [];
        
        const findFilesRecursive = (currentDir) => {
            try {
                const items = fs.readdirSync(currentDir);
                
                items.forEach(item => {
                    const fullPath = path.join(currentDir, item);
                    const stats = fs.statSync(fullPath);
                    
                    if (stats.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(item)) {
                        findFilesRecursive(fullPath);
                    } else if (stats.isFile() && (item.endsWith('.jsx') || item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.tsx'))) {
                        const content = filter ? fs.readFileSync(fullPath, 'utf8') : '';
                        if (!filter || filter(fullPath, content)) {
                            files.push({
                                path: fullPath,
                                relativePath: path.relative(this.rootPath, fullPath),
                                name: item,
                                size: stats.size,
                                modified: stats.mtime
                            });
                        }
                    }
                });
            } catch (error) {
                console.warn('Error reading directory:', currentDir, error.message);
            }
        };
        
        findFilesRecursive(dir);
        return files;
    }

    async analyzeDependencies() {
        console.log('🔗 Analyzing dependencies...');
        
        // Create dependency map between components
        const allFiles = [...this.map.pages, ...this.map.components];
        
        allFiles.forEach(file => {
            const dependencies = [];
            const dependents = [];
            
            file.imports.forEach(imp => {
                if (imp.isLocal) {
                    dependencies.push(imp.from);
                }
            });
            
            // Find who imports this file
            allFiles.forEach(otherFile => {
                otherFile.imports.forEach(imp => {
                    if (imp.isLocal && imp.from.includes(file.name.replace(/\.(jsx?|tsx?)$/, ''))) {
                        dependents.push(otherFile.path);
                    }
                });
            });
            
            this.map.dependencies[file.path] = {
                dependencies,
                dependents,
                isUsed: dependents.length > 0
            };
        });
    }

    async findUnusedFiles() {
        console.log('🗑️ Finding unused files...');
        
        const allFiles = [...this.map.pages, ...this.map.components];
        
        allFiles.forEach(file => {
            const deps = this.map.dependencies[file.path];
            if (deps && !deps.isUsed && !this.isEntryPointOrRoute(file)) {
                this.map.unused.push({
                    path: file.path,
                    type: file.type || 'component',
                    size: file.size,
                    reason: 'No imports found'
                });
            }
        });
    }

    isEntryPointOrRoute(file) {
        // Check if file is an entry point
        const isEntryPoint = this.map.entryPoints.some(entry => entry.path.includes(file.name));
        
        // Check if file is referenced in routes
        const isRoute = this.map.routes.some(route => 
            route.routes.some(r => r.element && r.element.includes(file.name))
        );
        
        return isEntryPoint || isRoute;
    }

    async generateReport() {
        console.log('📋 Generating comprehensive report...');
        
        this.map.summary = {
            totalFiles: this.map.pages.length + this.map.components.length,
            pages: this.map.pages.length,
            components: this.map.components.length,
            routes: this.map.routes.reduce((acc, r) => acc + r.routes.length, 0),
            unusedFiles: this.map.unused.length,
            entryPoints: this.map.entryPoints.length,
            complexity: {
                total: [...this.map.pages, ...this.map.components].reduce((acc, f) => acc + f.complexity, 0),
                average: [...this.map.pages, ...this.map.components].reduce((acc, f) => acc + f.complexity, 0) / (this.map.pages.length + this.map.components.length)
            }
        };
        
        // Write detailed report
        const reportContent = this.formatReport();
        fs.writeFileSync(
            path.join(this.rootPath, 'APPLICATION_MAP_COMPLETE.md'),
            reportContent
        );
        
        // Write JSON data
        fs.writeFileSync(
            path.join(this.rootPath, 'application-map.json'),
            JSON.stringify(this.map, null, 2)
        );
        
        console.log('📄 Reports saved:');
        console.log('  - APPLICATION_MAP_COMPLETE.md');
        console.log('  - application-map.json');
    }

    formatReport() {
        return `# Complete Application Map

Generated: ${this.map.timestamp}

## Summary
- **Total Files:** ${this.map.summary.totalFiles}
- **Pages:** ${this.map.summary.pages}
- **Components:** ${this.map.summary.components}
- **Routes:** ${this.map.summary.routes}
- **Unused Files:** ${this.map.summary.unusedFiles}
- **Entry Points:** ${this.map.summary.entryPoints}
- **Average Complexity:** ${this.map.summary.complexity.average.toFixed(2)}

## Entry Points
${this.map.entryPoints.map(entry => `
### ${entry.path}
- **Type:** ${entry.type}
- **Imports:** ${entry.imports.length}
- **Routes:** ${entry.routes.length}
`).join('')}

## Routes
${this.map.routes.map(route => `
### ${route.file}
- **Type:** ${route.type}
- **Routes:** ${route.routes.length}
${route.routes.map(r => `  - ${r.path} → ${r.element || r.component || 'N/A'}`).join('\n')}
`).join('')}

## Pages
${this.map.pages.map(page => `
### ${page.path}
- **Name:** ${page.name}
- **Size:** ${page.size} bytes
- **Complexity:** ${page.complexity}
- **Navigation:** ${page.navigation}
- **Tabs:** ${page.tabs.length > 0 ? page.tabs.map(t => t.label).join(', ') : 'None'}
- **Components Used:** ${page.components.join(', ')}
- **Hooks:** ${page.hooks.join(', ')}
`).join('')}

## Components by Type
${Object.entries(this.groupByType(this.map.components)).map(([type, components]) => `
### ${type} (${components.length})
${components.map(comp => `- **${comp.name}** (${comp.path}) - Size: ${comp.size}, Complexity: ${comp.complexity}`).join('\n')}
`).join('')}

## Unused Files (Candidates for Removal)
${this.map.unused.length > 0 ? this.map.unused.map(unused => `
- **${unused.path}** - ${unused.reason} (${unused.size} bytes)
`).join('') : 'No unused files found.'}

## Dependencies Analysis
${Object.entries(this.map.dependencies).slice(0, 10).map(([file, deps]) => `
### ${file}
- **Dependencies:** ${deps.dependencies.length}
- **Dependents:** ${deps.dependents.length}
- **Used:** ${deps.isUsed}
`).join('')}

## Recommendations
${this.generateRecommendations()}
`;
    }

    groupByType(items) {
        return items.reduce((acc, item) => {
            const type = item.type || 'unknown';
            if (!acc[type]) acc[type] = [];
            acc[type].push(item);
            return acc;
        }, {});
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.map.unused.length > 0) {
            recommendations.push(`- Remove ${this.map.unused.length} unused files to reduce bundle size`);
        }
        
        const highComplexity = [...this.map.pages, ...this.map.components].filter(f => f.complexity > 20);
        if (highComplexity.length > 0) {
            recommendations.push(`- Refactor ${highComplexity.length} high-complexity files`);
        }
        
        const duplicateRoutes = this.findDuplicateRoutes();
        if (duplicateRoutes.length > 0) {
            recommendations.push(`- Consolidate ${duplicateRoutes.length} duplicate routes`);
        }
        
        return recommendations.join('\n');
    }

    findDuplicateRoutes() {
        const routes = [];
        this.map.routes.forEach(routeFile => {
            routeFile.routes.forEach(route => {
                routes.push(route.path);
            });
        });
        
        const duplicates = routes.filter((route, index) => routes.indexOf(route) !== index);
        return [...new Set(duplicates)];
    }
}

// CLI usage
const workspacePath = process.argv[2] || process.cwd();
const mapper = new ApplicationMapper(workspacePath);
mapper.mapApplication();
