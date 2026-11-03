import sqlite3

def get_conn():
    conn = sqlite3.connect('cybershield.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    conn.execute('''CREATE TABLE IF NOT EXISTS users 
                    (username TEXT PRIMARY KEY, password TEXT)''')
    conn.execute('''CREATE TABLE IF NOT EXISTS history 
                    (username TEXT, type TEXT, data TEXT, time TIMESTAMP)''')
    conn.commit()
    conn.close()

def create_user(username, hashed_password):
    conn = get_conn()
    conn.execute("INSERT INTO users VALUES (?,?)", (username, hashed_password))
    conn.commit()
    conn.close()

def get_user(username):
    conn = get_conn()
    cur = conn.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cur.fetchone()
    conn.close()
    return user

def get_url_check_count(username): return 0
def get_file_count(username): return 0
