import os
import re
import json

base_dir = r"D:\antigravity"
results = []

for item in os.listdir(base_dir):
    full_path = os.path.join(base_dir, item)
    if not os.path.isdir(full_path):
        continue
    
    # check .git/config
    git_config_path = os.path.join(full_path, ".git", "config")
    repo_url = None
    pages_url = None
    title = None

    if os.path.exists(git_config_path):
        try:
            with open(git_config_path, "r", encoding="utf-8", errors="ignore") as f:
                cfg = f.read()
            m = re.search(r"url\s*=\s*(?:https://github\.com/|git@github\.com:)([^/\s]+)/([^/\s\.]+)", cfg)
            if m:
                owner, repo = m.group(1), m.group(2)
                repo_url = f"https://github.com/{owner}/{repo}"
                pages_url = f"https://{owner}.github.io/{repo}/"
        except Exception as e:
            pass

    # check index.html for title
    index_path = os.path.join(full_path, "index.html")
    has_index = os.path.exists(index_path)
    if has_index:
        try:
            with open(index_path, "r", encoding="utf-8", errors="ignore") as f:
                html_content = f.read(5000)
            tm = re.search(r"<title>(.*?)</title>", html_content, re.IGNORECASE | re.DOTALL)
            if tm:
                title = tm.group(1).strip()
        except Exception:
            pass

    # check README.md for pages link or better title
    readme_path = os.path.join(full_path, "README.md")
    if os.path.exists(readme_path):
        try:
            with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
                readme_content = f.read()
            pm = re.search(r"https://[a-zA-Z0-9_\-]+\.github\.io/[a-zA-Z0-9_\-\./]+", readme_content)
            if pm:
                pages_url = pm.group(0).rstrip(".)\"'")
            if not title:
                # first markdown header
                hm = re.search(r"^#\s+(.+)$", readme_content, re.MULTILINE)
                if hm:
                    title = hm.group(1).strip()
        except Exception:
            pass

    results.append({
        "folder": item,
        "has_index": has_index,
        "has_git": os.path.exists(os.path.join(full_path, ".git")),
        "repo_url": repo_url,
        "pages_url": pages_url,
        "title": title
    })

print(json.dumps(results, indent=2, ensure_ascii=False))
