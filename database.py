import sqlite3
def get_conn():
    conn=sqlite3.connect('cybershield.db'); conn.row_factory=sqlite3.Row; return conn
def init_db():
    conn=get_conn()
    conn.execute('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT)')
    conn.execute('CREATE TABLE IF NOT EXISTS logs (username TEXT, type TEXT, data TEXT, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
    conn.commit(); conn.close()
def create_user(u,p): c=get_conn(); c.execute("INSERT INTO users VALUES (?,?)",(u,p)); c.commit(); c.close()
def get_user(u): c=get_conn(); cur=c.execute("SELECT * FROM users WHERE username=?",(u,)); r=cur.fetchone(); c.close(); return r
def log_activity(token, type, data): 
    try:
        from jose import jwt; payload=jwt.decode(token, "cyber-shield-secret-123", algorithms=["HS256"]); u=payload.get("sub")
        c=get_conn(); c.execute("INSERT INTO logs (username,type,data) VALUES (?,?,?)",(u,type,data)); c.commit(); c.close()
    except: pass
def get_url_count(u): c=get_conn(); cur=c.execute("SELECT COUNT(*) FROM logs WHERE username=? AND type='url'",(u,)); r=cur.fetchone()[0]; c.close(); return r
def get_file_count(u): c=get_conn(); cur=c.execute("SELECT COUNT(*) FROM logs WHERE username=? AND type='file'",(u,)); r=cur.fetchone()[0]; c.close(); return r
