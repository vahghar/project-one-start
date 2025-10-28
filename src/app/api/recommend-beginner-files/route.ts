// pages/api/contribute.ts
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Skip these extensions/directories entirely
const IGNORED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg',
  '.lock', '.yml', '.yaml', '.md', '.json',
];
const IGNORED_DIRS = [
  '.github/', 'docs/', 'scripts/', 'config/', 'node_modules/',
];

// Buckets based on line counts
function classifyByLines(lines: number): 'easy' | 'medium' | 'advanced' {
  if (lines < 30) return 'easy';
  if (lines < 150) return 'medium';
  return 'advanced';
}

// Simple path filter
function isSourceFile(path: string): boolean {
  if (!path.startsWith('src/')) return false;
  if (IGNORED_DIRS.some(dir => path.includes(dir))) return false;
  if (IGNORED_EXTENSIONS.some(ext => path.endsWith(ext))) return false;
  return true;
}

type Recommendation = {
  path: string;
  lines: number;
  difficulty: 'easy' | 'medium' | 'advanced';
  description: string;
  relatedIssues: { number: number; title: string; url: string }[];
};

export async function POST(req: NextRequest) {
  const { githubUrl } = await req.json();
  if (!githubUrl) {
    return NextResponse.json({ error: 'Missing githubUrl' }, { status: 400 });
  }

  // Extract owner/repo
  const match = githubUrl.match(/github\.com[:/](.+?)\/(.+?)(?:\.git|$)/);
  if (!match) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
  }
  const [, owner, repo] = match;

  try {
    // 1) Get default branch
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const branch = repoData.default_branch;

    // 2) Fetch entire tree recursively
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });
    const blobs = treeData.tree.filter(item => item.type === 'blob');

    // 3) Load 'good first issue' list
    const goodIssues = await octokit.paginate(
      octokit.rest.issues.listForRepo,
      { owner, repo, labels: 'good first issue', state: 'open', per_page: 100 }
    );

    // 4) Process files
    const recs = await Promise.all(
      blobs
        .map(b => b.path)
        .filter((path): path is string => typeof path === 'string' && isSourceFile(path))
        .map(async path => {
          // Fetch content
          const contentRes = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });

          if (!('content' in contentRes.data)) {
            return null;
          }

          const raw = Buffer.from(contentRes.data.content!, 'base64').toString('utf8');
          const lines = raw.split('\n').length;
          const difficulty = classifyByLines(lines);

          // Find matching issues
          const relatedIssues = goodIssues
            .filter(issue =>
              (typeof issue.body === 'string' && issue.body.includes(path)) ||
              (typeof issue.title === 'string' && issue.title.includes(path))
            )
            .map(issue => ({ number: issue.number, title: issue.title, url: issue.html_url }));

          // Short description
          let description = 'Source file';
          if (path.includes('component')) description = 'UI component';
          else if (path.includes('hook')) description = 'Custom hook';
          else if (path.includes('util') || path.includes('helper')) description = 'Utility/helper';

          return { path, lines, difficulty, description, relatedIssues } as Recommendation;
        })
    );

    // 5) Filter out nulls and sort
    const recommendations: Recommendation[] = recs
      .filter((r): r is Recommendation => r !== null)
      .sort((a, b) => {
        const order = { easy: 0, medium: 1, advanced: 2 };
        return order[a.difficulty] - order[b.difficulty] || a.lines - b.lines;
      });

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repo information' },
      { status: 500 }
    );
  }
}
