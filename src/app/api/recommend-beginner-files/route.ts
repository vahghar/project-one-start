// app/api/contribute/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Allowed code extensions (White-list approach is safer than black-list)
const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', // JS/TS
  '.py',                        // Python
  '.go',                        // Go
  '.rb',                        // Ruby
  '.rs',                        // Rust
  '.java', '.kt',               // Java/Kotlin
  '.c', '.cpp', '.h',           // C/C++
  '.css', '.scss', '.html'      // Web
];

const IGNORED_DIRS = [
  '.github', 'docs', 'node_modules', 'dist', 'build', 'coverage', 
  'test', 'tests', '__tests__', 'migrations'
];

// Heuristic: 1 line of code ≈ 30-50 bytes on average
// Easy: < 150 lines (~5KB)
// Medium: < 500 lines (~20KB)
function classifyBySize(size: number): 'easy' | 'medium' | 'advanced' {
  if (size < 5000) return 'easy';   // Approx < 100-150 lines
  if (size < 20000) return 'medium'; // Approx < 500 lines
  return 'advanced';
}

function isSourceFile(path: string): boolean {
  // 1. Check if it's in an ignored directory
  if (IGNORED_DIRS.some(dir => path.split('/').includes(dir))) return false;
  
  // 2. Check extension
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => path.endsWith(ext));
  if (!hasValidExt) return false;

  // 3. Exclude minified files or config files
  if (path.includes('.min.') || path.includes('.config.') || path.includes('.d.ts')) return false;

  return true;
}

type Recommendation = {
  path: string;
  size: number; // Changed from lines to size
  difficulty: 'easy' | 'medium' | 'advanced';
  description: string;
  relatedIssues: { number: number; title: string; url: string }[];
};

export async function POST(req: NextRequest) {
  try {
    const { githubUrl } = await req.json();
    if (!githubUrl) return NextResponse.json({ error: 'Missing githubUrl' }, { status: 400 });

    const match = githubUrl.match(/github\.com[:/](.+?)\/(.+?)(?:\.git|$)/);
    if (!match) return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    const [, owner, repo] = match;

    // 1) Get default branch
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const branch = repoData.default_branch;

    // 2) Fetch entire tree recursively (LIGHTWEIGHT - Metadata only)
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });

    // 3) Load 'good first issue' list
    // We wrap this in a try-catch because some repos have 0 issues and 404
    let goodIssues: any[] = [];
    try {
      goodIssues = await octokit.paginate(
        octokit.rest.issues.listForRepo,
        { owner, repo, labels: 'good first issue', state: 'open', per_page: 30 }
      );
    } catch (e) {
      console.warn("Could not fetch issues, continuing without them.");
    }

    // 4) Process files (SYNC FILTERING - FAST)
    const blobs = treeData.tree.filter(item => item.type === 'blob' && item.path && item.size);
    
    const recommendations: Recommendation[] = blobs
      .filter((file: any) => isSourceFile(file.path))
      .map((file: any) => {
        const difficulty = classifyBySize(file.size);
        
        // Find matching issues based on filename
        const relatedIssues = goodIssues
          .filter(issue => 
            (issue.body?.includes(file.path)) || 
            (issue.title?.includes(file.path))
          )
          .map(issue => ({ 
            number: issue.number, 
            title: issue.title, 
            url: issue.html_url 
          }));

        // Generate Description
        let description = 'Source file';
        const p = file.path.toLowerCase();
        if (p.includes('component')) description = 'UI Component';
        else if (p.includes('hook')) description = 'React Hook';
        else if (p.includes('utils') || p.includes('lib')) description = 'Utility Function';
        else if (p.includes('backend') || p.includes('api')) description = 'Backend Logic';
        else if (p.includes('test')) description = 'Test File';
        else if (p.endsWith('.css') || p.endsWith('.scss')) description = 'Styles';

        return {
          path: file.path,
          size: file.size,
          difficulty,
          description,
          relatedIssues
        };
      })
      // Sort: Issues first, then Easy -> Hard, then Smallest -> Largest
      .sort((a, b) => {
        if (a.relatedIssues.length > b.relatedIssues.length) return -1;
        if (b.relatedIssues.length > a.relatedIssues.length) return 1;
        
        const order = { easy: 0, medium: 1, advanced: 2 };
        if (order[a.difficulty] !== order[b.difficulty]) {
            return order[a.difficulty] - order[b.difficulty];
        }
        return a.size - b.size;
      })
      .slice(0, 20); // Return top 20 recommendations

    return NextResponse.json({ recommendations });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repo data' }, 
      { status: 500 }
    );
  }
}