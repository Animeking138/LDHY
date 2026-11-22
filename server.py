#!/usr/bin/env python3
import http.server
import socketserver

PORT = 8000

class SecureHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Security headers
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
        self.send_header("Cache-Control", "public, max-age=3600")
        self.send_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), SecureHandler) as httpd:
        print(f"Secure server running on http://localhost:{PORT}")
        httpd.serve_forever()
