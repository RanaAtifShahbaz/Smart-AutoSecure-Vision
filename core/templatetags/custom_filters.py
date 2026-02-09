from django import template
import json

register = template.Library()

@register.filter
def to_str(value):
    return str(value)

@register.filter
def split_action(value):
    """Specific filter for logs action split logic"""
    if ':' in value:
        return value.split(':')[1]
    return value

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def startswith(text, starts):
    if isinstance(text, str):
        return text.startswith(starts)
    return False
