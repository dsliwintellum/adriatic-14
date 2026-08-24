#!/usr/bin/env python3
import base64
import json
import time
import urllib.request
from pathlib import Path
import websocket

BASE = 'about:blank'
APP_DIR = Path('/mnt/data/adriatic14_fixed')
CDP = 'http://127.0.0.1:9223'
OUT = Path('/mnt/data/adriatic14_fixed/docs')
OUT.mkdir(parents=True, exist_ok=True)

# Static PWA resource checks before browser interaction.
required_files = [
    'index.html', 'styles.css', 'content.js', 'app.js',
    'manifest.webmanifest', 'sw.js',
    'assets/icon-192.png', 'assets/icon-512.png'
]
missing = [name for name in required_files if not (APP_DIR / name).is_file()]
if missing:
    raise AssertionError('Missing required app files: ' + ', '.join(missing))
manifest = json.loads((APP_DIR / 'manifest.webmanifest').read_text())
for key in ('name', 'short_name', 'start_url', 'display', 'icons'):
    if key not in manifest:
        raise AssertionError(f'Manifest is missing required key: {key}')
for icon in manifest['icons']:
    if not (APP_DIR / icon['src']).is_file():
        raise AssertionError('Manifest icon does not exist: ' + icon['src'])
service_worker = (APP_DIR / 'sw.js').read_text()
for name in required_files:
    if name in ('sw.js',):
        continue
    if name not in service_worker and name not in ('index.html',):
        raise AssertionError('Service worker cache list does not reference: ' + name)

req = urllib.request.Request(f'{CDP}/json/new?about:blank', method='PUT')
with urllib.request.urlopen(req) as response:
    target = json.load(response)

ws = websocket.create_connection(target['webSocketDebuggerUrl'], timeout=10, origin='http://127.0.0.1:9223')
seq = 0
errors = []

def call(method, params=None, timeout=10):
    global seq
    seq += 1
    ident = seq
    ws.send(json.dumps({'id': ident, 'method': method, 'params': params or {}}))
    end = time.time() + timeout
    while time.time() < end:
        msg = json.loads(ws.recv())
        if msg.get('method') == 'Runtime.exceptionThrown':
            errors.append(msg['params']['exceptionDetails'].get('text', 'Runtime exception'))
        if msg.get('method') == 'Log.entryAdded' and msg['params']['entry'].get('level') == 'error':
            errors.append(msg['params']['entry'].get('text', 'Console error'))
        if msg.get('id') == ident:
            if 'error' in msg:
                raise RuntimeError(msg['error'])
            return msg.get('result', {})
    raise TimeoutError(method)

def evaluate(expression):
    result = call('Runtime.evaluate', {'expression': expression, 'returnByValue': True, 'awaitPromise': True})
    return result.get('result', {}).get('value')

def wait_ready(seconds=8):
    end = time.time() + seconds
    while time.time() < end:
        try:
            if evaluate('Boolean(window.__ADRIATIC14_READY__)'):
                return
        except Exception:
            pass
        time.sleep(0.15)
    raise RuntimeError('App did not become ready')

def wait_for(expression, seconds=5):
    end = time.time() + seconds
    while time.time() < end:
        if evaluate(expression):
            return True
        time.sleep(0.12)
    raise RuntimeError(f'Condition failed: {expression}')

def screenshot(name):
    data = call('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': False})['data']
    path = OUT / name
    path.write_bytes(base64.b64decode(data))
    return path

call('Page.enable')
call('Runtime.enable')
call('Log.enable')
call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
index = (APP_DIR / 'index.html').read_text()
css = (APP_DIR / 'styles.css').read_text()
content_js = (APP_DIR / 'content.js').read_text()
app_js = (APP_DIR / 'app.js').read_text().replace("if ('serviceWorker' in navigator && location.protocol !== 'file:')", "if (false && 'serviceWorker' in navigator)")
index = index.replace('<link rel="manifest" href="manifest.webmanifest" />', '')
index = index.replace('<link rel="icon" href="assets/icon-192.png" />', '')
index = index.replace('<link rel="apple-touch-icon" href="assets/icon-192.png" />', '')
index = index.replace('<link rel="stylesheet" href="styles.css" />', f'<style>{css}</style>')
index = index.replace('<script src="content.js"></script>', f'<script>{content_js}</script>')
index = index.replace('<script src="app.js"></script>', f'<script>{app_js}</script>')
frame_id = call('Page.getFrameTree')['frameTree']['frame']['id']
call('Page.setDocumentContent', {'frameId': frame_id, 'html': index})
wait_ready()
wait_for("document.body.innerText.includes('Speak your way through the Adriatic')")
assert evaluate("document.querySelectorAll('.nav-item').length") == 5
assert evaluate("document.querySelectorAll('.route-stop').length") == 4
screenshot('home-desktop.png')

# Main routes
expected = {
    'course': 'Your course',
    'practice': 'Practice',
    'phrasebook': 'Phrasebook',
    'trip': 'Your Adriatic route',
}
for route, heading in expected.items():
    evaluate(f"location.hash='#/{route}'")
    wait_for(f"document.body.innerText.includes({json.dumps(heading)})")
    assert evaluate("document.querySelector('#view').innerText.length") > 100

evaluate("location.hash='#/course'")
wait_for("document.body.innerText.includes('Your course')")
assert evaluate("document.querySelectorAll('.lesson-card').length") == 14

# Every lesson should render its title and all four tabs.
for day in range(1, 15):
    evaluate(f"location.hash='#/lesson/{day}'")
    wait_for("document.querySelector('.lesson-hero h1') !== null")
    title = evaluate("document.querySelector('.lesson-hero h1')?.textContent")
    if not title:
        raise AssertionError(f'Lesson {day} has no title')
    assert evaluate("document.querySelectorAll('.lesson-tab').length") == 4

# Challenge interaction on lesson 1
evaluate("location.hash='#/lesson/1'")
wait_for("document.querySelector('.lesson-hero h1')?.textContent.includes('Sound map')")
evaluate("document.querySelector('[data-lesson-tab=\"challenge\"]').click()")
wait_for("document.querySelector('[data-panel=\"challenge\"]').classList.contains('active')")
evaluate("document.querySelector('[data-quiz-answer=\"0\"]').click()")
wait_for("document.querySelector('.quiz-feedback').textContent.trim().length > 0")

# Flashcard interaction
evaluate("location.hash='#/practice/flashcards'")
wait_for("document.querySelector('.flashcard') !== null")
evaluate("document.querySelector('.flashcard').click()")
wait_for("document.querySelector('.flashcard').classList.contains('flipped')")

# Phrasebook search
evaluate("location.hash='#/phrasebook'")
wait_for("document.querySelector('#phrase-search') !== null")
evaluate("const x=document.querySelector('#phrase-search'); x.value='parking'; x.dispatchEvent(new Event('input',{bubbles:true}))")
wait_for("document.querySelector('#phrasebook-results').innerText.toLowerCase().includes('parking')")

# Quick phrase sheet
evaluate("document.querySelector('[data-open-quick]').click()")
wait_for("document.querySelector('#quick-say').classList.contains('open')")
assert evaluate("document.querySelectorAll('.quick-category').length") == 8
evaluate("document.querySelector('[data-close-sheet]').click()")

# Mobile home screenshot
call('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 844, 'deviceScaleFactor': 2, 'mobile': True})
evaluate("location.hash='#/home'")
wait_for("document.body.innerText.includes('Speak your way through the Adriatic')")
screenshot('home-mobile.png')

# Mobile lesson screenshot
call('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 844, 'deviceScaleFactor': 2, 'mobile': True})
evaluate("location.hash='#/lesson/8'")
wait_for("document.querySelector('.lesson-hero h1')?.textContent.includes('Perast')")
screenshot('lesson-perast-mobile.png')

print(json.dumps({
    'status': 'passed',
    'lessons_rendered': 14,
    'routes_checked': list(expected),
    'runtime_errors': errors,
    'screenshots': ['home-desktop.png', 'home-mobile.png', 'lesson-perast-mobile.png']
}, indent=2))

if errors:
    raise SystemExit('Runtime errors detected: ' + '; '.join(errors))

call('Page.close')
ws.close()
