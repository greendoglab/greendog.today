#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys

from flask import Flask, render_template, url_for, request
from flask_flatpages import FlatPages
from datetime import date, datetime
from flask_frozen import Freezer

# config
DEBUG = False
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'
FLATPAGES_ROOT = 'content'
POSTS_DIR = 'blog'
PAGES_DIR = 'page'
PER_PAGE = 5
FEED_MAX_LINKS = 5

FLATPAGES_MARKDOWN_EXTENSIONS = ['tables', 'attr_list', 'extra']

BASE_URL = 'http://macgera.name'
FREEZER_BASE_URL = 'http://macgera.name'

FREEZER_DESTINATION = '../production'
FREEZER_RELATIVE_URLS = False

# app
app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)
freezer = Freezer(app)

def dateformat(value, format='%Y-%m-%d'):
    return value.strftime(format)

def timeformat(value, format='%H:%M'):
    return value.strftime(format)

app.jinja_env.filters['dateformat'] = dateformat
app.jinja_env.filters['timeformat'] = timeformat

# functions
def sorted_posts(posts_list):
    return sorted(posts_list, reverse=True, key=lambda p: p.meta['date'])

# get tags
def get_tags():
    z = (i.meta['tags'] for i in get_posts())
    f = []
    for i in z:
        for a in i:
            f.append(a)
    tags = sorted(set(f))
    return tags

# get tagged posts
def get_taget(posts_list, tag):
    tagged = [p for p in posts_list if tag in p.meta.get('tags', [])]
    tagged = sorted_posts(tagged)
    return tagged

# get posts
def get_posts():
    blog = [p for p in pages if p.path.startswith(POSTS_DIR)]
    posts = sorted_posts(blog)
    return posts

def get_years(pages):
    years = list(set([page.meta.get('date').year for page in pages]))
    years.reverse()
    return years

# views
@app.route('/')
def index():
    page = get_posts()[0]
    pages = get_posts()[1:6]
    return render_template('index.html', page = page, pages = pages)

@app.route('/tag/<string:tag>/')
def tag(tag):
    posts = get_posts()
    return render_template('tag.html', pages = get_taget(posts, tag), tag = tag)

@app.route('/rss/')
def feed():
    pages = get_posts()[:FEED_MAX_LINKS]
    now = datetime.now()
    return render_template('base.rss', pages = pages, BASE_URL = BASE_URL, build_date = now)

@app.route('/archive/')
def archive():
    years = get_years(get_posts())
    pages = get_posts()
    return render_template('archive.html', pages=pages, years = years)

# single page
@app.route('/<path:path>/')
def page(path):
    section = path.split('/')[0]
    page = pages.get_or_404(path)
    if section == 'blog':
        template = 'post.html'
    if section == 'page':
        template = 'page.html'
    return render_template(template, page = page)

# sys pages
@app.route('/403.html')
def error403():
    return render_template('403.html')

@app.route('/404.html')
def error404():
    return render_template('404.html')

@app.route('/500.html')
def error500():
    return render_template('500.html')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

# freezer
def make_external(url):
    return urljoin(request.url_root, url)

@freezer.register_generator
def pages_frozen():
    for page in pages:
        yield '/%s/' % page.path

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
        app.run(port=8000, debug=True)
