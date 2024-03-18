
from flask import Flask, jsonify

app = Flask(__name__)

data = [
    {
        "fileName": "auth.js",
        "sensitiveFindings": [
            "JWT_ASYNC_SECERT_KEY",
            "JWT_CLIENT_SECRET_KEY",
            "JWT_COMMAND_CENTER_SECRET_KEY",
            "JWT_LOOKUP_SECERT_KEY",
            "JWT_SECRET",
            "JWT_WEB_SECERT_KEY",
            "JWT_XMPP_SECERT_KEY",
        ],
        "cvssScore": 7.5,
        "epssScore": 4.2,
        "combinedScore": 5.8,
    },
    {
        "fileName": "firebase.config",
        "sensitiveFindings": [
            "FIREBASE_API_JSON",
            "FIREBASE_API_TOKEN",
            "FIREBASE_KEY",
        ],
        "cvssScore": 9.4,
        "epssScore": 6.2,
        "combinedScore": 7.5,
    },
]


@app.route('/reports')
def get_reports():
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
    # deepcode ignore RunWithDebugTrue: <Testing>
