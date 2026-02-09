
import os
import re

TEMPLATE_DIR = 'templates'

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add {% load static %} if needed
    if '{% static' in content or "url_for('static'" in content:
        if '{% load static %}' not in content:
            content = "{% load static %}\n" + content

    # 1. url_for('static')
    # {{ url_for('static', filename='css/style.css') }} -> {% static 'css/style.css' %}
    content = re.sub(r"\{\{\s*url_for\('static',\s*filename=['\"]([^'\"]+)['\"]\)\s*\}\}", r"{% static '\1' %}", content)
    
    # 2. url_for generic
    # {{ url_for('view_name') }} -> {% url 'view_name' %}
    content = re.sub(r"\{\{\s*url_for\('([^']+)'\)\s*\}\}", r"{% url '\1' %}", content)

    # {{ url_for('view_name', arg=val) }} -> {% url 'view_name' arg=val %}
    # Handle single argument case which is common here
    def repl_url_args(match):
        view = match.group(1)
        args = match.group(2)
        # args might be "id=cam.id"
        # django syntax: {% url 'view' id=cam.id %}
        return f"{{% url '{view}' {args} %}}"
    
    # Regex for url_for with args
    content = re.sub(r"\{\{\s*url_for\('([^']+)',\s*([^)]+)\)\s*\}\}", repl_url_args, content)

    # 3. Dict access: item['key'] -> item.key
    # Only inside {{ ... }} or {% ... %}
    # This is tricky. Let's do a simple pass for known patterns.
    # common: person['name'], c['name'], item['name']
    
    # Pattern: \w+\['\w+'\]
    # We will look for usage in {{ ... }} tags specifically?
    # Or just replace all `['key']` with `.key` IF it looks like template variable usage?
    # Risk: JS arrays.
    # Better: Scan specific variables known to be dicts.
    # persons, contacts, logs, c, p, item.
    
    target_vars = ['person', 'c', 'log', 'item', 'cam', 'existing_person']
    for var in target_vars:
        # Replace var['key'] with var.key
        # Regex: \bvar\['(\w+)'\] -> var.\1
        pattern = re.compile(rf"\b{var}\['(\w+)'\]")
        content = pattern.sub(rf"{var}.\1", content)
        
        # Double quotes
        pattern2 = re.compile(rf'\b{var}\["(\w+)"\]')
        content = pattern2.sub(rf"{var}.\1", content)

    # Also: log.action.split...
    # split() works in python/jinja2. In Django templates, we need filters or custom methods.
    # But wait, logic: `log.action.split(':')[1]`
    # Django templates don't allow method calls with args like split(':').
    # I might need to implement a custom filter `split` or fix logic in view.
    # The current View logic for logs uses `camera_manager.get_stats()` which returns dicts with strings.
    # I should fix the logic in the VIEW or Model if possible, or register a custom filter.
    # For now, I will create a `templatetags` folder and add a `custom_filters.py`.
    
    # Fix `_id` access (ObjectId)
    # in template `{{ c._id }}` works if `c` is the dict. 
    # But `c['_id']` in jinja became `c._id` in django, which is correct.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Migrated {filepath}")

for filename in os.listdir(TEMPLATE_DIR):
    if filename.endswith('.html'):
        migrate_file(os.path.join(TEMPLATE_DIR, filename))
