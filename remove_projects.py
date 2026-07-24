import codecs

with codecs.open('frontend/index.html', 'r', 'utf-8') as f:
    lines = f.readlines()

def find_line(marker):
    for i, line in enumerate(lines):
        if marker in line:
            return i
    return -1

projects_idx = find_line('<!-- ═══════════════ PROJECTS ═══════════════ -->')
services_idx = find_line('<!-- ═══════════════ SERVICES ═══════════════ -->')

new_lines = []
for i, line in enumerate(lines):
    if projects_idx <= i < services_idx:
        continue
    if '<a href="#projects">Projects</a>' in line:
        continue
    new_lines.append(line)

with codecs.open('frontend/index.html', 'w', 'utf-8') as f:
    f.writelines(new_lines)
print("Removed projects section successfully.")
