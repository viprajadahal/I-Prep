import requests
import json

# Simulate browser request to login
resp = requests.post(
    "http://127.0.0.1:8000/api/v1/auth/login",
    json={"email": "admin@iprep.com", "password": "admin123"},
    headers={"Origin": "http://localhost:3000", "Content-Type": "application/json"}
)
print("Status:", resp.status_code)
print("Headers:", dict(resp.headers))
print("Body:", json.dumps(resp.json(), indent=2))
