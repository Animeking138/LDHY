#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000


class SecureHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
        # Avoid stale assets while developing locally.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")


if __name__ == "__main__":
    with ThreadingHTTPServer(("127.0.0.1", PORT), SecureHandler) as httpd:
        print(f"Local development server running at http://127.0.0.1:{PORT}")
        httpd.serve_forever()
